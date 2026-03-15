"""Webhook endpoints for handling incoming WhatsApp messages from WAHA.

Webhooks are stateless handlers that validate inputs and delegate to services.
Integrates with WAHA (WhatsApp API HTTP client), Docker Model Runner LLM, and persistent memory.
"""

import asyncio
import json
import logging
import re
import yaml
from pathlib import Path

import httpx
import litellm
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from botsqware.config import Settings, get_settings
from botsqware.db.models import Fact, Message
from botsqware.db.session import Database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


class WAHAPayloadData(BaseModel):
    """WAHA message payload data."""

    id: str
    timestamp: int
    from_: str = Field(alias="from")
    fromMe: bool = False
    body: str = ""
    data: dict = Field(default_factory=dict, alias="_data")

    class Config:
        populate_by_name = True


class WAHAWebhookPayload(BaseModel):
    """WAHA webhook payload structure."""

    event: str
    session: str
    payload: WAHAPayloadData


class WhatsAppWebhookService:
    """Service handling WhatsApp webhook logic."""

    MEMORY_COMMANDS = {
        "mémoire",
        "décisions",
        "rappelle-toi",
        "ce qu'on a décidé",
        "ce que vous savez",
    }

    _band_profile: dict | None = None

    def __init__(self, session: AsyncSession | None, settings: Settings):
        self.session = session
        self.settings = settings

    def _get_band_profile(self) -> dict:
        """Load band profile YAML once (cached)."""
        if self.__class__._band_profile is None:
            profile_path = Path(self.settings.band_profile_path)
            with open(profile_path, "r", encoding="utf-8") as f:
                self.__class__._band_profile = yaml.safe_load(f)
        return self.__class__._band_profile

    async def _get_recent_facts(self, group: str, limit: int = 5) -> list[Fact]:
        """Fetch recent active facts for context injection."""
        if self.session is None:
            return []

        try:
            stmt = (
                select(Fact)
                .where(Fact.active == 1)
                .order_by(Fact.created_at.desc())
                .limit(limit)
            )
            result = await self.session.execute(stmt)
            return list(result.scalars().all())
        except Exception as e:
            logger.warning(f"Failed to load facts: {e}")
            return []

    @staticmethod
    def _format_facts_context(facts: list[Fact]) -> str:
        """Format facts as context string for LLM."""
        if not facts:
            return ""

        formatted = "Faits récents:\n"
        for fact in facts:
            formatted += f"- [{fact.category}] {fact.subject}: {fact.content}\n"
        return formatted.rstrip()

    def _is_memory_command(self, message: str) -> bool:
        """Check if message is a memory/recall command."""
        lower_msg = message.lower()
        return any(cmd in lower_msg for cmd in self.MEMORY_COMMANDS)

    async def _get_facts_summary(self) -> str:
        """Get grouped summary of all active facts."""
        if self.session is None:
            return "Aucun fait mémorisé."

        try:
            stmt = (
                select(Fact)
                .where(Fact.active == 1)
                .order_by(Fact.category, Fact.created_at.desc())
            )
            result = await self.session.execute(stmt)
            facts = list(result.scalars().all())

            if not facts:
                return "Aucun fait mémorisé."

            groups: dict[str, list[Fact]] = {}
            for fact in facts:
                groups.setdefault(fact.category, []).append(fact)

            summary = ""
            for category, category_facts in sorted(groups.items()):
                summary += f"\n{category.upper()}:\n"
                for fact in category_facts:
                    summary += f"  • {fact.subject}: {fact.content}\n"

            return summary.strip()

        except Exception as e:
            logger.warning(f"Failed to get facts summary: {e}")
            return "Erreur lors de la récupération de la mémoire."

    @staticmethod
    def _strip_think_blocks(text: str) -> str:
        """Strip Qwen3.5 think blocks (between <think> and </think>) before JSON parsing."""
        return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()

    async def extract_fact(self, sender: str, message: str) -> None:
        """Fire-and-forget fact extraction from a message."""
        if self.session is None:
            return

        try:
            extraction_prompt = f"""Analyse ce message et extrait un fait important si pertinent.
Réponds avec UNIQUEMENT du JSON valide, sans markdown, sans think blocks.

Format: {{"should_save": boolean, "category": "string", "subject": "string", "content": "string"}}

Message: {message}

Réponds avec le JSON complet:"""

            response = await litellm.acompletion(
                model=self.settings.llm_model,
                api_base=f"{self.settings.llm_base_url}/engines/v1",
                api_key=self.settings.llm_api_key,
                messages=[{"role": "user", "content": extraction_prompt}],
                max_tokens=150,
                temperature=0.3,
            )

            response_text = response.choices[0].message.content.strip()
            response_text = self._strip_think_blocks(response_text)
            fact_data = json.loads(response_text)

            should_save = fact_data.get("should_save", False)
            category = fact_data.get("category", "")
            subject = fact_data.get("subject", "")
            content = fact_data.get("content", "")

            if should_save and category and subject and content:
                fact = Fact(
                    category=category,
                    subject=subject,
                    content=content,
                    source_message=message,
                    created_by=sender,
                )
                self.session.add(fact)
                await self.session.commit()
                logger.info(f"Fact saved: {sender} → [{category}] {subject}")
            else:
                logger.debug(
                    f"Extraction did not determine fact worth saving from {sender}"
                )

        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse extraction JSON: {e}")
        except Exception as e:
            logger.warning(f"Fact extraction failed for {sender}: {e}")

    async def get_llm_reply(
        self,
        message: str,
        sender: str,
        group: str,
    ) -> str | None:
        """Call Docker Model Runner via litellm for conversational reply."""
        try:
            band = self._get_band_profile()
            band_context = (
                f"Profil du groupe: {band.get('name', 'UNSQWARE')}\n"
                f"Genre: {', '.join(band.get('genre', []))}\n"
                f"Base: {band.get('base_city', 'Nantes')}\n"
                f"Formation: {band.get('formation', '')}\n"
                f"Capacité venues: {band.get('venue_capacity', {}).get('min', 60)}-{band.get('venue_capacity', {}).get('max', 400)} personnes"
            )

            facts = await self._get_recent_facts(group, limit=5)
            facts_context = self._format_facts_context(facts)

            stmt = (
                select(Message)
                .where(Message.group == group)
                .order_by(Message.created_at.desc())
                .limit(10)
            )
            result = await self.session.execute(stmt) if self.session else None
            history_messages = list(reversed(result.scalars().all())) if result else []

            messages = [
                {"role": msg.role, "content": msg.content} for msg in history_messages
            ]
            messages.append({"role": "user", "content": message})

            system_prompt = f"""Tu es UNSQWARE, un quartet de jazz moderne de Nantes.
Réponds court, direct, jamais corporate. Max 3 phrases.
Zéro markdown. Zéro emojis.

{band_context}

{facts_context if facts_context else ""}

/no_think"""

            response = await litellm.acompletion(
                model=self.settings.llm_model,
                api_base=f"{self.settings.llm_base_url}/engines/v1",
                api_key=self.settings.llm_api_key,
                messages=[{"role": "system", "content": system_prompt}] + messages,
                max_tokens=300,
                temperature=0.7,
                top_p=0.8,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            logger.error(f"LLM error for message from {sender} in {group}: {e}")
            return None

    async def handle_whatsapp(self, payload: WAHAWebhookPayload) -> dict:
        """Handle incoming WhatsApp message from WAHA bridge.

        WAHA only processes messages with event="message" and fromMe=False.
        This handler filters by group, gets LLM reply, saves to DB, and sends via REST API.
        """
        # Only process message events from other users
        if payload.event != "message" or payload.payload.fromMe:
            return {"status": "ok"}

        if self.session is None:
            return {"status": "ok"}

        try:
            # Extract fields from WAHA payload
            sender = payload.payload._data.get("notifyName") or payload.payload.from_
            sender_id = payload.payload.from_
            group = payload.payload.from_
            message = payload.payload.body
            timestamp = payload.payload.timestamp
            message_id = payload.payload.id

            # Filter by group_name if set
            if self.settings.group_name and group != self.settings.group_name:
                logger.debug(
                    f"Ignoring message from {group} (not {self.settings.group_name})"
                )
                return {"status": "ok"}

            # Filter by group_id if set
            if self.settings.group_id and group != self.settings.group_id:
                logger.debug(
                    f"Ignoring message from {group} (not {self.settings.group_id})"
                )
                return {"status": "ok"}

            logger.info(f"[{group}] {sender}: {message[:50]}")

            # Save user message to DB
            user_msg = Message(
                message_id=message_id,
                sender_id=sender_id,
                group=group,
                role="user",
                content=message,
                timestamp=timestamp,
            )
            self.session.add(user_msg)
            await self.session.flush()

            # Handle memory commands
            if self._is_memory_command(message):
                reply_text = await self._get_facts_summary()
                logger.info(f"Memory command from {sender}, returning facts summary")
                await self.session.commit()
            else:
                # Get LLM reply
                reply_text = await self.get_llm_reply(message, sender, group)

                if reply_text:
                    # Save assistant message to DB
                    assistant_msg = Message(
                        message_id=f"{message_id}_reply",
                        sender_id="assistant",
                        group=group,
                        role="assistant",
                        content=reply_text,
                        timestamp=None,
                    )
                    self.session.add(assistant_msg)

                await self.session.commit()

            # Fire-and-forget fact extraction
            asyncio.create_task(self.extract_fact(sender, message))

            # Send reply via WAHA REST API if we have a reply
            if reply_text:
                await self._send_via_waha(group, reply_text)

            return {"status": "ok"}

        except Exception as e:
            logger.error(f"Error processing WhatsApp message: {e}")
            try:
                await self.session.rollback()
            except Exception as rollback_err:
                logger.warning(f"Rollback failed: {rollback_err}")
            return {"status": "ok"}

    async def _send_via_waha(self, chat_id: str, text: str) -> None:
        """Send message via WAHA REST API.

        This is a fire-and-forget operation; failures are logged but never raise.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.settings.waha_base_url}/api/sendText",
                    json={
                        "session": self.settings.waha_session,
                        "chatId": chat_id,
                        "text": text,
                    },
                    timeout=30.0,
                )
                response.raise_for_status()
                logger.info(f"Message sent via WAHA to {chat_id}")
        except Exception as e:
            logger.error(f"Failed to send message via WAHA to {chat_id}: {e}")


@router.post("/whatsapp")
async def handle_whatsapp_webhook(
    payload: WAHAWebhookPayload,
    session: AsyncSession = Depends(Database.get_db_session),  # noqa: B008
    settings: Settings = Depends(get_settings),  # noqa: B008
) -> dict:
    service = WhatsAppWebhookService(session, settings)
    return await service.handle_whatsapp(payload)
