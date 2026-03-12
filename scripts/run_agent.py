"""Utility script to execute GigAgent once with an example band profile."""

import asyncio

from botsware.agents.gig_agent import GigAgent


async def main() -> None:
    agent = GigAgent()
    band = {
        "name": "Test Band",
        "genre": ["rock"],
        "draw_size": 100,
        "target_cities": ["Paris"],
        "fee_range": (0, 0),
        "description": "",
        "languages": ["fr"],
    }
    result = await agent.run(
        query="test query",
        city="Paris",
        max_capacity=500,
        band_profile=band,
    )
    print("Agent finished, result:")
    print(result)


if __name__ == "__main__":
    asyncio.run(main())
