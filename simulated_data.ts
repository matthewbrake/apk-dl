
// This file simulates the "Network Responses" from the DJJubee website.
// It maps specific URL paths to their Raw HTML content.

const INDEX_HEADER = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN"><html><head><title>Index of /Apkss</title></head><body><h1>Index of /Apkss</h1><pre><img src="/icons/blank.gif" alt="Icon "> <a href="?C=N;O=D">Name</a>                    <a href="?C=M;O=A">Last modified</a>      <a href="?C=S;O=A">Size</a>  <a href="?C=D;O=A">Description</a><hr><img src="/icons/back.gif" alt="[PARENTDIR]"> <a href="/">Parent Directory</a>                             -   `;
const INDEX_FOOTER = `</pre><hr></body></html>`;

// The main index page containing list of folders
// Note: Browser has a special character to simulate URL encoding requirements
const ROOT_INDEX_HTML = `
${INDEX_HEADER}
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Adult-Content-ADULTS-ONLY/">Adult-Content-ADULTS-ONLY/</a> 24-Nov-2025 09:57    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Appstore/">Appstore/</a>                  09-Sep-2025 01:10    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Browser%E2%98%86/">Browser☆/</a>                  22-Sep-2025 08:54    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Fitness/">Fitness/</a>                   26-Nov-2025 09:53    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Games-Emulators-Premium/">Games-Emulators-Premium/</a>   15-Sep-2025 09:45    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Live/">Live/</a>                      26-Nov-2025 09:59    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Maintenance-Security/">Maintenance-Security/</a>      26-Nov-2025 09:38    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Media-Players/">Media-Players/</a>             26-Nov-2025 09:54    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Miscellaneous/">Miscellaneous/</a>             26-Nov-2025 09:51    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Movie/">Movie/</a>                     25-Nov-2025 09:06    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Music/">Music/</a>                     26-Nov-2025 10:01    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="Tools/">Tools/</a>                     26-Nov-2025 09:46    -   
<img src="/icons/folder.gif" alt="[DIR]"> <a href="VPN/">VPN/</a>                       10-Nov-2025 10:03    -   
${INDEX_FOOTER}
`;

// Helper to wrap file list in HTML structure
const makeDirHtml = (fileRows: string) => `${INDEX_HEADER}\n${fileRows}\n${INDEX_FOOTER}`;

// Map of "URL Path" -> "Raw HTML Content"
export const SITE_CONTENT_MAP: Record<string, string> = {
  // ROOT
  '/Apkss/': ROOT_INDEX_HTML,

  // MOVIE
  '/Apkss/Movie/': makeDirHtml(`
<a href="BeeAnime-v2.1.apk">BeeAnime-v2.1.apk</a>                                  27-Mar-2025 10:08            19025281
<a href="BeeAnime-v2.2[Stable].apk">BeeAnime-v2.2[Stable].apk</a>                          15-May-2025 08:31            19252965
<a href="BeeTV-v4.4.7.apk">BeeTV-v4.4.7.apk</a>                                   25-Nov-2025 09:06            15717156
<a href="CinemaHD-v2.4.0.apk">CinemaHD-v2.4.0.apk</a>                                22-Aug-2025 14:20            16550200
<a href="CinemaHD-v2.5.0[Beta].apk">CinemaHD-v2.5.0[Beta].apk</a>                          22-Oct-2025 09:15            17100300
<a href="FilmPlus-v1.9.9.apk">FilmPlus-v1.9.9.apk</a>                                10-Nov-2025 11:30            14200100
<a href="NovaTV-v1.9.5.apk">NovaTV-v1.9.5.apk</a>                                  12-Nov-2025 10:00            13500800
<a href="HDOBox-v2.0.20.apk">HDOBox-v2.0.20.apk</a>                                 15-Nov-2025 16:45            22100500
<a href="TeaTV-v10.9.1.apk">TeaTV-v10.9.1.apk</a>                                  26-Nov-2025 08:30            12500000
`),

  // MEDIA PLAYERS
  '/Apkss/Media-Players/': makeDirHtml(`
<a href="MXPlayer-v1.80.0[Pro].apk">MXPlayer-v1.80.0[Pro].apk</a>                          01-Nov-2025 08:00            25000000
<a href="VLC-v3.5.5.apk">VLC-v3.5.5.apk</a>                                     05-Nov-2025 09:00            30000000
<a href="JustPlayer-v1.5.0.apk">JustPlayer-v1.5.0.apk</a>                              10-Oct-2025 12:00            15000000
`),

  // VPN
  '/Apkss/VPN/': makeDirHtml(`
<a href="ExpressVPN-v11.6.0[Mod].apk">ExpressVPN-v11.6.0[Mod].apk</a>                        15-Nov-2025 10:00            35000000
<a href="NordVPN-v6.0.0.apk">NordVPN-v6.0.0.apk</a>                                 18-Nov-2025 11:30            40000000
<a href="IPVanish-v4.2.0.apk">IPVanish-v4.2.0.apk</a>                                20-Nov-2025 14:00            28000000
<a href="Surfshark-v2.8.5.apk">Surfshark-v2.8.5.apk</a>                               22-Nov-2025 09:15            22000000
`),

  // LIVE
  '/Apkss/Live/': makeDirHtml(`
<a href="LiveNetTV-v4.9.apk">LiveNetTV-v4.9.apk</a>                                   20-Nov-2025 11:00            18000000
<a href="OlaTV-v18.0.apk">OlaTV-v18.0.apk</a>                                      21-Nov-2025 15:30            25000000
<a href="SportsFire-v1.3.0.apk">SportsFire-v1.3.0.apk</a>                                24-Nov-2025 10:45            14500000
<a href="RedBoxTV-v2.5.apk">RedBoxTV-v2.5.apk</a>                                    25-Nov-2025 12:20            12000000
`),

  // TOOLS
  '/Apkss/Tools/': makeDirHtml(`
<a href="Downloader-v1.4.4.apk">Downloader-v1.4.4.apk</a>                                01-Jan-2025 00:00            5000000
<a href="MouseToggle-v1.0.6.apk">MouseToggle-v1.0.6.apk</a>                               05-Jun-2024 10:00            3000000
<a href="SendFilesTV-v1.2.apk">SendFilesTV-v1.2.apk</a>                                 15-Aug-2025 14:00            8000000
`),

  // BROWSER - Note the encoded key matching the href in ROOT_INDEX_HTML
  '/Apkss/Browser%E2%98%86/': makeDirHtml(`
<a href="PuffinTV-v9.0.apk">PuffinTV-v9.0.apk</a>                                    10-Sep-2025 08:30            45000000
<a href="SilkBrowser-v100.apk">SilkBrowser-v100.apk</a>                                 01-Nov-2025 09:00            60000000
<a href="TVBro-v1.6.1.apk">TVBro-v1.6.1.apk</a>                                     15-Aug-2025 12:00            12000000
`),

  // MAINTENANCE
  '/Apkss/Maintenance-Security/': makeDirHtml(`
<a href="SDMaid-v5.5.8[Pro].apk">SDMaid-v5.5.8[Pro].apk</a>                               12-Nov-2025 16:20            11000000
<a href="CleanMaster-v7.4.apk">CleanMaster-v7.4.apk</a>                                 18-Oct-2025 11:15            18000000
<a href="DefSquid-v1.5.apk">DefSquid-v1.5.apk</a>                                    20-Sep-2025 10:00            9000000
`)
};
