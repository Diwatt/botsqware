"""Webhook payload model for incoming WhatsApp messages."""

from pydantic import BaseModel


class WhatsAppWebhookPayload(BaseModel):
    """Payload received from the whatsapp-web.js bridge."""

    sender: str
    sender_id: str
    group: str
    message: str
    timestamp: int
    message_id: str
