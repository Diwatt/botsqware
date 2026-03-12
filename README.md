# 🎷 Botsqware AI - The Smart Jazz Booker

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

**Botsqware AI** is an intelligent agent designed for bands (specifically tailored for Modern Jazz / Groove) who are sick of cold-pitching into the void. 

Instead of sending 100 generic emails to venues that only book metal or indie rock, this tool searches for venues, qualifies them based on their recent programming, remembers past contacts to avoid duplicates, and drafts hyper-personalized email hooks.

## ✨ Features

* **Targeted Search:** Uses search engines to uncover relevant bars, clubs, and festivals.
* **Ruthless Qualification (`pydantic-ai`):** The agent reads the venue's website or social media content and assigns a relevance score. If they don't book modern jazz/instrumental music, the lead is automatically discarded.
* **Zero Duplicates (SQLite Memory):** The script keeps a local record of all analyzed URLs and venues. You will never accidentally pitch the same booker twice, and it saves unnecessary API calls.
* **Hook Generator:** Say goodbye to writer's block. The AI generates a personalized opening line based on the latest artists who played at the venue, proving you actually know their vibe.

## 🛠️ Tech Stack

* **AI Orchestration:** `pydantic-ai`
* **Database:** `SQLite` (local, lightweight, native to Python).
* **Web Search:** `duckduckgo-search` (free) or `Google Custom Search` / `Tavily API`.
* **Scraping/Extraction:** `crawl4ai` (or basic text extraction).