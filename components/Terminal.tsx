import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal as TerminalIcon, XCircle, Minimize2, Maximize2 } from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
  isOpen: boolean;
  onToggle: () => void;
  onClear: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ logs, isOpen, onToggle, onClear }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, isOpen]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-blue-400';
      case 'WARN': return 'text-yellow-400';
      case 'ERROR': return 'text-red-500';
      case 'SUCCESS': return 'text-emerald-400';
      default: return 'text-slate-300';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 shadow-2xl flex flex-col h-64 z-50">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2 text-slate-300">
          <TerminalIcon size={16} />
          <span className="text-xs font-mono font-bold">EXECUTION LOG / VERBOSE OUTPUT</span>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={onClear} className="p-1 hover:text-white text-slate-400 text-xs uppercase tracking-wider">
            Clear
          </button>
          <button onClick={onToggle} className="p-1 hover:text-white text-slate-400">
            <XCircle size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs terminal-scroll bg-black/50 backdrop-blur-sm">
        {logs.length === 0 && <div className="text-slate-600 italic">No logs generated yet...</div>}
        {logs.map((log) => (
          <div key={log.id} className="mb-1 flex gap-3">
            <span className="text-slate-500 min-w-[130px]">{log.timestamp}</span>
            <span className={`font-bold min-w-[60px] ${getLevelColor(log.level)}`}>[{log.level}]</span>
            <span className="text-slate-300 break-all">{log.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};