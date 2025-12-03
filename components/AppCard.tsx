import React from 'react';
import { AppEntry } from '../types';
import { Download, CheckCircle, Smartphone, RefreshCw, FolderInput, Edit3, PlusCircle } from 'lucide-react';

interface AppCardProps {
  app: AppEntry;
  onUpdate: (app: AppEntry) => void;
  onRename: (app: AppEntry) => void;
  onMove: (app: AppEntry) => void;
  onInstall?: (app: AppEntry) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onUpdate, onRename, onMove, onInstall }) => {
  const isUpdateAvailable = app.availableUpdates.length > 0;
  const isInstalled = app.status !== 'not_installed';
  
  return (
    <div className={`
      relative group overflow-hidden rounded-xl border p-4 transition-all duration-300 flex flex-col
      ${!isInstalled
        ? 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60'
        : isUpdateAvailable 
          ? 'bg-slate-800/50 border-amber-500/50 hover:border-amber-400 shadow-lg shadow-amber-900/10' 
          : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'}
    `}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${!isInstalled ? 'bg-slate-800' : 'bg-slate-700/50'}`}>
          <Smartphone className={!isInstalled ? "text-slate-500" : isUpdateAvailable ? "text-amber-400" : "text-slate-400"} size={24} />
        </div>
        {isInstalled && (
          <div className="flex gap-1">
            <button 
              onClick={() => onRename(app)}
              title="Standardize Name"
              className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-slate-700/50 rounded transition-colors"
            >
              <Edit3 size={14} />
            </button>
            <button 
              onClick={() => onMove(app)}
              title="Move to Repo"
              className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-slate-700/50 rounded transition-colors"
            >
              <FolderInput size={14} />
            </button>
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-100 mb-1 truncate" title={app.name}>{app.name}</h3>
      <p className="text-xs text-slate-500 mb-4 font-mono truncate" title={app.localPath || 'Available Online'}>
        {app.localPath ? app.localPath.split('/').pop() : 'Not Installed'}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm mt-auto">
        <div className={`bg-slate-900/50 p-2 rounded border border-slate-800 ${!isInstalled && 'opacity-50'}`}>
          <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">LOCAL</div>
          <div className="font-mono text-slate-300 truncate">{app.localVersion ? `v${app.localVersion}` : '-'}</div>
        </div>
        <div className={`p-2 rounded border ${isUpdateAvailable ? 'bg-amber-900/20 border-amber-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">{!isInstalled ? 'LATEST' : 'REMOTE'}</div>
          <div className={`font-mono truncate ${isUpdateAvailable || !isInstalled ? 'text-emerald-400' : 'text-slate-500'}`}>
            {app.remoteVersion ? `v${app.remoteVersion}` : (!isInstalled ? 'Unknown' : 'Syncing...')}
          </div>
        </div>
      </div>

      {isInstalled ? (
        <button 
          onClick={() => onUpdate(app)}
          className={`w-full py-2 px-4 rounded text-sm font-bold flex items-center justify-center gap-2 transition-all
            ${isUpdateAvailable 
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg' 
              : app.status === 'downloading'
                ? 'bg-slate-700 text-slate-400 cursor-wait'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}
          `}
        >
          {isUpdateAvailable ? (
            <>
              <Download size={16} />
              Compare {app.availableUpdates.length} Sources
            </>
          ) : app.status === 'downloading' ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              Check Versions
            </>
          )}
        </button>
      ) : (
        <button 
          onClick={() => onInstall && onInstall(app)}
          className="w-full py-2 px-4 rounded text-sm font-bold flex items-center justify-center gap-2 transition-all bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        >
           {app.status === 'downloading' ? (
             <>
               <RefreshCw size={16} className="animate-spin" />
               Installing...
             </>
           ) : (
             <>
               <PlusCircle size={16} />
               Install App
             </>
           )}
        </button>
      )}
    </div>
  );
};