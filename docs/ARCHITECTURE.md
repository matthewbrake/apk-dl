
# System Architecture

## Overview

The APK Manager is designed as a Client-Server application, although the provided source code focuses heavily on the **React Frontend**.

In a production environment, the system consists of three parts:

1.  **Web Client (React)**: The User Interface.
2.  **API Gateway (Node.js/Python)**: The bridge between the browser and the server.
3.  **File System**: The ZimaBoard/HDD where APKs are stored.

## The "Real World" Implementation

The current demo uses `simulated_data.ts` to mock network responses. To make this work "For Real", you must implement the API Gateway.

### Data Flow

```
[ Browser / React ]  <--->  [ API Gateway ]  <--->  [ Internet / Target Site ]
       |                          |
       |                          |
       v                          v
[ LocalStorage ]           [ File System ]
(Settings)                 (APK Files)
```

### 1. Scanning Logic
*   **Frontend**: Sends a request `POST /api/proxy { url: 'https://djjubeemedia...' }`.
*   **Backend**: Uses a library (like `axios` in Node or `requests` in Python) to fetch the HTML content of that URL.
*   **Frontend**: Receives the raw HTML string.
*   **Frontend**: Uses the **Crawler Logic** (Regex) defined in `App.tsx` to parse that HTML and extract filenames.

### 2. Downloading
*   **Frontend**: User clicks "Download".
*   **Frontend**: Sends `POST /api/download { url: '...', path: '...' }`.
*   **Backend**: Executes a system command (e.g., `wget -c [url] -O [path]`) to save the file to the HDD.

### 3. File Management
*   **Frontend**: Sends `POST /api/move { source: '...', dest: '...' }`.
*   **Backend**: Executes `mv [source] [dest]`.

## Why this architecture?
Browsers prevent web pages from accessing the File System directly for security reasons. They also block requests to external sites that don't allow it (CORS). The **API Gateway** acts as a proxy to bypass these limitations.
