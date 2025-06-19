// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../api/axiosInstance';
import useContentStore from './contentStore';
// import useDashboardStore from './useDashboardStore';  

const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      token: null,
      loading: false,
      error: null,

      // LOGIN
      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const res = await axios.post('/auth/login', { email, password });
          set({
            authUser: res.data.user,
            token: res.data.token,
            loading: false,
          });
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Login failed',
            loading: false,
          });
        }
      },

      // SIGNUP - just sends OTP
      signup: async (email) => {
        try {
          set({ loading: true, error: null });
          const res = await axios.post('/auth/send-otp', { email });
          set({
            authUser: res.data.user,
            token: res.data.token,
            loading: false,
          });
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Signup failed',
            loading: false,
          });
        }
      },

      // VERIFY OTP - finalizes registration
      verifyOtp: async ({ email, otp }) => {
        try {
          set({ loading: true, error: null });
          const res = await axios.post('/auth/verify-otp', { email, otp });
          set({
            authUser: res.data.user,
            token: res.data.token,
            loading: false,
          });
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || 'OTP verification failed',
            loading: false,
          });
        }
      },

      // COMPLETE SIGNUP - name + password after OTP
      completeSignup: async ({ email, name, password }) => {
        try {
          set({ loading: true, error: null });
          const res = await axios.post('/auth/complete-signup', { email, name, password });
          set({
            authUser: res.data.user,
            token: res.data.token,
            loading: false,
          });
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Final signup failed',
            loading: false,
          });
        }
      },

      // CHECK AUTH - keep user logged in
      checkAuth: async () => {
        try {
          const res = await axios.get('/auth/check');
          set({ authUser: res.data.user });
          return res.data.user;
        } catch (err) {
          set({ authUser: null, token: null });
          console.error('Auth check failed:', err.response?.data?.message || err.message);
        }
      },

      setGoogleAuth: (token, user) => {
        set({ authUser: user, token });
      },

      // LOGOUT
  logout: async () => {
  try {
    await axios.post('/auth/logout');
    set({ authUser: null, token: null });
    // localStorage.clear();
    useContentStore.getState().reset();
    // useDashboardStore.getState().reset?.(); 
    window.location.href = '/'; // or use navigate
  } catch (err) {
    console.error('Logout failed', err);
  }
},

     // UPDATE PASSWORD
updatePassword: async (currentPassword, newPassword) => {
  try {
    set({ loading: true, error: null });
    await axios.put('/auth/updatePassword', { currentPassword, newPassword });
    set({ loading: false });
  } catch (err) {
    set({
      error: err.response?.data?.message || 'Password update failed',
      loading: false,
    });
  }
},


      // DELETE ACCOUNT
      deleteAccount: async () => {
        try {
          set({ loading: true, error: null });
          await axios.delete('/auth/delete');
          set({ authUser: null, token: null, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Account deletion failed',
            loading: false,
          });
        }
      },

      // UPDATE USER LOCALLY
      updateAuthUser: (newUserData) => {
        set((state) => ({
          authUser: { ...state.authUser, ...newUserData }
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        authUser: state.authUser,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;
