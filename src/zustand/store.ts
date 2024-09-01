import { create } from 'zustand';

export interface Column {
  name: string;
  value: string;
}

export interface AdvancedOptions {
  savePDF: boolean;
  mergePDFs: boolean;
}

interface ConfigState {
  columns: Column[];
  options: AdvancedOptions;
  setColumns: (columns: Column[]) => void;
  setOptions: (options: AdvancedOptions) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  columns: [],
  options: {
    savePDF: false,
    mergePDFs: false,
  },
  setColumns: (columns) => set((state) => ({ ...state, columns: columns})),
  setOptions: (options) => set((state) => ({ ...state, options: options})),
}));