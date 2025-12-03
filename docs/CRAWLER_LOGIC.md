
# Crawler & Scraping Logic

The APK Manager uses a specialized scraping engine designed for **Apache Directory Listings** (common for APK file servers like DJJubee).

## 1. Directory Discovery
The crawler starts at the Root URL configured in Settings.

**Regex Pattern:**
```javascript
/<a href="([^"]+\/)">/g
```
This pattern looks for links ending in a slash `/`, which indicates a subdirectory.

## 2. Recursive Crawling
1.  The crawler fetches the Root Page.
2.  It extracts all folder links (e.g., `Movie/`, `VPN/`, `Browser%E2%98%86/`).
3.  It loops through this list and fetches the HTML for *each* folder.

## 3. File Extraction
Inside a folder, the crawler looks for `.apk` files.

**Regex Pattern:**
```javascript
/<a href="([^"]+\.apk)">([^<]+)<\/a>/g
```

## 4. Special Character Handling
Some directories use emojis or special characters (e.g., `Browser☆`).
*   **Raw HTML**: The link appears as `Browser%E2%98%86/`.
*   **Network Request**: Must use the encoded string `Browser%E2%98%86/`.
*   **Display/Categorization**: We decode it (`decodeURIComponent`) to show `Browser☆` in the UI and create the folder on your disk.

## 5. Categorization
The crawler uses the **Parent Folder Name** to determine the APK category.
*   If found in `/Apkss/Movie/`, the Category is `Movie`.
*   If found in `/Apkss/VPN/`, the Category is `VPN`.

This ensures files are downloaded to the correct location in your repository (`_UPDATE/Movie/BeeTV.apk` instead of just `_UPDATE/BeeTV.apk`).
