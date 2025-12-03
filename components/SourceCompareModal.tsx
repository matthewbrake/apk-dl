import React from 'react';
import { SourceResult, AppEntry } from '../types';
import { Download, X, Check, ShieldCheck, AlertTriangle } from 'lucide-react';

interface SourceCompareModalProps {
  app: AppEntry;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (result: SourceResult) => void;
}

export const SourceCompareModal: React.FC<SourceCompareModalProps> = ({ app, isOpen, onClose, onDownload }) => {
  if (!isOpen) return null;

  // Sort results: Latest versions first, then by Source name
  const sortedResults = [...app.availableUpdates].sort((a, b) => {
    // Basic version compare (descending)
    const v1 = a.version.split('.').map(Number);
    const v2 = b.version.split('.').map(Number);
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
        const val1 = v1[i] || 0;
        const val2 = v2[i] || 0;
        if (val1 > val2) return -1;
        if (val1 < val2) return 1;
    }
    return 0;
  });

  const latestVersion = sortedResults.length > 0 ? sortedResults[0].version : '0.0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" />
              Available Versions: <span className="text-indigo-400">{app.name}</span>
            </h2>
            <p className="text-sm text-slate-400 font-mono mt-1">Current Local: v{app.localVersion}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                <th className="pb-3 pl-2">Source</th>
                <th className="pb-3">Version</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Filename / Tags</th>
                <th className="pb-3">Size</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sortedResults.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                     No results found during the last scan.
                   </td>
                 </tr>
              ) : (
                sortedResults.map((result) => {
                  const isLatest = result.version === latestVersion;
                  
                  return (
                    <tr key={result.id} className={`group hover:bg-slate-800/50 transition-colors ${isLatest ? 'bg-emerald-900/10' : ''}`}>
                      <td className="py-4 pl-2">
                        <span className="font-semibold text-slate-300">{result.sourceName}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${isLatest ? 'text-emerald-400' : 'text-slate-400'}`}>
                            v{result.version}
                          </span>
                          {isLatest && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">LATEST</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-indigo-300 font-medium">
                        {result.category || 'N/A'}
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-slate-300 mb-1">{result.filename}</div>
                        <div className="flex gap-1 flex-wrap">
                          {result.extraInfo?.map((tag, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-slate-500 font-mono">
                        {result.size || 'N/A'}
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button 
                          onClick={() => onDownload(result)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-sm font-medium inline-flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                        >
                          <Download size={14} />
                          Fetch
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <AlertTriangle size={12} className="text-amber-500" />
            <span>Verifying SHA-256 hashes is recommended after download.</span>
          </div>
          <div>
            Found {sortedResults.length} matching files.
          </div>
        </div>
      </div>
    </div>
  );
};