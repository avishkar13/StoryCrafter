// store/contentStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../api/axiosInstance';

const useContentStore = create(
  persist(
    (set) => ({
      contents: [],
      loading: false,
      error: null,

      // ✅ Properly defined methods
      fetchUserContent: async () => {
        try {
          set({ loading: true, error: null });
          const res = await axios.get('/content');
          set({ contents: res.data, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to fetch content',
            loading: false,
          });
        }
      },

      createContent: async (type, data) => {
        try {
          set({ loading: true, error: null });
          const res = await axios.post('/content', { type, data });
          set((state) => ({
            contents: [res.data, ...state.contents],
            loading: false,
          }));
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to create content',
            loading: false,
          });
          return null;
        }
      },

      generateContent: async (prompt, type) => {
        try {
          set({ loading: true, error: null });
          const res = await axios.post('/content/generate', { prompt, type });
          set((state) => ({
            contents: [res.data, ...state.contents],
            loading: false,
          }));
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || 'AI generation failed',
            loading: false,
          });
          return null;
        }
      },

      saveContent: async (type, prompt, response) => {
        try {
          const res = await axios.post('/content/save', {
            type,
            data: { prompt, response },
          });
          return res.data;
        } catch (err) {
          console.error('Save failed:', err.response?.data || err.message);
          return null;
        }
      },

      deleteContent: async (id) => {
        try {
          set({ loading: true, error: null });
          await axios.delete(`/content/${id}`);
          set((state) => ({
            contents: state.contents.filter((c) => c._id !== id),
            loading: false,
          }));
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to delete content',
            loading: false,
          });
        }
      },

      // ✅ Add the reset method here
      reset: () => set({ contents: [], error: null, loading: false }),
    }),
    {
      name: 'content-storage',
      partialize: (state) => ({ contents: state.contents }),
    }
  )
);

export default useContentStore;
