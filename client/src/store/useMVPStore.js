import { create } from 'zustand';
import axios from '../api/axiosInstance';

const useMVPStore = create((set, get) => ({
  // ====== TEXT TO SPEECH ======
  audioUrl: null,
  audioInstance: null,
  ttsLoading: false,
  ttsError: null,
  audioElement: null,
  isAudioPlaying: false,

  generateAudio: async (text) => {
    set({ ttsLoading: true, ttsError: null });
    try {
      const res = await axios.post('/tts', { text }, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const audio = new Audio(url);

      audio.play().catch((e) => console.error('Audio Playback Error:', e));

      set({
        audioUrl: url,
        audioElement: audio,
        isAudioPlaying: true,
        ttsLoading: false,
      });

      audio.onended = () => set({ isAudioPlaying: false });
    } catch (err) {
      console.error('TTS Error:', err);
      set({ ttsError: 'TTS failed', ttsLoading: false });
    }
  },

  clearAudio: () => {
    const audio = get().audioElement;
    if (audio) audio.pause();
    set({ audioUrl: null, isAudioPlaying: false, audioElement: null });
  },

  // ====== IMAGE GENERATION ======
  generatedImage: null, // { prompt, imageUrl }
  imageLoading: false,
  imageError: null,


generateImage: async (prompt) => {
  set({
    imageLoading: true, 
    imageError: null,
    generatedImage: null, 
  });

  try {
    const detailedPrompt = `An AI-generated high-resolution YouTube thumbnail image for a video about: "${prompt}". 
Do not include any logos, watermarks, text, timestamps, UI elements, or channel branding. 
The thumbnail should be visually engaging, cinematic, and click-worthy, centered on the topic above. 
Use dramatic lighting and color contrast. Keep background detailed but not distracting.`;


    const res = await axios.post("/thumbnail", {
      prompt: detailedPrompt, 
    });

    const imageUrl = res.data.imageUrl;

    set({
      generatedImage: { prompt: detailedPrompt, imageUrl },
      imageLoading: false,
    });
  } catch (error) {
    console.error("Image gen failed:", error?.response?.data || error.message);
    set({ imageError: "Image generation failed", imageLoading: false });
  }
},



  clearGeneratedImage: () => {
    set({ generatedImage: null });
  },


  // ====== SHORTS/REEL GENERATION (Future Placeholder) ======
  reelUrl: null,
  reelLoading: false,
  reelError: null,

  //   generateReel: async (script) => {
  //     console.warn('Reel generation not yet implemented.');
  //   },
}));

export default useMVPStore;
