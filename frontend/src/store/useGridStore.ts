import { create } from 'zustand';

export interface GridRow {
  id: string;
  cells: string[];
}

interface GridState {
  rows: GridRow[];
  columnsCount: number;
  activeCell: { rowIndex: number; colIndex: number } | null;
  editMode: boolean;
  
  // Actions
  initializeGrid: (rowCount: number, colCount: number) => void;
  updateCell: (rowIndex: number, colIndex: number, value: string) => void;
  addRow: () => void;
  setActiveCell: (rowIndex: number, colIndex: number) => void;
  setEditMode: (isEdit: boolean) => void;
  moveActiveCell: (rowDelta: number, colDelta: number) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useGridStore = create<GridState>((set, get) => ({
  rows: [],
  columnsCount: 0,
  activeCell: { rowIndex: 0, colIndex: 0 },
  editMode: false,

  initializeGrid: (rowCount, colCount) => {
    const newRows = Array.from({ length: rowCount }).map(() => ({
      id: generateId(),
      cells: Array(colCount).fill(''),
    }));
    set({ rows: newRows, columnsCount: colCount, activeCell: { rowIndex: 0, colIndex: 0 }, editMode: false });
  },

  updateCell: (rowIndex, colIndex, value) => {
    set((state) => {
      const newRows = [...state.rows];
      const newCells = [...newRows[rowIndex].cells];
      newCells[colIndex] = value;
      newRows[rowIndex] = { ...newRows[rowIndex], cells: newCells };
      return { rows: newRows };
    });
  },

  addRow: () => {
    set((state) => ({
      rows: [
        ...state.rows,
        { id: generateId(), cells: Array(state.columnsCount).fill('') },
      ],
      activeCell: { rowIndex: state.rows.length, colIndex: 0 },
    }));
  },

  setActiveCell: (rowIndex, colIndex) => {
    const state = get();
    if (
      rowIndex >= 0 &&
      rowIndex < state.rows.length &&
      colIndex >= 0 &&
      colIndex < state.columnsCount
    ) {
      set({ activeCell: { rowIndex, colIndex }, editMode: false });
    }
  },

  setEditMode: (isEdit) => {
    set({ editMode: isEdit });
  },

  moveActiveCell: (rowDelta, colDelta) => {
    const state = get();
    if (!state.activeCell) return;
    
    const newRow = state.activeCell.rowIndex + rowDelta;
    const newCol = state.activeCell.colIndex + colDelta;
    
    if (
      newRow >= 0 &&
      newRow < state.rows.length &&
      newCol >= 0 &&
      newCol < state.columnsCount
    ) {
      set({ activeCell: { rowIndex: newRow, colIndex: newCol }, editMode: false });
    }
  },
}));
