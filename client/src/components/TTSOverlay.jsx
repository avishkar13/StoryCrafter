// src/components/TTSOverlay.jsx
import { Mic, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useMVPStore from "../store/useMVPStore";
import { useEffect, useState } from "react";

const TTSOverlay = () => {
  const { clearAudio, isAudioPlaying, audioElement } = useMVPStore();
  const [elapsed, setElapsed] = useState(0);

  // 🕓 Timer Hook
  useEffect(() => {
    let interval;
    if (isAudioPlaying && audioElement) {
      interval = setInterval(() => {
        setElapsed(audioElement.currentTime);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isAudioPlaying, audioElement]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <AnimatePresence>
      {isAudioPlaying && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          {/* Exit Button */}
          <button
            onClick={() => {
              clearAudio();
              setElapsed(0);
            }}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/90 text-black hover:bg-white transition duration-200 shadow-md"
            aria-label="Stop audio"
          >
            <X size={22} />
          </button>

          {/* Mic & Effects */}
          <div className="relative flex flex-col items-center">
           <motion.div
              className="absolute w-44 h-44 rounded-full border-4 border-orange-500"
              animate={{
                scale: [1, 1.5],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />

            {/* 🎤 Mic */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="relative z-10 w-28 h-28 bg-gradient-to-tr from-orange-700 to-orange-900 rounded-full shadow-xl flex items-center justify-center"
            >
              <Mic size={42} className="text-white animate-pulse" />
            </motion.div>

            {/* 🕓 Timer */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white mt-4 text-base"
            >
              {formatTime(elapsed)} 
            </motion.p>

            {/* Caption */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white mt-2 text-sm tracking-wide"
            >
              Speaking...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TTSOverlay;
