"""Initial schema

Revision ID: 0001_initial
Revises: 
Create Date: 2026-03-14 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "messages",
        sa.Column("id", sa.BigInteger(), primary_key=True),
        sa.Column("message_id", sa.String(), nullable=False),
        sa.Column("sender_id", sa.String(), nullable=False),
        sa.Column("group", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("timestamp", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_messages_message_id", "messages", ["message_id"], unique=True)
    op.create_index("ix_messages_sender_id", "messages", ["sender_id"])
    op.create_index("ix_messages_group", "messages", ["group"])
    op.create_index("ix_messages_created_at", "messages", ["created_at"])

    op.create_table(
        "facts",
        sa.Column("id", sa.BigInteger(), primary_key=True),
        sa.Column("category", sa.String(), nullable=False),
        sa.Column("subject", sa.String(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("source_message", sa.String(), nullable=True),
        sa.Column("created_by", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
    )
    op.create_index("ix_facts_category", "facts", ["category"])
    op.create_index("ix_facts_active", "facts", ["active"])
    op.create_index("ix_facts_created_at", "facts", ["created_at"])


def downgrade() -> None:
    op.drop_table("facts")
    op.drop_table("messages")
