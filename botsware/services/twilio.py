"""Twilio integration.

Notification service implementations are in base_services.py.
This module kept for backward compatibility.
"""

from botsware.config import Settings
from botsware.services.base_services import TwilioNotificationService

settings = Settings()

# Keep a module-level instance for legacy code
notification_service = TwilioNotificationService(
    settings.twilio_account_sid,
    settings.twilio_auth_token,
    settings.twilio_whatsapp_number,
)


async def send_whatsapp_message(to: str, body: str) -> None:
    """Legacy wrapper for sending WhatsApp messages.

    New code should use the notification service from the container.
    """
    await notification_service.send_whatsapp(to, body)
