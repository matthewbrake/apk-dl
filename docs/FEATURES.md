# Feature Summary

## 1. Advanced Web Scraping
*   **Recursive Crawling**: Automatically follows folder links (e.g., `Movie/` -> `Action/`) to index deep repositories.
*   **HTML Parsing**: Extracts filenames, dates, and sizes from raw HTML directory listings.
*   **Special Character Support**: Handles URL-encoded paths (e.g., `Browser%E2%98%86/`).

## 2. Library Management
*   **Version Control**: Automatically detects if `v2.4` is newer than `v2.3.9`.
*   **Standardization**: One-click rename to enforce `Name-vX.X.X.apk` format.
*   **Categorization**: Detects category based on source folder (e.g., `VPN`, `Live`, `Tools`) and moves files to the corresponding directory on your server.

## 3. Search & Discovery
*   **Universal Search**: Searches both your Local Library and Remote Sources simultaneously.
*   **Filter by Source**: Compare versions across multiple websites (DJJubee vs FirestickHacks).

## 4. Extensibility
*   **Source Config**: Add unlimited new URL sources via the UI.
*   **API Integration**: Optional support for OpenAI/Gemini keys for future metadata enhancement.
*   **Docker Ready**: Single container deployment.
