
import { AppEntry } from './types';

// Common words to remove from app names for normalization
const COMMON_WORDS = new Set(["apk", "mod", "android", "firestick", "fire", "stick", 
  "premium", "adfree", "lite", "download", "signed", "release", 
  "stable", "extra", "pro", "plus", "free", "mobile", "arm7", "arm8", "64bit", "32bit"]);

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

export const normalizeAppName = (name: string): string => {
  let normalized = name.toLowerCase().trim();

  // Manual mapping
  for (const [key, value] of Object.entries(APP_NAME_MAPPING)) {
      if (normalized.includes(key)) return value;
  }

  // Remove version numbers specifically
  normalized = normalized.replace(/[vV-]?\d+\.\d+(\.\d+)?/g, '');
  
  // Remove brackets and content often found in them if they are attributes
  normalized = normalized.replace(/\[.*?\]/g, ' ');
  normalized = normalized.replace(/\(.*?\)/g, ' ');

  // Remove special chars
  normalized = normalized.replace(/[^a-zA-Z0-9]/g, ' ');

  // Tokenize and filter common words
  const words = normalized.split(/\s+/).filter(word => 
      !COMMON_WORDS.has(word) && word.length > 2
  );

  return words.join("");
};

export const parseFilenameInfo = (filename: string) => {
  // Regex to extract version: looks for v1.2.3, 1.2.3, etc.
  // Enhanced to handle -1.2.3- or _1.2.3_
  const versionMatch = filename.match(/[vV_-]?(\d+\.\d+(\.\d+)?)/);
  const version = versionMatch ? versionMatch[1] : '0.0.0';

  // Extract tags like [Ad-Free], [Stable]
  const tags: string[] = [];
  const bracketMatches = filename.match(/\[(.*?)\]/g);
  if (bracketMatches) {
    bracketMatches.forEach(m => tags.push(m.replace(/[\[\]]/g, '')));
  }

  // Detect keywords in filename if not in brackets
  if (filename.toLowerCase().includes('ad-free') && !tags.some(t => t.toLowerCase().includes('ad-free'))) tags.push('Ad-Free');
  if (filename.toLowerCase().includes('lite') && !tags.some(t => t.toLowerCase().includes('lite'))) tags.push('Lite');
  if (filename.toLowerCase().includes('mod') && !tags.some(t => t.toLowerCase().includes('mod'))) tags.push('Mod');

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

// New function to map apps to the specific directories provided
// Now primarily relies on the passed directory (context), falls back to name guessing
export const detectCategory = (appName: string, contextFolder?: string): string => {
  // If we scanned a folder specifically, that IS the category.
  if (contextFolder && contextFolder !== '/' && contextFolder !== '') {
      return contextFolder.replace(/\/$/, ''); // Remove trailing slash
  }

  const lower = normalizeAppName(appName).toLowerCase();
  
  // Specific mappings based on common Firestick apps (Fallback)
  if (lower.includes('mx') || lower.includes('vlc') || lower.includes('player') || lower.includes('codec')) {
    return 'Media-Players';
  }
  
  if (lower.includes('bee') || lower.includes('cinema') || lower.includes('film') || 
      lower.includes('nova') || lower.includes('hdo') || lower.includes('tea') || 
      lower.includes('flix') || lower.includes('anime')) {
    return 'Movie'; 
  }
  
  if (lower.includes('sport') || lower.includes('live') || lower.includes('tv tap') || lower.includes('iptv')) {
    return 'Live';
  }
  
  if (lower.includes('adguard') || lower.includes('cleaner') || lower.includes('vpn') || lower.includes('security')) {
    return 'Maintenance-Security';
  }
  
  if (lower.includes('browser') || lower.includes('chrome') || lower.includes('firefox') || lower.includes('silk')) {
    return 'Browser';
  }
  
  if (lower.includes('kodi') || lower.includes('spmc')) {
    return 'K0di';
  }

  return 'Miscellaneous';
}