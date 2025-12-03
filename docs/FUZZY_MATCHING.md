
# Fuzzy Matching Logic

The biggest challenge in APK management is matching a messy online filename to your clean local library.

**Example:**
*   Local: `BeeTV`
*   Online: `BeeTV-v4.4.2[Ad-Free-Lite].apk`

## Normalization Process
We use the `normalizeAppName` function in `utils.ts`.

1.  **Tokenization**: Split the name into words.
2.  **Stop Word Removal**: Remove common noise words:
    *   `apk`, `mod`, `premium`, `adfree`, `lite`, `android`, `firestick`, `stable`, `release`.
3.  **Version Removal**: Strip out patterns like `v2.4.0` or `2.4`.
4.  **Symbol Cleanup**: Remove brackets `[]`, `()`, and special chars.

**Result:**
`BeeTV-v4.4.2[Ad-Free-Lite].apk` -> **beetv**

## Matching
Once normalized, we compare the online string to your local library.
1.  **Exact Match**: Does `beetv` == `beetv`? (Yes).
2.  **Fuzzy Fallback**: If exact match fails, we check for substrings or Levenshtein distance (how many edits to change one word to another).

This allows the system to realize that `Cinema HD V2` is the same app as `CinemaHD`.
