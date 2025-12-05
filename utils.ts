
import { AppEntry, SourceResult } from './types';

// Common words to remove from app names for normalization
const COMMON_WORDS = new Set(["apk", "mod", "android", "firestick", "fire", "stick", 
  "premium", "adfree", "lite", "download", "signed", "release", 
  "stable", "extra", "pro", "plus", "free", "mobile", "arm7", "arm8", "64bit", "32bit", "official", "debug"]);

const APP_NAME_MAPPING: Record<string, string> = {
  "teatv": "teatv",
  "tea tv": "teatv",
  "novatv": "novatv",
  "nova tv": "novatv",
  "vivatv": "vivatv",
  "filmplus": "filmplus",
  "cinemahd": "cinemahd",
  "cinema hd": "cinemahd",
  "cinemahd stable": "cinemahd",
  "hdo box": "hdo box",
  "hdobox": "hdo box",
  "cyberflix": "cyberflix",
  "beeanime": "beeanime",
  "beetv": "beetv",
  "mxplayer": "mx player",
  "mx player": "mx player",
  "vlc": "vlc",
  "expressvpn": "expressvpn",
  "nordvpn": "nordvpn",
  "ipvanish": "ipvanish",
  "kodi": "kodi",
};

/**
 * Advanced Regex Scraper Engine
 * Extracts directories and files from raw HTML of standard Apache/Nginx indexes.
 */
export const ScraperEngine = {
  extractFolders: (html: string): string[] => {
    // Matches <a href="Folder/">Folder/</a>
    // Excludes sorting links (?C=...), Parent Directory (/), and root (./)
    const folderRegex = /<a href="([^"?]+\/)">/g; 
    const folders: Set<string> = new Set();
    let match;
    while ((match = folderRegex.exec(html)) !== null) {
      const rawRef = match[1];
      // Filter out garbage links common in Directory Listings
      if (rawRef !== '/' && rawRef !== './' && !rawRef.startsWith('?') && !rawRef.startsWith('/')) { 
         folders.add(rawRef);
      }
    }
    return Array.from(folders);
  },

  extractFiles: (html: string, baseUrl: string, folderNameRaw: string, sourceId: string, sourceName: string): SourceResult[] => {
    const results: SourceResult[] = [];
    // Strict Regex: Ends in .apk, ignores query params
    const linkRegex = /<a href="([^"]+\.apk)">([^<]+)<\/a>/g;
    let match;
    
    let categoryDisplay = 'Miscellaneous';
    try {
        categoryDisplay = decodeURIComponent(folderNameRaw).replace(/\/$/, '');
    } catch (e) {
        categoryDisplay = folderNameRaw.replace(/\/$/, '');
    }

    while ((match = linkRegex.exec(html)) !== null) {
      const filename = match[1];
      const { version, tags } = parseFilenameInfo(filename);
      
      // Calculate a rough "size" if available in the row (Apache usually puts size after the </a>)
      // This is a heuristic and might need adjustment based on specific server format
      let size = 'Unknown';
      const rowContent = html.substring(match.index + match[0].length, match.index + match[0].length + 200);
      const sizeMatch = rowContent.match(/(\d+(\.\d+)?\s?[KMGT]?B)/i);
      if(sizeMatch) {
         size = sizeMatch[1];
      }
      
      results.push({
        id: Math.random().toString(36).substr(2, 9),
        sourceId: sourceId,
        sourceName: sourceName,
        filename: filename,
        version: version,
        url: `${baseUrl}${folderNameRaw}${filename}`,
        isLatest: false,
        extraInfo: tags,
        category: categoryDisplay,
        size: size 
      });
    }
    return results;
  }
};

export const normalizeAppName = (name: string): string => {
  let normalized = name.toLowerCase().trim();

  // Manual mapping
  for (const [key, value] of Object.entries(APP_NAME_MAPPING)) {
      if (normalized.includes(key)) return value;
  }

  // Remove version numbers (e.g., v1.2.3, 1.2.3)
  normalized = normalized.replace(/[vV-]?\d+\.\d+(\.\d+)?/g, '');
  
  // Remove content in brackets/parentheses
  normalized = normalized.replace(/\[.*?\]/g, ' ');
  normalized = normalized.replace(/\(.*?\)/g, ' ');

  // Remove special chars, keep only alphanumeric
  normalized = normalized.replace(/[^a-zA-Z0-9]/g, ' ');

  // Tokenize and filter common words
  const words = normalized.split(/\s+/).filter(word => 
      !COMMON_WORDS.has(word) && word.length > 2
  );

  return words.join("");
};

export const parseFilenameInfo = (filename: string) => {
  // Regex to extract version: v1.2.3, 1.2.3, -1.2.3
  const versionMatch = filename.match(/[vV_-]?(\d+\.\d+(\.\d+)?)/);
  const version = versionMatch ? versionMatch[1] : '0.0.0';

  // Extract tags like [Ad-Free], [Stable]
  const tags: string[] = [];
  const bracketMatches = filename.match(/\[(.*?)\]/g);
  if (bracketMatches) {
    bracketMatches.forEach(m => tags.push(m.replace(/[\[\]]/g, '')));
  }

  // Detect keywords in filename if not in brackets
  const lower = filename.toLowerCase();
  if (lower.includes('ad-free') || lower.includes('adfree')) { if(!tags.some(t => t.toLowerCase().includes('ad'))) tags.push('Ad-Free'); }
  if (lower.includes('lite')) { if(!tags.some(t => t.toLowerCase().includes('lite'))) tags.push('Lite'); }
  if (lower.includes('mod')) { if(!tags.some(t => t.toLowerCase().includes('mod'))) tags.push('Mod'); }
  if (lower.includes('premium')) { if(!tags.some(t => t.toLowerCase().includes('premium'))) tags.push('Premium'); }

  return { version, tags };
};

export const compareVersions = (v1: string, v2: string): number => {
  const cleanV1 = v1.replace(/[^\d.]/g, '').split('.').map(Number);
  const cleanV2 = v2.replace(/[^\d.]/g, '').split('.').map(Number);
  
  const len = Math.max(cleanV1.length, cleanV2.length);
  
  for (let i = 0; i < len; i++) {
      const num1 = cleanV1[i] || 0;
      const num2 = cleanV2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
  }
  return 0;
};

export const formatBytes = (bytes: number | undefined, decimals = 2) => {
  if (!bytes) return 'Unknown';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const standardizeFilename = (appName: string, version: string): string => {
  // Enforces the format: Name-vX.X.X.apk
  const cleanName = appName.replace(/[^a-zA-Z0-9]/g, '');
  return `${cleanName}-v${version}.apk`;
};

// Map apps to categories based on Folder Name or App Name
export const detectCategory = (appName: string, contextFolder?: string): string => {
  // Priority: Explicit Context Folder
  if (contextFolder && contextFolder !== '/' && contextFolder !== '') {
      return contextFolder.replace(/\/$/, ''); // Remove trailing slash
  }

  const lower = normalizeAppName(appName).toLowerCase();
  
  if (lower.includes('mx') || lower.includes('vlc') || lower.includes('player') || lower.includes('codec')) return 'Media-Players';
  if (lower.includes('bee') || lower.includes('cinema') || lower.includes('film') || lower.includes('nova') || lower.includes('hdo') || lower.includes('tea')) return 'Movie'; 
  if (lower.includes('sport') || lower.includes('live') || lower.includes('tv tap') || lower.includes('iptv')) return 'Live';
  if (lower.includes('adguard') || lower.includes('cleaner') || lower.includes('vpn') || lower.includes('security')) return 'Maintenance-Security';
  if (lower.includes('browser') || lower.includes('chrome') || lower.includes('firefox') || lower.includes('silk')) return 'Browser';
  if (lower.includes('kodi') || lower.includes('spmc')) return 'K0di';

  return 'Miscellaneous';
}
