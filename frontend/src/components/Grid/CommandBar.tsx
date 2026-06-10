import React from 'react';

interface CommandBarProps {
  onAddRow: () => void;
  onSave: () => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({ onAddRow, onSave }) => {
  return (
    <div className="flex items-center space-x-4 bg-neutral-800 p-3 border-b border-neutral-700">
      <div className="text-amber-500 font-bold text-lg mr-4">Grid Command</div>
      
      <button 
        onClick={onAddRow}
        className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-sm text-white rounded flex items-center gap-2 transition-colors"
      >
        <span>Add Row</span>
        <kbd className="bg-neutral-900 px-1.5 py-0.5 rounded text-neutral-400 text-xs font-mono">Alt + C</kbd>
      </button>

      <button 
        onClick={onSave}
        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-sm text-black font-medium rounded flex items-center gap-2 transition-colors"
      >
        <span>Save Ledger</span>
        <kbd className="bg-amber-800 px-1.5 py-0.5 rounded text-amber-200 text-xs font-mono">Alt + S</kbd>
      </button>
      
      <div className="flex-1" />
      
      <div className="text-xs text-neutral-500 hidden sm:flex space-x-3">
        <span><kbd className="font-mono text-neutral-400">↑↓←→</kbd> Navigate</span>
        <span><kbd className="font-mono text-neutral-400">Enter</kbd> Commit</span>
        <span><kbd className="font-mono text-neutral-400">Esc</kbd> Cancel</span>
      </div>
    </div>
  );
};
