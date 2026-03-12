"""Venue extraction from search results.

Extracts structured VenueCandidate data from raw search results using
pattern matching and heuristic rules. Future: integrates with Claude AI
for language-based extraction when API key available.
"""

from __future__ import annotations

import logging
import re

from botsware.schemas import RawResult, VenueCandidate

logger = logging.getLogger(__name__)


class VenueExtractor:
    """Extract venue candidates from raw search results.

    Uses pattern matching and heuristics to extract structured venue info.
    """

    def __init__(self, api_key: str | None = None):
        """Initialize extractor.

        Args:
            api_key: Optional OpenAI API key for future LLM integration
        """
        self.api_key = api_key

    async def extract(self, raw_results: list[RawResult]) -> list[VenueCandidate]:
        """Extract venue candidates from raw search results.

        Args:
            raw_results: List of RawResult from search tools

        Returns:
            List of VenueCandidate objects with extraction confidence
        """
        if not raw_results:
            return []

        candidates: list[VenueCandidate] = []

        for result in raw_results:
            candidate = self._extract_from_result(result)
            if candidate:
                candidates.append(candidate)

        logger.info(f"Extracted {len(candidates)} venue candidates from {len(raw_results)} results")
        return candidates

    async def extract_refined(
        self, raw_results: list[RawResult], min_confidence: float = 0.5
    ) -> list[VenueCandidate]:
        """Extract with confidence filtering.

        Args:
            raw_results: List of RawResult from search tools
            min_confidence: Minimum confidence threshold (0-1)

        Returns:
            Filtered list of VenueCandidate with confidence >= min_confidence
        """
        all_candidates = await self.extract(raw_results)
        filtered = [c for c in all_candidates if c.confidence >= min_confidence]
        logger.info(
            f"Filtered {len(all_candidates)} to {len(filtered)} venues "
            f"(confidence >= {min_confidence})"
        )
        return filtered

    @staticmethod
    def _extract_from_result(result: RawResult) -> VenueCandidate | None:
        """Extract a single venue candidate from a RawResult.

        Args:
            result: Single RawResult object

        Returns:
            VenueCandidate if valid venue found, None otherwise
        """
        # Name: use title if it looks like a venue
        name = result.title.strip()
        if not name or len(name) < 3:
            return None

        # City: from snippet if possible
        city = result.zone if result.zone else "unknown"

        # Website: from URL
        website = result.url if result.url.startswith("http") else None

        # Venue type: detect from title/snippet
        venue_type = VenueExtractor._detect_venue_type(name + " " + (result.snippet or ""))

        # Capacity: try to extract numbers
        capacity_hint = VenueExtractor._extract_capacity(result.snippet or "")

        # Programming evidence: check for jazz/concert keywords
        programming_evidence = VenueExtractor._extract_programming_evidence(result.snippet or "")

        # Confidence: heuristic based on available data
        confidence = VenueExtractor._calculate_confidence(
            name, city, venue_type, programming_evidence
        )

        if confidence < 0.3:
            return None

        return VenueCandidate(
            name=name,
            city=city,
            website=website,
            capacity_hint=capacity_hint,
            venue_type=venue_type,
            contact_raw=None,
            programming_evidence=programming_evidence,
            confidence=confidence,
        )

    @staticmethod
    def _detect_venue_type(text: str) -> str:
        """Detect venue type from text.

        Args:
            text: Title or snippet text

        Returns:
            Venue type string (club, theatre, salle, bar, festival, etc.)
        """
        text_lower = text.lower()

        patterns = {
            "club": r"(club|nightclub)",
            "theatre": r"(théâtre|theater|salle de spectacle)",
            "salle": r"(salle|concert hall)",
            "bar": r"(bar|café|bistro)",
            "festival": r"(festival)",
            "venue": r"(venue|lieu)",
        }

        for venue_type, pattern in patterns.items():
            if re.search(pattern, text_lower):
                return venue_type

        return "venue"

    @staticmethod
    def _extract_capacity(text: str) -> int | None:
        """Extract capacity number from text.

        Args:
            text: Text to search

        Returns:
            Capacity number if found, None otherwise
        """
        # Look for "X personnes", "capacity X", "X seats", etc.
        patterns = [
            r"(\d+)\s+(?:personnes|places|seats|capacity|capacité)",
            r"(?:capacité|capacity)\s+(?:de\s+)?(\d+)",
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    return int(match.group(1))
                except (ValueError, IndexError):
                    pass

        return None

    @staticmethod
    def _extract_programming_evidence(text: str) -> str | None:
        """Extract programming evidence from text.

        Args:
            text: Text to search for programming keywords

        Returns:
            Quote or evidence of programming, or None
        """
        keywords = [
            "jazz",
            "concert",
            "programming",
            "programmation",
            "événements",
            "spectacles",
            "live",
            "music",
            "musique",
        ]

        text_lower = text.lower()

        for keyword in keywords:
            if keyword in text_lower:
                # Try to extract a ~20-word snippet around the keyword
                idx = text_lower.find(keyword)
                start = max(0, idx - 60)
                end = min(len(text), idx + 100)
                snippet = text[start:end].strip()
                return snippet if snippet else "Keyword: " + keyword

        return None

    @staticmethod
    def _calculate_confidence(
        name: str, city: str, venue_type: str, programming_evidence: str | None
    ) -> float:
        """Calculate extraction confidence (0-1).

        Args:
            name: Venue name
            city: City
            venue_type: Detected venue type
            programming_evidence: Whether programming evidence found

        Returns:
            Confidence score 0-1
        """
        score = 0.5  # base confidence

        if len(name) > 5:
            score += 0.1
        if city != "unknown":
            score += 0.15
        if venue_type != "venue":
            score += 0.15
        if programming_evidence:
            score += 0.1

        return min(1.0, score)
