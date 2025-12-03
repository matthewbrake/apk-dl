import React from 'react';
import { AppEntry } from '../types';
import { Download, FolderInput, Edit3, ChevronRight, Plus } from 'lucide-react';

interface AppListItemProps {
  app: AppEntry;
  onUpdate: (app: AppEntry) => void;
  onRename: (app: AppEntry) => void;
  onMove: (app: AppEntry) => void;
  onInstall?: (app: AppEntry) => void;
}

export const AppListItem: React.FC<AppListItemProps> = ({ app, onUpdate, onRename, onMove, onInstall }) => {
  const isUpdateAvailable = app.availableUpdates.length > 0;
  const isInstalled = app.status !== 'not_installed';

  return (
    <div className={`group flex items-center justify-between p-4 border-b border-slate-800 transition-colors ${!isInstalled ? 'bg-slate-950/50 hover:bg-slate-900' : 'bg-slate-900/40 hover:bg-slate-800/60'}`}>
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-3 mb-1">
          <h3 className={`text-sm font-bold truncate ${!isInstalled ? 'text-indigo-200' : 'text-slate-200'}`}>{app.name}</h3>
          {isUpdateAvailable && isInstalled && (
             <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
             </span>
          )}
          {!isInstalled && (
             <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">ONLINE</span>
          )}
        </div>
        <p className="text-xs text-slate-500 font-mono truncate" title={app.localPath || ''}>
          {app.localPath || `Source: ${app.source}`}
        </p>
      </div>

      <div className="flex items-center gap-6 mr-6">
        <div className="text-right w-20">
          <div className="text-[10px] text-slate-500 uppercase">Version</div>
          <div className={`font-mono text-sm ${app.remoteVersion ? 'text-emerald-400' : 'text-slate-300'}`}>
            {app.remoteVersion || app.localVersion || '?'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
        {isInstalled ? (
          <>
            <button 
              onClick={() => onMove(app)}
              title="Move to Category Repo"
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded transition-colors"
            >
              <FolderInput size={16} />
            </button>
            <button 
              onClick={() => onRename(app)}
              title="Standardize Filename"
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition-colors"
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={() => onUpdate(app)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all
                ${isUpdateAvailable 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20' 
                  : 'bg-slate-700 text-slate-400 hover:text-slate-200'}`}
            >
              {isUpdateAvailable ? 'Compare' : 'Details'}
              <ChevronRight size={14} />
            </button>
          </>
        ) : (
          <button 
            onClick={() => onInstall && onInstall(app)}
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
          >
             <Plus size={14} />
             Install
          </button>
        )}
      </div>
    </div>
  );
};