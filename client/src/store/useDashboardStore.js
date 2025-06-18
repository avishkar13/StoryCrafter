import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDashboardStore = create(
  persist(
    (set) => ({
      ideaNotes: ['Try combining storytelling + AI tools'], // initial dummy note

      addNote: (note) => 
        set((state) => ({
          ideaNotes: [...state.ideaNotes, note],
        })),

      deleteNote: (index) =>
        set((state) => ({
          ideaNotes: state.ideaNotes.filter((_, i) => i !== index),
        })),

      reorderNotes: (startIndex, endIndex) =>
        set((state) => {
          const updated = Array.from(state.ideaNotes);
          const [moved] = updated.splice(startIndex, 1);
          updated.splice(endIndex, 0, moved);
          return { ideaNotes: updated };
        }),
    }),
    {
      name: 'dashboard-storage', // key for localStorage
    }
  )
);

export default useDashboardStore;
