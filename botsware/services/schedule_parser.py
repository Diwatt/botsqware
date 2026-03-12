"""Natural-language schedule parser for gig-agent.

The sole purpose of this module is to convert a free-text instruction such
as ``"search every Monday for jazz venues in Bordeaux"`` into a cron
expression plus the corresponding query and region values.  In reality this
should be delegated to a language model; the implementation here is only a
stub that returns empty strings.
"""

try:
    from pydantic_ai import tool
except ImportError:

    def tool(func=None, **kwargs):  # type: ignore
        return func


@tool
async def parse_schedule_from_prompt(prompt: str) -> dict:
    """Return a dict with ``cron_expr``, ``query`` and ``region`` keys.

    ``prompt`` is an English sentence describing when and what to search.

    Example input:
        "search every Monday for jazz venues in Bordeaux"

    Example output:
        {
            "cron_expr": "0 9 * * 1",
            "query": "jazz venues",
            "region": "Bordeaux",
        }
    """
    # TODO: call out to the LLM with a suitable system prompt
    return {"cron_expr": "", "query": "", "region": ""}
