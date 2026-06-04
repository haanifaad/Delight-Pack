/* eslint-disable */
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';

type CellData = string | number;
type RowData = CellData[];

interface TallyLedgerProps {
  initialData?: RowData[];
  rows?: number;
  cols?: number;
}

export default function TallyLedger({ 
  initialData = Array(100).fill(Array(5).fill('')),
  rows = 100,
  cols = 5 
}: TallyLedgerProps) {
  // We use local state for the active cell to prevent full re-renders
  const [activeCell, setActiveCell] = useState<{row: number, col: number} | null>({ row: 0, col: 0 });
  const [editValue, setEditValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Ref to hold the actual grid data without triggering re-renders on every keystroke
  const gridData = useRef<RowData[]>(initialData.map(row => [...row]));
  const gridRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!activeCell) return;
    
    const { row, col } = activeCell;

    if (isEditing) {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Save and move down
        gridData.current[row][col] = editValue;
        setIsEditing(false);
        if (row < rows - 1) setActiveCell({ row: row + 1, col });
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsEditing(false);
        setEditValue(String(gridData.current[row][col]));
      } else if (e.key === 'Tab') {
        e.preventDefault();
        gridData.current[row][col] = editValue;
        setIsEditing(false);
        if (col < cols - 1) setActiveCell({ row, col: col + 1 });
        else if (row < rows - 1) setActiveCell({ row: row + 1, col: 0 });
      }
      return;
    }

    // Navigation when not editing
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (row > 0) setActiveCell({ row: row - 1, col });
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (row < rows - 1) setActiveCell({ row: row + 1, col });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (col > 0) setActiveCell({ row, col: col - 1 });
        break;
      case 'ArrowRight':
      case 'Tab':
        e.preventDefault();
        if (col < cols - 1) setActiveCell({ row, col: col + 1 });
        else if (row < rows - 1) setActiveCell({ row: row + 1, col: 0 });
        break;
      case 'Enter':
        e.preventDefault();
        setIsEditing(true);
        setEditValue(String(gridData.current[row][col]));
        break;
      case 'Backspace':
      case 'Delete':
        gridData.current[row][col] = '';
        setEditValue('');
        // force update hack if needed, but visually we can handle it
        setActiveCell({ ...activeCell }); // simple re-render trigger for active cell
        break;
      default:
        // Start typing immediately
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          setIsEditing(true);
          setEditValue(e.key);
        }
        break;
    }
  }, [activeCell, isEditing, editValue, rows, cols]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderCell = (rIndex: number, cIndex: number) => {
    const isActive = activeCell?.row === rIndex && activeCell?.col === cIndex;
    
    return (
      <div 
        key={`${rIndex}-${cIndex}`}
        className={`border-b border-r border-charcoal-light p-2 min-h-[40px] flex items-center bg-charcoal dark:bg-charcoal-dark text-text-main transition-colors ${
          isActive && !isEditing ? 'border-2 border-primary bg-charcoal-light/50 outline-none ring-2 ring-primary inset-0 z-10 relative' : ''
        } ${isActive && isEditing ? 'border-2 border-secondary z-10 relative' : ''}`}
        onClick={() => {
          if (isActive && !isEditing) {
            setIsEditing(true);
            setEditValue(String(gridData.current[rIndex][cIndex]));
          } else if (!isActive) {
            setIsEditing(false);
            setActiveCell({ row: rIndex, col: cIndex });
          }
        }}
      >
        {isActive && isEditing ? (
          <input 
            autoFocus
            className="w-full h-full bg-transparent outline-none text-text-main"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        ) : (
          <span>{isActive ? (isEditing ? editValue : gridData.current[rIndex][cIndex]) : gridData.current[rIndex][cIndex]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 bg-charcoal-dark border-4 border-charcoal-light rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-charcoal p-4 border-b-4 border-charcoal-light flex justify-between items-center">
        <h2 className="text-xl font-black uppercase tracking-wider text-primary">Tally Ledger Core</h2>
        <span className="text-text-muted text-sm font-medium">Use Arrow Keys, Enter, and Tab to navigate</span>
      </div>
      
      <div 
        ref={gridRef}
        className="overflow-auto max-h-[600px] relative select-none"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(150px, 1fr))` }}
      >
        {Array.from({ length: rows }).map((_, rIndex) => (
          Array.from({ length: cols }).map((_, cIndex) => renderCell(rIndex, cIndex))
        ))}
      </div>
    </div>
  );
}
