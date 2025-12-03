
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SOURCES as DEFAULT_SOURCES, MOCK_LOCAL_LIBRARY } from './constants';
import { AppEntry, LogEntry, ViewMode, SourceResult, DisplayStyle, SourceConfig, AppSettings } from './types';
import { normalizeAppName, compareVersions, parseFilenameInfo, standardizeFilename, detectCategory } from './utils';
import { AppCard } from './components/AppCard';
import { AppListItem } from './components/AppListItem';
import { Terminal } from './components/Terminal';
import { SourceCompareModal } from './components/SourceCompareModal';
import { Search, HardDrive, Globe, Play, RefreshCw, Terminal as TerminalIcon, ShieldCheck, LayoutGrid, List as ListIcon, Cloud, Settings, Save, Plus, Trash2, Cpu, Sparkles } from 'lucide-react';

// Import the "Virtual Web Server" content map
import { SITE_CONTENT_MAP } from './simulated_data';

const App: React.FC = () => {
  // --- STATE ---
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [remoteApps, setRemoteApps] = useState<AppEntry[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ViewMode>(ViewMode.LIBRARY);
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>(DisplayStyle.GRID);
  
  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    sources: DEFAULT_SOURCES,
    webPort: 3000,
    downloadPath: '/mnt/zima/HDD/data/InstallersAndTools/MobileApps/Firestick/_UPDATE',
    updateInterval: 24,
    apiKeys: {
      openai: '',
      gemini: ''
    }
  });

  // Modal State
  const [selectedApp, setSelectedApp] = useState<AppEntry | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // --- INITIALIZATION ---

  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [...prev, entry]);
  }, []);

  // Load Settings from LocalStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('apk_manager_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
      addLog('INFO', 'Loaded configuration from LocalStorage.');
    }
  }, [addLog]);

  // Load Local Library
  useEffect(() => {
    const initialApps: AppEntry[] = MOCK_LOCAL_LIBRARY.map(mock => ({
      id: Math.random().toString(36).substr(2, 9),
      name: mock.name,
      normalizedName: normalizeAppName(mock.name),
      localVersion: mock.version,
      remoteVersion: null,
      status: 'current',
      source: 'unknown',
      localPath: mock.path,
      availableUpdates: []
    }));
    setApps(initialApps);
    addLog('INFO', `Mounted Local Library. Found ${initialApps.length} APKs.`);
  }, [addLog]);

  // --- OPTIONAL AI LOGIC ---
  const runAiAnalysis = async (appName: string) => {
    // This function demonstrates how the Optional API keys would be used.
    // It is strictly optional and only runs if keys are present.
    if (settings.apiKeys?.gemini || settings.apiKeys?.openai) {
      addLog('INFO', `[AI OPTIONAL] analyzing metadata for ${appName}...`);
      // In a real backend, this would call: const aiData = await api.analyze(appName, settings.apiKeys);
      await new Promise(r => setTimeout(r, 500)); // Simulate API delay
      addLog('SUCCESS', `[AI OPTIONAL] Analysis complete. Enhanced tags generated.`);
    } else {
      // Gracefully skip if no keys
      // addLog('INFO', `Skipping AI analysis (No API Key provided).`);
    }
  };

  // --- CRAWLER LOGIC ---

  const extractFolders = (html: string): string[] => {
    const folderRegex = /<a href="([^"]+\/)">/g; 
    const folders: string[] = [];
    let match;
    while ((match = folderRegex.exec(html)) !== null) {
      const rawRef = match[1];
      if (rawRef !== '/' && !rawRef.startsWith('?') && !rawRef.startsWith('/')) { 
         folders.push(rawRef);
      }
    }
    return folders;
  };

  const extractFiles = (html: string, baseUrl: string, folderNameRaw: string, sourceId: string, sourceName: string): SourceResult[] => {
    const results: SourceResult[] = [];
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
        size: 'Unknown' 
      });
    }
    return results;
  };

  const performScan = async () => {
    setIsScanning(true);
    addLog('INFO', '--- STARTING SCAN ---');
    
    // Check for Optional API Keys usage
    if (settings.apiKeys?.gemini || settings.apiKeys?.openai) {
        addLog('INFO', 'AI Engine Enabled: Using API Keys for enhanced parsing.');
    } else {
        addLog('INFO', 'Standard Mode: Using Regex Crawler (AI Disabled).');
    }
    
    let allFoundApps: SourceResult[] = [];

    // Iterate through configured sources
    for (const source of settings.sources) {
        if (source.type === 'directory_list') {
            addLog('INFO', `Connecting to Source: ${source.name} (${source.url})`);
            
            // NOTE: In production, this would be: const response = await fetch('/api/proxy?url=' + source.url);
            // For demo, we check our simulated map.
            const pathKey = '/Apkss/'; // Hardcoded mapping for simulation only
            const rootHtml = SITE_CONTENT_MAP[pathKey]; 

            if (!rootHtml) {
                addLog('ERROR', `Could not reach ${source.url} (Simulation missing)`);
                continue;
            }

            const folders = extractFolders(rootHtml);
            addLog('SUCCESS', `[${source.name}] Found ${folders.length} directories.`);
            
            // Recursive Scan
            for (const folderRaw of folders) {
                let folderDisplay = folderRaw;
                try { folderDisplay = decodeURIComponent(folderRaw); } catch(e) {}
                
                addLog('INFO', `[${source.name}] Crawling: ${folderDisplay}...`);
                
                // Simulation Mapping
                const subPathKey = `/Apkss/${folderRaw}`;
                const folderHtml = SITE_CONTENT_MAP[subPathKey];
                
                await new Promise(r => setTimeout(r, 200)); 

                if (folderHtml) {
                    const files = extractFiles(folderHtml, source.url, folderRaw, source.id, source.name);
                    if (files.length > 0) {
                        addLog('INFO', `   -> Indexed ${files.length} files`);
                        allFoundApps = [...allFoundApps, ...files];
                    }
                }
            }
        } else {
             addLog('WARN', `Skipping ${source.name} (HTML Scrape not implemented in demo)`);
        }
    }

    addLog('SUCCESS', `Scan Complete. Total Files Indexed: ${allFoundApps.length}`);
    updateAppStates(allFoundApps);
    setIsScanning(false);
  };

  const updateAppStates = (foundFiles: SourceResult[]) => {
    addLog('INFO', 'Consolidating Index...');
    const uniqueAppsMap = new Map<string, AppEntry>();

    foundFiles.forEach(res => {
        const normName = normalizeAppName(res.filename);
        
        if (!uniqueAppsMap.has(normName)) {
            uniqueAppsMap.set(normName, {
                id: Math.random().toString(36).substr(2, 9),
                name: normName.charAt(0).toUpperCase() + normName.slice(1),
                normalizedName: normName,
                localVersion: null,
                remoteVersion: res.version,
                status: 'not_installed',
                source: res.sourceName,
                localPath: null,
                category: res.category,
                availableUpdates: [res]
            });
            // Trigger Optional AI Analysis for new discoveries
            runAiAnalysis(normName);
        } else {
            const existing = uniqueAppsMap.get(normName)!;
            existing.availableUpdates.push(res);
            if (compareVersions(res.version, existing.remoteVersion || '0.0.0') > 0) {
                existing.remoteVersion = res.version;
            }
        }
    });

    setRemoteApps(Array.from(uniqueAppsMap.values()));
    
    setApps(prevApps => {
      return prevApps.map(localApp => {
        const remoteMatch = uniqueAppsMap.get(localApp.normalizedName);
        if (remoteMatch) {
            const isUpdate = compareVersions(remoteMatch.remoteVersion || '0.0.0', localApp.localVersion || '99.9.9') > 0;
            return {
                ...localApp,
                remoteVersion: remoteMatch.remoteVersion,
                availableUpdates: remoteMatch.availableUpdates,
                status: isUpdate ? 'update_available' : 'current'
            };
        }
        return localApp;
      });
    });
    addLog('SUCCESS', 'Library synced.');
  };

  // --- ACTIONS ---

  const handleSettingsSave = () => {
    localStorage.setItem('apk_manager_settings', JSON.stringify(settings));
    addLog('SUCCESS', 'Configuration saved to LocalStorage');
  };

  const handleAddSource = () => {
    const newSource: SourceConfig = {
      id: Math.random().toString(36).substr(2, 5),
      name: 'New Source',
      url: 'https://',
      type: 'directory_list'
    };
    setSettings(prev => ({ ...prev, sources: [...prev.sources, newSource] }));
  };

  const handleRemoveSource = (id: string) => {
    setSettings(prev => ({ ...prev, sources: prev.sources.filter(s => s.id !== id) }));
  };

  const handleUpdateSource = (id: string, field: keyof SourceConfig, value: string) => {
    setSettings(prev => ({
      ...prev,
      sources: prev.sources.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleUpdateApiKey = (key: 'openai' | 'gemini', value: string) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: { ...prev.apiKeys, [key]: value }
    }));
  };

  const handleDownload = async (result: SourceResult) => {
    if (!selectedApp) return;
    setIsCompareModalOpen(false);
    
    addLog('INFO', `INITIATING DOWNLOAD...`);
    const targetDir = selectedApp.localPath 
        ? selectedApp.localPath.split('/').slice(0, -1).join('/') 
        : `${settings.downloadPath}/${result.category || 'Downloads'}`;
        
    const command = `wget -c "${result.url}" -O "${targetDir}/${result.filename}"`;
    addLog('INFO', `EXEC: ${command}`);

    setApps(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'downloading' } : a));
    await new Promise(r => setTimeout(r, 2000));
    addLog('SUCCESS', `Download Complete: ${targetDir}/${result.filename}`);
    
    setApps(prev => prev.map(a => a.id === selectedApp.id ? { 
      ...a, 
      localVersion: result.version, 
      status: 'current',
      remoteVersion: null,
      localPath: `${targetDir}/${result.filename}`
    } : a));
  };

  const handleInstall = async (app: AppEntry) => {
    const category = app.category || detectCategory(app.name);
    const installPath = `${settings.downloadPath}/${category}/`;
    addLog('INFO', `Installing to: ${installPath}`);
    
    setRemoteApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'downloading' } : a));
    const targetSource = [...app.availableUpdates].sort((a,b) => compareVersions(b.version, a.version))[0];
    
    await new Promise(r => setTimeout(r, 2000));
    addLog('SUCCESS', `Installed ${targetSource.filename}`);
    
    const newLocalApp: AppEntry = {
      ...app,
      id: Math.random().toString(36).substr(2, 9),
      status: 'current',
      localVersion: app.remoteVersion,
      remoteVersion: null,
      localPath: `${installPath}${targetSource.filename}`,
      availableUpdates: []
    };
    setApps(prev => [newLocalApp, ...prev]);
    setRemoteApps(prev => prev.filter(a => a.id !== app.id)); 
  };

  const handleRename = (app: AppEntry) => {
    if (!app.localPath || !app.localVersion) return;
    const newName = standardizeFilename(app.name, app.localVersion);
    const newPath = app.localPath.replace(/[^\/]+$/, newName);
    addLog('INFO', `Renaming to: ${newName}`);
    setApps(prev => prev.map(a => a.id === app.id ? { ...a, localPath: newPath } : a));
  };

  const handleMove = (app: AppEntry) => {
    if (!app.localPath) return;
    const category = detectCategory(app.name);
    const filename = app.localPath.split('/').pop();
    const newPath = `${settings.downloadPath}/${category}/${filename}`;
    addLog('INFO', `Moving to: ${newPath}`);
    setApps(prev => prev.map(a => a.id === app.id ? { ...a, localPath: newPath } : a));
  };

  // --- RENDERING HELPERS ---

  const filteredLocalApps = useMemo(() => apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.normalizedName.includes(searchTerm.toLowerCase())
  ), [apps, searchTerm]);

  const filteredRemoteApps = useMemo(() => {
    return remoteApps.filter(remote => {
        const matchesSearch = searchTerm === '' || remote.name.toLowerCase().includes(searchTerm.toLowerCase());
        const isInstalled = apps.some(local => local.normalizedName === remote.normalizedName);
        return matchesSearch && !isInstalled;
    });
  }, [remoteApps, apps, searchTerm]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="text-emerald-500" />
            <h1 className="text-xl font-bold tracking-tight text-white">APK Manager</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono">v4.2.0-prod</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab(ViewMode.LIBRARY)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === ViewMode.LIBRARY ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <HardDrive size={18} />
            Library & Discover
          </button>
          <button 
            onClick={() => setActiveTab(ViewMode.SETTINGS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === ViewMode.SETTINGS ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setShowTerminal(!showTerminal)}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
          >
            <span>Toggle Console</span>
            <TerminalIcon size={14} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 backdrop-blur-sm z-10">
          {activeTab === ViewMode.LIBRARY ? (
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                />
                </div>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                <button onClick={() => setDisplayStyle(DisplayStyle.GRID)} className={`p-1.5 rounded ${displayStyle === DisplayStyle.GRID ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}><LayoutGrid size={16} /></button>
                <button onClick={() => setDisplayStyle(DisplayStyle.LIST)} className={`p-1.5 rounded ${displayStyle === DisplayStyle.LIST ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}><ListIcon size={16} /></button>
                </div>
            </div>
          ) : (
             <div className="flex-1"><h2 className="text-lg font-bold">System Configuration</h2></div>
          )}
          
          {activeTab === ViewMode.LIBRARY && (
             <button 
                onClick={performScan}
                disabled={isScanning}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold shadow-lg transition-all ${isScanning ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            >
                {isScanning ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
                {isScanning ? 'Run Crawler' : 'Scan Updates'}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 pb-64 scroll-smooth">
          {activeTab === ViewMode.LIBRARY && (
            <>
              <div className="mb-8">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><HardDrive size={16} /> My Library ({filteredLocalApps.length})</h2>
                {displayStyle === DisplayStyle.GRID ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredLocalApps.map(app => (
                      <AppCard key={app.id} app={app} onUpdate={(a) => {setSelectedApp(a); setIsCompareModalOpen(true);}} onRename={handleRename} onMove={handleMove}/>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-900/20 border border-slate-800 rounded-lg overflow-hidden">
                    {filteredLocalApps.map(app => (
                      <AppListItem key={app.id} app={app} onUpdate={(a) => {setSelectedApp(a); setIsCompareModalOpen(true);}} onRename={handleRename} onMove={handleMove}/>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-8 pt-8 border-t border-slate-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2"><Cloud size={16} /> Discover ({filteredRemoteApps.length})</h2>
                  {remoteApps.length === 0 && !isScanning && <span className="text-xs text-amber-500">Click "Scan Updates" to populate.</span>}
                </div>
                {displayStyle === DisplayStyle.GRID ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRemoteApps.map(app => <AppCard key={app.id} app={app} onUpdate={() => {}} onRename={() => {}} onMove={() => {}} onInstall={handleInstall}/>)}
                  </div>
                ) : (
                   <div className="bg-slate-900/20 border border-slate-800 rounded-lg overflow-hidden">
                    {filteredRemoteApps.map(app => <AppListItem key={app.id} app={app} onUpdate={() => {}} onRename={() => {}} onMove={() => {}} onInstall={handleInstall}/>)}
                   </div>
                )}
              </div>
            </>
          )}

          {activeTab === ViewMode.SETTINGS && (
            <div className="max-w-4xl mx-auto space-y-8">
               {/* Path Configuration */}
               <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4">Storage & Network</h3>
                 <div className="grid gap-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Download Root Path (Server)</label>
                     <input 
                        type="text" 
                        value={settings.downloadPath}
                        onChange={(e) => setSettings({...settings, downloadPath: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 font-mono"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Web UI Port (Docker)</label>
                     <input 
                        type="number" 
                        value={settings.webPort}
                        onChange={(e) => setSettings({...settings, webPort: parseInt(e.target.value)})}
                        className="w-32 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 font-mono"
                     />
                   </div>
                 </div>
               </div>

               {/* API KEYS - Optional AI Integration */}
               <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                 <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-purple-400" size={20} />
                    <div>
                        <h3 className="text-lg font-bold text-white">AI Extensions (Optional)</h3>
                        <p className="text-xs text-slate-500">Add API keys to enable future AI categorization and changelog summarization features.</p>
                    </div>
                 </div>
                 <div className="grid gap-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">OpenAI API Key</label>
                     <input 
                        type="password" 
                        value={settings.apiKeys?.openai || ''}
                        onChange={(e) => handleUpdateApiKey('openai', e.target.value)}
                        placeholder="sk-..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 font-mono"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Google Gemini API Key</label>
                     <input 
                        type="password" 
                        value={settings.apiKeys?.gemini || ''}
                        onChange={(e) => handleUpdateApiKey('gemini', e.target.value)}
                        placeholder="AIza..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 font-mono"
                     />
                   </div>
                 </div>
               </div>

               {/* Source Configuration */}
               <div className="bg-slate-800/30 border border