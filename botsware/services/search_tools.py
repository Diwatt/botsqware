"""Multi-source search tools for venue discovery.

Includes DuckDuckGo, web scraping, FEDELIMA directory, Instagram tracing,
and similar artist concert finding. All async with rate limiting.
"""

from __future__ import annotations

import asyncio
import re
import time

import httpx

from botsware.schemas import InstagramData, RawResult, VenuePageData


class RateLimiter:
    """Simple exponential backoff rate limiter."""

    def __init__(self, min_delay: float = 0.5, max_delay: float = 10.0):
        """Initialize rate limiter.

        Args:
            min_delay: Minimum delay between requests (seconds)
            max_delay: Maximum delay in exponential backoff (seconds)
        """
        self.min_delay = min_delay
        self.max_delay = max_delay
        self.last_request_time = 0.0
        self.backoff_multiplier = 1.0

    async def wait(self) -> None:
        """Wait appropriate time before next request."""
        elapsed = time.time() - self.last_request_time
        wait_time = max(0, self.min_delay * self.backoff_multiplier - elapsed)
        if wait_time > 0:
            await asyncio.sleep(wait_time)
        self.last_request_time = time.time()

    def on_rate_limit(self) -> None:
        """Increase backoff on rate limit error."""
        self.backoff_multiplier = min(self.max_delay / self.min_delay, self.backoff_multiplier * 2)

    def on_success(self) -> None:
        """Reset backoff after successful request."""
        self.backoff_multiplier = 1.0


# Global rate limiters per source
_ddg_limiter = RateLimiter(min_delay=0.5)
_web_limiter = RateLimiter(min_delay=1.0)
_fedelima_limiter = RateLimiter(min_delay=0.5)


async def duckduckgo_search(query: str, zone: str, max_results: int = 10) -> list[RawResult]:
    """Search DuckDuckGo for venue information.

    Uses duckduckgo-search library with exponential backoff on rate limits.

    Args:
        query: Search query
        zone: Geo_wave zone for tagging results
        max_results: Maximum results to return (default 10)

    Returns:
        List of RawResult objects from DDG
    """
    try:
        from duckduckgo_search import DDGS  # type: ignore
    except ImportError:
        # Fallback if library not available
        return []

    results: list[RawResult] = []
    retries = 0
    max_retries = 3

    while retries < max_retries:
        try:
            await _ddg_limiter.wait()

            # Run DDG search in executor to avoid blocking
            loop = asyncio.get_event_loop()
            ddg_results = await loop.run_in_executor(
                None, lambda: list(DDGS().text(query, max_results=max_results))
            )

            for item in ddg_results:
                result = RawResult(
                    title=item.get("title", ""),
                    url=item.get("href", ""),
                    snippet=item.get("body", ""),
                    source="duckduckgo",
                    zone=zone,
                    raw_text=str(item),
                )
                results.append(result)

            _ddg_limiter.on_success()
            return results

        except Exception as e:
            if "rate" in str(e).lower():
                _ddg_limiter.on_rate_limit()
                retries += 1
                await asyncio.sleep(2**retries)  # exponential backoff
            else:
                break

    return results


async def web_fetch_venue(url: str) -> VenuePageData:
    """Fetch and parse a venue website for contact information.

    Extracts email, phone, contact links, social media, programmation
    mentions, and capacity estimates.

    Args:
        url: Venue website URL

    Returns:
        VenuePageData with extracted information
    """
    await _web_limiter.wait()

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, follow_redirects=True)
            html = response.text
    except Exception:
        return VenuePageData(url=url)

    # Extract title
    title_match = re.search(r"<title[^>]*>([^<]+)</title>", html, re.IGNORECASE)
    title = title_match.group(1).strip() if title_match else None

    # Extract email addresses
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    emails = re.findall(email_pattern, html)
    email = emails[0] if emails else None

    # Extract phone numbers (French format)
    phone_pattern = r"(?:\+33|0)[1-9](?:[0-9]{8}|[0-9]{9})"
    phones = re.findall(phone_pattern, html)
    phone = phones[0] if phones else None

    # Extract social links
    social_links: list[str] = []
    for platform in ["instagram", "facebook", "twitter", "linkedin"]:
        pattern = rf"https?://(?:www\.)?{platform}\.com/[^\s\"<>]+"
        matches = re.findall(pattern, html, re.IGNORECASE)
        social_links.extend(matches)

    # Find contact link
    contact_match = re.search(
        r'href=["\']([^"\']*(?:contact|booking|reserv)[^"\']*)["\']',
        html,
        re.IGNORECASE,
    )
    contact_link = contact_match.group(1) if contact_match else None

    # Extract programmation mentions
    programmation_pattern = (
        r"(?:programmation|concert|event|agenda|shows?|performances?)[^.!?]*jazz"
    )
    mentions = re.findall(programmation_pattern, html, re.IGNORECASE)
    programmation_mentions = list(set(mentions))[:5]

    # Estimate capacity from mentions
    capacity_pattern = r"(?:capacity|placé?s|personnes|audiences?)[:\s]*([0-9]+)"
    capacity_match = re.search(capacity_pattern, html, re.IGNORECASE)
    capacity = int(capacity_match.group(1)) if capacity_match else None

    _web_limiter.on_success()

    return VenuePageData(
        url=url,
        title=title,
        email=email,
        phone=phone,
        contact_link=contact_link,
        social_links=list(set(social_links)),
        programmation_mentions=programmation_mentions,
        capacity=capacity,
        raw_html=html[:1000],  # Store first 1KB of HTML
    )


async def search_fedelima(zone: str) -> list[RawResult]:
    """Search FEDELIMA member list by region.

    FEDELIMA is the French Federation of Independent Live Music Venues.
    Parses fedelima.org directory by region.

    Args:
        zone: Geo_wave zone (region name in French)

    Returns:
        List of RawResult objects from FEDELIMA directory
    """
    await _fedelima_limiter.wait()

    results: list[RawResult] = []

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # FEDELIMA search by region
            search_url = f"https://fedelima.org/membres?search={zone}"
            response = await client.get(search_url, follow_redirects=True)
            html = response.text

            # Extract venue links and info
            venue_pattern = r'<a[^>]*href="([^"]*membres[^"]*)"[^>]*>([^<]+)</a>'
            matches = re.findall(venue_pattern, html)

            for idx, (venue_url, venue_name) in enumerate(matches):
                if idx >= 10:  # Cap at 10 results per zone
                    break

                result = RawResult(
                    title=venue_name.strip(),
                    url=venue_url
                    if venue_url.startswith("http")
                    else f"https://fedelima.org{venue_url}",
                    snippet=f"FEDELIMA member in {zone}",
                    source="fedelima.org",
                    zone=zone,
                    raw_text=venue_name,
                )
                results.append(result)

        _fedelima_limiter.on_success()

    except Exception:
        pass

    return results


async def search_instagram_public(venue_name: str, city: str) -> InstagramData:
    """Search for venue Instagram presence.

    Uses DuckDuckGo to find Instagram handle. No API key needed.

    Args:
        venue_name: Venue name
        city: City where venue is located

    Returns:
        InstagramData with handle and URL if found
    """
    query = f"instagram {venue_name} {city} jazz programmation"

    try:
        results = await duckduckgo_search(query, zone=city, max_results=5)

        # Look for Instagram links in results
        for result in results:
            if "instagram.com" in result.url:
                # Extract handle from Instagram URL
                handle_match = re.search(r"instagram\.com/([a-zA-Z0-9._]+)", result.url)
                if handle_match:
                    handle = handle_match.group(1)
                    return InstagramData(
                        handle=handle,
                        url=result.url,
                        found=True,
                        source_query=query,
                    )

    except Exception:
        pass

    return InstagramData(handle=None, url=None, found=False, source_query=query)


async def search_similar_act_gigs(act_name: str, zone: str) -> list[str]:
    """Find where similar artists perform in a region.

    Searches for concert venues where a similar act plays, to identify
    venues that book that genre.

    Args:
        act_name: Artist name (e.g., 'Tigran Hamasyan')
        zone: Geo_wave zone

    Returns:
        List of venue names found in results
    """
    query = f"{act_name} concert {zone}"

    try:
        results = await duckduckgo_search(query, zone=zone, max_results=10)

        venue_names: list[str] = []

        # Extract venue names from snippets and titles
        for result in results:
            # Look for patterns like "au [VenueName]", "[VenueName] - concert"
            venue_pattern = (
                r"(?:au|at|venue:?\s+)([a-zA-ZÀ-ÿ\s]+?(?:club|salle|"
                r"théâtre|hall|centre))"
            )
            matches = re.findall(venue_pattern, result.snippet + " " + result.title, re.IGNORECASE)
            venue_names.extend([m.strip() for m in matches if len(m.strip()) > 3])

        return list(set(venue_names))[:5]  # Return unique venues, max 5

    except Exception:
        return []


async def search_all_sources(
    query: str, zone: str
) -> tuple[list[RawResult], list[RawResult]]:
    """Run searches across multiple sources concurrently.

    Args:
        query: Search query
        zone: Geo_wave zone

    Returns:
        Tuple of (DuckDuckGo results, FEDELIMA results)
    """
    ddg_coro = duckduckgo_search(query, zone)
    fedelima_coro = search_fedelima(zone)

    results = await asyncio.gather(ddg_coro, fedelima_coro, return_exceptions=True)

    # Handle exceptions - cast to list since gather returns list[Any]
    ddg_results: list[RawResult] = (
        results[0] if isinstance(results[0], list) else []
    )
    fedelima_results: list[RawResult] = (
        results[1] if isinstance(results[1], list) else []
    )

    return ddg_results, fedelima_results
