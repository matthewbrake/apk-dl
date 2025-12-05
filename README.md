# Firestick APK Manager & Scraper (Web UI)

A robust, "self-hosted" web dashboard for managing, scraping, and updating APK files for Firestick/Android TV.

**Current Version:** v4.3.1-fix  
**Tech Stack:** React, Node.js (Serve), Docker  
**Port:** 3050

---

## 🚀 Quick Start (Copy & Paste)

The build requires a specific `package.json` fix and a clean Dockerfile. Run these commands exactly:

### 1. Initialize Dockerfile
Run this specific command to overwrite the Dockerfile with the correct Node.js configuration:

```bash
cp Dockerfile.md Dockerfile
```

### 2. Build and Run
This will remove old containers to ensure a fresh build with the new dependency fixes.

```bash
docker-compose down
docker-compose up -d --build
```

### 3. Access the Dashboard
Open your browser and navigate to:
`http://localhost:3050`

---

## 📦 How It Works

1.  **Crawler Engine**: The app connects to configured sources (like DJJubee). It downloads the HTML directory listing (`/Apkss/Movie/`, etc.), parses the HTML using regex, and builds a file index.
2.  **Fuzzy Matching**: It compares the messy online filenames (e.g., `BeeTV-v2.4[AdFree].apk`) against your clean local library (`BeeTV`) to detect updates.
3.  **File Management**: It allows you to "Move" and "Rename" files to keep your ZimaBoard repository organized (`Category/Name-vVersion.apk`).
4.  **Extensible Sources**: Add *any* website that provides a standard "Index of /" directory listing in the Settings tab, and the crawler will parse it.

---

## 🔌 Configuration

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
