"""Message entity definition."""

from datetime import datetime

from sqlalchemy import BigInteger, Column, DateTime, String, Text

from botsqware.db.base import Base


class Message(Base):
    """WhatsApp message entity for conversation history."""

    __tablename__ = "messages"

    id = Column(BigInteger, primary_key=True)
    message_id = Column(String, unique=True, nullable=False, index=True)
    sender_id = Column(String, nullable=False, index=True)
    group = Column(String, nullable=False, index=True)
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    timestamp = Column(BigInteger)  # Unix timestamp from WhatsApp, None for generated replies
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
