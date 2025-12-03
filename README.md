# Firestick APK Manager & Scraper (Web UI)

A robust, "self-hosted" web dashboard for managing, scraping, and updating APK files for Firestick/Android TV.

**Current Version:** v4.2.0-prod  
**Tech Stack:** React, TailwindCSS, Docker

---

## 🚀 Quick Start (Copy & Paste)

Follow these exact instructions to get the Web UI running in minutes.

### 1. Prepare Dockerfile
As per your requirements, the Docker configuration is stored in `Dockerfile.md`. Run this command to convert it to a usable Dockerfile:

```bash
cp Dockerfile.md Dockerfile
```

### 2. Configure Environment (Optional)
You can set your specific ports and paths using environment variables.

```bash
# Set your desired Web UI port (Default: 3000)
export WEB_PORT=8080

# Set the path to your ZimaBoard/HDD APK storage
export HOST_APK_PATH="/mnt/zima/HDD/data/InstallersAndTools/MobileApps/Firestick/_UPDATE"
```

### 3. Build and Run
Spin up the container using Docker Compose:

```bash
docker-compose up -d --build
```

### 4. Access the Dashboard
Open your browser and navigate to:
`http://localhost:8080` (or the port you specified)

---

## 📦 How It Works

1.  **Crawler Engine**: The app connects to configured sources (like DJJubee). It downloads the HTML directory listing (`/Apkss/Movie/`, etc.), parses the HTML using regex, and builds a file index.
2.  **Fuzzy Matching**: It compares the messy online filenames (e.g., `BeeTV-v2.4[AdFree].apk`) against your clean local library (`BeeTV`) to detect updates.
3.  **File Management**: It allows you to "Move" and "Rename" files to keep your ZimaBoard repository organized (`Category/Name-vVersion.apk`).
4.  **Extensible Sources**: Add *any* website that provides a standard "Index of /" directory listing in the Settings tab, and the crawler will parse it.

---

## 🔌 Configuration & Extensibility

Navigate to the **Settings** tab in the Web UI.

### 1. Sources
You can add any directory-listing style website.
*   **Name**: Display name (e.g., "My Repo")
*   **URL**: The root URL (e.g., `http://my-server.com/apks/`)
*   **Type**: `Directory List` (Standard Apache/Nginx indexes).

### 2. Optional AI Integration
The system works perfectly **without AI**. However, you can add API keys to enable future advanced features.
*   **OpenAI / Gemini Keys**: Add them in Settings.
*   **Behavior**: The app detects if keys are present. If they are, it enables "Smart Analysis" (simulated in this version). If not, it runs in standard "Regex Mode".

---

## 📂 Developer Docs

*   [**Architecture**](docs/ARCHITECTURE.md): Frontend/Backend data flow.
*   [**Crawler Logic**](docs/CRAWLER_LOGIC.md): Regex patterns used to scrape directory listings.
*   [**Features**](docs/FEATURES.md): Full feature breakdown.
*   [**Fuzzy Matching**](docs/FUZZY_MATCHING.md): Algorithm for version detection.
