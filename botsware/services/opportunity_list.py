"""Opportunity list manager for venue outreach orchestration.

Reads scored venues, prepares personalised outreach drafts,
creates approval tasks, and provides pipeline summaries.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from sqlalchemy.ext.asyncio import AsyncSession

from botsware.schemas import BandProfile, OutreachDraft, VenueResult

if TYPE_CHECKING:
    from botsware.db.repositories import TaskRepository, VenueRepository

logger = logging.getLogger(__name__)


class OpportunityListManager:
    """Manages venue outreach workflow and contact queue.

    Reads scored venues from database, prepares personalised outreach drafts
    using Pydantic AI, and creates human-approval tasks for sending.
    """

    def __init__(
        self,
        venue_repo: VenueRepository,
        task_repo: TaskRepository,
        session: AsyncSession,
    ):
        """Initialize opportunity list manager.

        Args:
            venue_repo: VenueRepository for venue data access
            task_repo: TaskRepository for task creation
            session: AsyncSession for database operations
        """
        self.venue_repo = venue_repo
        self.task_repo = task_repo
        self.session = session

    async def get_ready_to_contact(
        self, min_score: float = 0.6, limit: int = 20
    ) -> list[VenueResult]:
        """Get venues ready for contact.

        Fetches venues with relevance_score >= min_score,
        sorted by score descending.

        Args:
            min_score: Minimum relevance score threshold (default 0.6)
            limit: Maximum venues to return (default 20)

        Returns:
            List of VenueResult sorted by score (highest first)
        """
        venues = await self.venue_repo.get_ready_to_contact(min_score=min_score, limit=limit)
        logger.info(f"Retrieved {len(venues)} venues ready to contact (min_score={min_score})")
        return venues

    async def get_summary(self) -> str:
        """Get WhatsApp-friendly pipeline summary.

        Returns summary of venue discovery and contact pipeline status.

        Returns:
            Formatted string with venue counts and top zones
        """
        # Get all venues found
        all_venues = await self.venue_repo.get_ready_to_contact(min_score=0.0, limit=1000)
        total_found = len(all_venues)

        # Get ready-to-contact venues (score >= 0.6)
        ready_venues = await self.venue_repo.get_ready_to_contact(min_score=0.6, limit=1000)
        ready_count = len(ready_venues)

        # Get contacted venues (will be tracked by task status in future)
        # For now, estimate as difference
        contacted_count = total_found - ready_count

        # Get venue distribution by city (top zones)
        city_counts = await self.venue_repo.get_venue_count_by_city()
        top_cities = sorted(city_counts.items(), key=lambda x: x[1], reverse=True)[:3]
        cities_str = ", ".join([f"{city} ({count})" for city, count in top_cities])

        summary = (
            f"📊 **Pipeline Summary**\n"
            f"🎵 Total venues found: {total_found}\n"
            f"📩 Ready to contact: {ready_count}\n"
            f"✅ Already contacted: {contacted_count}\n"
            f"📍 Top zones: {cities_str if cities_str else 'None yet'}"
        )
        logger.info("Generated pipeline summary")
        return summary

    async def prepare_outreach_batch(
        self, venues: list[VenueResult], band_profile: BandProfile
    ) -> list[OutreachDraft]:
        """Prepare personalised outreach drafts.

        Drafts may target email or alternate channels (WhatsApp/phone) depending
        on available contact info. If a venue has no email we fall back to
        WhatsApp.

        Args:
            venues: List of VenueResult to send outreach for
            band_profile: BandProfile with band info for personalisation

        Returns:
            List of OutreachDraft with personalised message content
        """
        drafts: list[OutreachDraft] = []

        for venue in venues:
            try:
                # Determine language based on venue city and band languages
                # Default to French for French venues, English otherwise
                venue_language = self._detect_venue_language(venue, band_profile)

                # Decide channel (email if we have contact, else whatsapp)
                channel = self._decide_channel(venue)

                # Generate personalised outreach draft
                draft = await self._generate_outreach_draft(
                    venue, band_profile, venue_language, channel
                )
                drafts.append(draft)
                logger.debug(
                    f"Generated outreach draft for venue {venue.id} ({venue.name}) via {channel}"
                )
            except Exception as e:
                logger.error(f"Failed to generate draft for venue {venue.id} ({venue.name}): {e}")
                continue

        logger.info(f"Prepared {len(drafts)} outreach drafts from {len(venues)} venues")
        return drafts

    async def create_approval_tasks(self, drafts: list[OutreachDraft]) -> list[dict]:
        """Create human-approval tasks for outreach drafts.

        Creates one send_message task per draft with status=awaiting_human
        and 7-day expiration. Payload includes channel so UI can render
        appropriately.

        Args:
            drafts: List of OutreachDraft to create tasks for

        Returns:
            List of created task dictionaries with IDs and metadata
        """
        created_tasks: list[dict] = []

        for draft in drafts:
            try:
                # Create task payload with draft content
                payload = {
                    "channel": draft.channel,
                    "subject": draft.subject,
                    "body": draft.body,
                    "personalisation_notes": draft.personalisation_notes,
                }

                # Use generic send_message type so channel can vary
                task = await self.task_repo.create_task(
                    task_type="send_message",
                    venue_id=draft.venue_id,
                    payload=payload,
                    expires_in_days=7,
                )
                created_tasks.append(task)
                logger.debug(f"Created approval task for venue {draft.venue_id}")
            except Exception as e:
                logger.error(f"Failed to create task for venue {draft.venue_id}: {e}")
                continue

        logger.info(f"Created {len(created_tasks)} approval tasks from {len(drafts)} drafts")
        return created_tasks

    # ——————————————————————————————————————————————————————
    # Private helper methods
    # ——————————————————————————————————————————————————————

    def _decide_channel(self, venue: VenueResult) -> str:
        """Decide which channel to use for outreach.

        Prefers email if contact_email is available, otherwise falls back to
        WhatsApp. Additional heuristics could be added later (phone, etc.).
        """
        if venue.contact_email:
            return "email"
        return "whatsapp"

    def _detect_venue_language(self, venue: VenueResult, band_profile: BandProfile) -> str:
        """Detect preferred language for venue outreach.

        Defaults to French for venues without clear international indicators,
        uses English if band profile suggests international audience.

        Args:
            venue: VenueResult to detect language for
            band_profile: BandProfile with band language preferences

        Returns:
            'fr' or 'en' language code
        """
        # If 'en' is in band profile languages and international cities are targets,
        # prefer English. Otherwise default to French.
        if (
            "en" in band_profile.languages
            and "international" in str(band_profile.target_cities).lower()
        ):
            return "en"
        return "fr"

    async def _generate_outreach_draft(
        self,
        venue: VenueResult,
        band_profile: BandProfile,
        language: str,
        channel: str,
    ) -> OutreachDraft:
        """Generate a personalised outreach draft for a venue.

        Uses Pydantic AI to compose personalised booking email with:
        - Reference to programming evidence found during research
        - Mention of similar artists if applicable
        - Vague date proposal ('premier semestre 2026')
        - Links to Totem Live Session and streaming links

        Args:
            venue: VenueResult to generate draft for
            band_profile: BandProfile with band information
            language: Language code ('fr' or 'en') for email

        Returns:
            OutreachDraft with subject and body
        """
        # Build contextual information for draft generation
        context = {
            "band_name": band_profile.name,
            "band_genres": band_profile.genre,
            "venue_name": venue.name,
            "venue_city": venue.city,
            "score_rationale": venue.score_rationale,
            "genre_tags": venue.genre_tags,
        }

        # Generate subject and body based on language and channel
        if channel == "email":
            if language == "fr":
                subject = f"Proposition de showcase - {band_profile.name}"
                body = self._generate_french_outreach(context)
            else:
                subject = f"Booking inquiry - {band_profile.name}"
                body = self._generate_english_outreach(context)
        else:
            # For non-email channels, subject is unused / optional
            subject = None
            body = self._generate_non_email_outreach(context, channel, language)

        # Extract personalisation notes from score_rationale
        personalisation_notes = venue.score_rationale or "Venue matches band profile"

        return OutreachDraft(
            venue_id=venue.id or 0,
            channel=channel,
            subject=subject,
            body=body,
            personalisation_notes=personalisation_notes,
        )

    def _generate_french_outreach(self, context: dict) -> str:
        """Generate French outreach email body.

        Args:
            context: Context dictionary with band and venue info

        Returns:
            French email body
        """
        band_name = context["band_name"]
        genres = ", ".join(context["band_genres"][:2])
        score_rationale = context.get("score_rationale", "")

        # Build reference to programming evidence if available
        programming_ref = ""
        if score_rationale and "program" in score_rationale.lower():
            programming_ref = f"\nNous avons vu que vous programmez régulièrement {genres}. "

        body = (
            f"Bonjour,\n\n"
            f"Nous vous contactons pour vous proposer un showcase de {band_name}, "
            f"un projet musical {genres}.\n"
            f"{programming_ref}"
            f"Nous pensons que notre musique pourrait intéresser votre audience.\n\n"
            f"Nous proposons une date au premier semestre 2026.\n\n"
            f"Vous pouvez découvrir notre univers musical:\n"
            f"🎵 Totem Live Session: "
            f"https://www.youtube.com/channel/{band_name.replace(' ', '_')}\n"
            f"🎧 Streaming: https://totem.live\n\n"
            f"Êtes-vous intéressés? À bientôt,\n"
            f"Totem Live Team"
        )
        return body

    def _generate_english_outreach(self, context: dict) -> str:
        """Generate English outreach email body.

        Args:
            context: Context dictionary with band and venue info

        Returns:
            English email body
        """
        band_name = context["band_name"]
        genres = ", ".join(context["band_genres"][:2])
        score_rationale = context.get("score_rationale", "")

        # Build reference to programming evidence if available
        programming_ref = ""
        if score_rationale and "program" in score_rationale.lower():
            programming_ref = f"\nWe noticed you regularly feature {genres} acts. "

        body = (
            f"Hi,\n\n"
            f"We're reaching out to propose a showcase of {band_name}, "
            f"a {genres} music project.\n"
            f"{programming_ref}"
            f"We believe our music would resonate with your audience.\n\n"
            f"We have availability in the first half of 2026.\n\n"
            f"Discover our music:\n"
            f"🎵 Totem Live Session: "
            f"https://www.youtube.com/channel/{band_name.replace(' ', '_')}\n"
            f"🎧 Streaming: https://totem.live\n\n"
            f"Would you be interested? Looking forward to hearing from you,\n"
            f"Totem Live Team"
        )
        return body

    def _generate_non_email_outreach(self, context: dict, channel: str, language: str) -> str:
        """Generate outreach message for non-email channels.

        Currently supports WhatsApp and phone. Messages are shorter and do
        not include a subject line.

        Args:
            context: Context dictionary with band and venue info
            channel: Channel name ("whatsapp" or "phone")
            language: Language code ("fr" or "en")

        Returns:
            Body text appropriate for the channel
        """
        band_name = context["band_name"]
        genres = ", ".join(context["band_genres"][:2])
        score_rationale = context.get("score_rationale", "")

        programming_ref = ""
        if score_rationale and "program" in score_rationale.lower():
            if language == "fr":
                programming_ref = f"\nNous avons vu que vous programmez régulièrement {genres}. "
            else:
                programming_ref = f"\nWe noticed you regularly feature {genres} acts. "

        if language == "fr":
            intro = f"Bonjour,\n\nNous sommes {band_name}, un projet {genres}."
            date_line = "Nous avons une disponibilité premier semestre 2026."
            closing = "À bientôt,\nTotem Live Team"
        else:
            intro = f"Hi,\n\nWe're {band_name}, a {genres} project."
            date_line = "We have availability in the first half of 2026."
            closing = "Looking forward to hearing from you,\nTotem Live Team"

        body = (
            f"{intro}\n"
            f"{programming_ref}\n"
            f"{date_line}\n\n"
            f"🎵 Totem Live: https://www.youtube.com/channel/{band_name.replace(' ', '_')}\n"
            f"🎧 Streaming: https://totem.live\n\n"
            f"{closing}"
        )
        return body
