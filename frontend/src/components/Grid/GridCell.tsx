import React, { forwardRef, useState, useEffect } from 'react';
import { evaluateMathString } from '@/lib/mathParser';

interface GridCellProps {
  value: string | number;
  onChange: (newValue: string | number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  width?: string;
  isReadOnly?: boolean;
}

export const GridCell = forwardRef<HTMLInputElement, GridCellProps>(
  ({ value, onChange, onKeyDown, width = 'w-32', isReadOnly = false }, ref) => {
    const [localValue, setLocalValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);

    // Sync external value when not editing
    useEffect(() => {
      if (!isEditing) {
        setLocalValue(value);
      }
    }, [value, isEditing]);

    const handleBlur = () => {
      setIsEditing(false);
      // Evaluate math before saving
      const evaluated = evaluateMathString(localValue);
      setLocalValue(evaluated);
      if (evaluated !== value) {
        onChange(evaluated);
      }
    };

    const handleFocus = () => {
      if (!isReadOnly) {
        setIsEditing(true);
      }
    };

    return (
      <td className={`border border-neutral-700 bg-neutral-800 p-0 m-0 ${width}`}>
        <input
          ref={ref}
          type="text"
          value={localValue}
          readOnly={isReadOnly}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setLocalValue(value); // revert
              setIsEditing(false);
              ref && typeof ref !== 'function' && ref.current?.blur();
            } else if (e.key === 'Enter') {
              handleBlur(); // Commit value
              onKeyDown(e); // Let parent handle navigation
            } else {
              onKeyDown(e);
            }
          }}
          className={`w-full h-full px-2 py-1.5 bg-transparent text-white outline-none 
            ${isReadOnly ? 'text-neutral-500 cursor-not-allowed' : 'focus:bg-neutral-700 focus:ring-1 focus:ring-amber-500'}
            transition-colors duration-75`}
        />
      </td>
    );
  }
);

GridCell.displayName = 'GridCell';
