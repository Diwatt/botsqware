"""Webhook endpoints for handling incoming messages from Twilio and other services.

Webhooks are stateless handlers that validate inputs and delegate to services.
"""

import logging

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from botsware.db.session import get_db_session

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


class TwilioWebhookPayload(BaseModel):
    """Webhook payload from Twilio."""

    From: str
    Body: str
    MessageSid: str


@router.post("/twilio")
async def handle_twilio_webhook(
    payload: TwilioWebhookPayload, session: AsyncSession = Depends(get_db_session),  # noqa: B008
) -> dict:
    """Handle incoming WhatsApp message from Twilio.

    Parses message and routes to appropriate handler based on content.

    Args:
        payload: Twilio webhook payload
        session: Database session for queries

    Returns:
        Status confirmation
    """
    sender = payload.From
    message_body = payload.Body.strip().lower()
    message_sid = payload.MessageSid

    logger.info(f"Received WhatsApp message from {sender}: {message_body}")

    try:
        # Route message to appropriate handler
        if "show opportunities" in message_body or "opportunities" in message_body:
            await _handle_show_opportunities(sender, session)
        elif "search" in message_body:
            # TODO: Trigger search wave
            logger.info(f"Search command received from {sender}")
        elif "status" in message_body:
            # TODO: Return pipeline status
            logger.info(f"Status command received from {sender}")
        else:
            logger.debug(f"Unrecognized command from {sender}: {message_body}")

        return {"status": "received", "sid": message_sid}

    except Exception as e:
        logger.error(f"Error processing WhatsApp message from {sender}: {e}")
        return {"status": "error", "sid": message_sid}


async def _handle_show_opportunities(whatsapp_number: str, session: AsyncSession) -> None:
    """Handle 'show opportunities' WhatsApp command.

    Fetches pipeline summary and sends via WhatsApp.

    Args:
        whatsapp_number: Sender's WhatsApp number
        session: Database session
    """
    try:
        # TODO: Create opportunity list manager and send summary
        # venue_repo = VenueRepository(session)
        # task_repo = TaskRepository(session)
        # opp_manager = OpportunityListManager(venue_repo, task_repo, session)
        # summary = await opp_manager.get_summary()
        # await notification_service.send_whatsapp(whatsapp_number, summary)
        logger.info(f"show opportunities requested from {whatsapp_number}")

    except Exception as e:
        logger.error(f"Error handling show opportunities command: {e}")
