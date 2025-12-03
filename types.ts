
export interface SourceResult {
  id: string;
  sourceId: string;
  sourceName: string;
  filename: string;
  version: string;
  url: string;
  date?: string;
  size?: string;
  isLatest: boolean;
  extraInfo?: string[]; // e.g., ["Ad-Free", "Lite"]
  category?: string; // New field for directory mapping
}

export interface AppEntry {
  id: string;
  name: string;
  normalizedName: string;
  localVersion: string | null; // Changed to nullable for new apps
  remoteVersion: string | null;
  status: 'current' | 'update_available' | 'not_found' | 'downloading' | 'updated' | 'not_installed';
  source: string;
  localPath: string | null; // Changed to nullable for new apps
  size?: string;
  lastScanned?: Date;
  category?: string;
  availableUpdates: SourceResult[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

export interface SourceConfig {
  id: string;
  name: string;
  url: string;
  type: 'html_scrape' | 'directory_list' | 'direct';
  categories?: string[];
}

export interface ApiKeys {
  openai?: string;
  gemini?: string;
}

export interface AppSettings {
  sources: SourceConfig[];
  webPort: number;
  downloadPath: string;
  updateInterval: number;
  apiKeys?: ApiKeys; // Optional API keys for AI features
}

export interface FolderScanResult {
    path: string;
    filesFound: number;
}

export enum ViewMode {
  LIBRARY = 'LIBRARY',
  SOURCES = 'SOURCES',
  SETTINGS = 'SETTINGS'
}

export enum DisplayStyle {
  GRID = 'GRID',
  LIST = 'LIST'
}