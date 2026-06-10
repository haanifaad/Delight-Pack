'use client';

import React, { useRef, useState, useCallback, useMemo } from 'react';
import { GridCell } from './GridCell';
import { CommandBar } from './CommandBar';
import { useGridHotkeys } from '@/hooks/useGridHotkeys';

export type ColumnDef = {
  key: string;
  header: string;
  width?: string;
  isReadOnly?: boolean;
};

export type RowData = Record<string, string | number>;

interface DataGridProps {
  columns: ColumnDef[];
  initialData: RowData[];
  onSave: (data: RowData[]) => void;
}

export const DataGrid: React.FC<DataGridProps> = ({ columns, initialData, onSave }) => {
  const [data, setData] = useState<RowData[]>(initialData);
  
  // 2D Array of Refs for fast keyboard navigation
  // refs.current[rowIndex][colIndex]
  const refs = useRef<(HTMLInputElement | null)[][]>([]);

  // Initialize refs array based on data size
  useMemo(() => {
    refs.current = data.map((_, i) => 
      columns.map((_, j) => refs.current[i]?.[j] || null)
    );
  }, [data.length, columns.length]);

  const addRow = useCallback(() => {
    setData(prev => {
      const newRow = columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), {});
      return [...prev, newRow];
    });
  }, [columns]);

  const saveLedger = useCallback(() => {
    onSave(data);
  }, [data, onSave]);

  // Hook for global hotkeys
  useGridHotkeys([
    { key: 'c', altKey: true, action: addRow },
    { key: 's', altKey: true, action: saveLedger },
  ]);

  const handleCellChange = (rowIndex: number, colKey: string, newValue: string | number) => {
    setData(prev => {
      const newData = [...prev];
      newData[rowIndex] = { ...newData[rowIndex], [colKey]: newValue };
      return newData;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    // Tally-inspired navigation
    let nextRow = rowIndex;
    let nextCol = colIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'Enter':
        e.preventDefault();
        nextRow = Math.min(rowIndex + 1, data.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextRow = Math.max(rowIndex - 1, 0);
        break;
      case 'ArrowRight':
        if ((e.target as HTMLInputElement).selectionStart === (e.target as HTMLInputElement).value.length) {
          e.preventDefault();
          nextCol = Math.min(colIndex + 1, columns.length - 1);
        }
        break;
      case 'ArrowLeft':
        if ((e.target as HTMLInputElement).selectionEnd === 0) {
          e.preventDefault();
          nextCol = Math.max(colIndex - 1, 0);
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          nextCol = Math.max(colIndex - 1, 0);
        } else {
          nextCol = Math.min(colIndex + 1, columns.length - 1);
        }
        break;
      default:
        return; // Don't intercept other typing
    }

    // Focus next cell
    if (nextRow !== rowIndex || nextCol !== colIndex) {
      const nextRef = refs.current[nextRow]?.[nextCol];
      if (nextRef) {
        nextRef.focus();
        // optionally select text
        setTimeout(() => nextRef.select(), 0);
      }
    }
  };

  return (
    <div className="flex flex-col w-full bg-neutral-900 h-full border border-neutral-700 rounded-md overflow-hidden">
      <CommandBar onAddRow={addRow} onSave={saveLedger} />
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-800 text-neutral-400 text-xs uppercase sticky top-0 z-10 shadow-md">
            <tr>
              <th className="w-12 text-center p-2 border-b border-r border-neutral-700">#</th>
              {columns.map((col) => (
                <th key={col.key} className={`p-2 font-medium border-b border-neutral-700 ${col.width || 'w-32'}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-neutral-800/50 group">
                <td className="w-12 text-center text-xs text-neutral-500 border-b border-r border-neutral-700 bg-neutral-800 select-none">
                  {rowIndex + 1}
                </td>
                {columns.map((col, colIndex) => (
                  <GridCell
                    key={`${rowIndex}-${col.key}`}
                    ref={(el) => {
                      if (!refs.current[rowIndex]) refs.current[rowIndex] = [];
                      refs.current[rowIndex][colIndex] = el;
                    }}
                    value={row[col.key]}
                    width={col.width}
                    isReadOnly={col.isReadOnly}
                    onChange={(val) => handleCellChange(rowIndex, col.key, val)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
