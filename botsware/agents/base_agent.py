"""Abstract base class for agents.

Agents are autonomous stateless executors that orchestrate business logic.
All agents should inherit from this base and implement the run method.
"""

from abc import ABC, abstractmethod
from typing import Any


class Agent(ABC):
    """Abstract base class for orchestration agents."""

    @abstractmethod
    async def run(self, **kwargs) -> dict[str, Any]:
        """Execute the agent.

        Args:
            **kwargs: Agent-specific parameters

        Returns:
            Dictionary with agent results
        """
        pass
