import { SourceConfig } from './types';

export const SOURCES: SourceConfig[] = [
  {
    id: 'streamingupdates',
    name: 'StreamingUpdates.net',
    url: 'https://streamingupdates.net/downloads/{app}/',
    type: 'html_scrape'
  },
  {
    id: 'firestickhacks',
    name: 'FireStickHacks',
    url: 'https://firestickhacks.com/downloads/',
    type: 'html_scrape'
  },
  {
    id: 'djjubee',
    name: 'DJJubee AppBoxes',
    url: 'https://www.djjubeemedia.appboxes.co/Apkss/',
    type: 'directory_list',
    categories: [
      'Adult-Content-ADULTS-ONLY',
      'Appstore',
      'Browser',
      'Fitness',
      'Games-Emulators-Premium',
      'Live',
      'Maintenance-Security',
      'Media-Players',
      'Miscellaneous',
      'Movie',
      'Music',
      'Tools',
      'VPN'
    ]
  },
  {
    id: 'direct',
    name: 'Direct Developer Links',
    url: 'Various',
    type: 'direct'
  }
];

export const MOCK_LOCAL_LIBRARY = [
  { name: "TeaTV", version: "10.8.2", path: "/mnt/zima/.../TeaTV-v10.8.2.apk" },
  { name: "Cinema HD", version: "2.4.0", path: "/mnt/zima/.../CinemaHD-v2.4.0.apk" },
  { name: "BeeTV", version: "3.5.6", path: "/mnt/zima/.../BeeTV-v3.5.6.apk" },
  { name: "FilmPlus", version: "1.9.8", path: "/mnt/zima/.../FilmPlus-v1.9.8.apk" },
  { name: "NovaTV", version: "1.9.2b", path: "/mnt/zima/.../NovaTV-v1.9.2b.apk" },
  { name: "MX Player Pro", version: "1.76.1", path: "/mnt/zima/.../MXPlayer-v1.76.1.apk" },
  { name: "Kodi", version: "20.2", path: "/mnt/zima/.../Kodi-v20.2.apk" },
  { name: "SportsFire", version: "1.2.1", path: "/mnt/zima/.../SportsFire-v1.2.1.apk" },
];

// This simulates the "Index" of the websites you are scraping
export const MOCK_REMOTE_DATABASE = [
  { name: "Spotify Premium", version: "8.8.56", filename: "Spotify-v8.8.56[Mod].apk", source: "FireStickHacks" },
  { name: "Netflix Mod", version: "8.9.1", filename: "Netflix-v8.9.1[Premium].apk", source: "StreamingUpdates" },
  { name: "ExpressVPN", version: "11.5.0", filename: "ExpressVPN-v11.5.0[Mod].apk", source: "DJJubee" },
  { name: "IPVanish", version: "4.1.0", filename: "IPVanish-v4.1.0.apk", source: "DJJubee" },
  { name: "SD Maid Pro", version: "5.5.8", filename: "SDMaid-v5.5.8[Pro].apk", source: "FireStickHacks" },
  { name: "VLC Player", version: "3.5.4", filename: "VLC-v3.5.4.apk", source: "DJJubee" },
  { name: "Aptoide TV", version: "5.1.2", filename: "AptoideTV-v5.1.2.apk", source: "StreamingUpdates" },
  { name: "Downloader", version: "1.4.4", filename: "Downloader-v1.4.4.apk", source: "Direct" },
  { name: "Mouse Toggle", version: "1.0.6", filename: "MouseToggle-v1.0.6.apk", source: "FireStickHacks" },
  { name: "Wolf Launcher", version: "0.1.9", filename: "WolfLauncher-v0.1.9.apk", source: "TechDoctorUK" },
  { name: "SmartTubeNext", version: "18.50", filename: "SmartTubeNext-v18.50[Beta].apk", source: "GitHub" },
  { name: "OnStream", version: "1.1.2", filename: "OnStream-v1.1.2.apk", source: "HDO" },
  { name: "HDO Box", version: "2.0.18", filename: "HDOBox-v2.0.18.apk", source: "DJJubee" },
  { name: "Stremio", version: "1.6.4", filename: "Stremio-v1.6.4[ARM].apk", source: "Official" },
];