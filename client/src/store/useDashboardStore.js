// src/store/useDashboardStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid'; // For unique IDs

const useDashboardStore = create(
  persist(
    (set) => ({
      ideaNotes: [
        { id: nanoid(), text: 'Try combining storytelling + AI tools' }
      ],

      addNote: (text) =>
        set((state) => ({
          ideaNotes: [...state.ideaNotes, { id: nanoid(), text }],
        })),

      deleteNote: (id) =>
        set((state) => ({
          ideaNotes: state.ideaNotes.filter((note) => note.id !== id),
        })),

      reorderNotes: (fromId, toId) =>
        set((state) => {
          const current = [...state.ideaNotes];
          const fromIndex = current.findIndex((n) => n.id === fromId);
          const toIndex = current.findIndex((n) => n.id === toId);

          if (fromIndex === -1 || toIndex === -1) return { ideaNotes: current };

          const updated = [...current];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);

          return { ideaNotes: updated };
        }),
    }),
    {
      name: 'dashboard-storage',
    }
  )
);

export default useDashboardStore;
