"""Payload model for sending messages to the whatsapp-web.js bridge."""

from pydantic import BaseModel


class SendMessagePayload(BaseModel):
    """Payload used when sending a message to WhatsApp."""

    group: str
    message: str
