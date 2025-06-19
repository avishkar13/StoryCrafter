import { Download, Loader2, X } from "lucide-react";
import useMVPStore from "../store/useMVPStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const ThumbnailViewer = ({ prompt, onClose }) => {
  const {
    generateImage,
    generatedImage,
    imageLoading,
    imageError,
    clearGeneratedImage,
  } = useMVPStore();

  useEffect(() => {
    if (prompt) generateImage(prompt);
  }, [prompt, generateImage]);

  const handleOpenInNewTab = () => {
    const imageUrl = generatedImage?.imageUrl;
    if (!imageUrl) return;

    window.open(imageUrl, "_blank");
  };

  const handleClose = () => {
    clearGeneratedImage();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-gradient-to-br from-[#0c0c2f] via-[#101024] to-[#0a0a1f] border border-[#2b2b5a] text-white rounded-xl shadow-2xl p-6 max-w-2xl w-full"
        >
          <button
            className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition"
            onClick={handleClose}
          >
            <X size={22} />
          </button>

          {/* Loading Spinner */}
          {imageLoading && (
            <div className="mt-6 flex justify-center">
              <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
          )}

          {/* Error Message */}
          {!imageLoading && imageError && !generatedImage && (
            <p className="text-red-500 mt-4 text-center">
              It might take a few minutes. Please wait...
            </p>
          )}

          {/* Display Generated Image */}
          {!imageLoading && generatedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <img
                src={generatedImage.imageUrl}
                alt="Generated Thumbnail"
                className="w-[320px] h-auto mx-auto rounded-lg shadow-lg border border-[#2b2b5a]"
              />
              <button
                onClick={handleOpenInNewTab}
                className="mt-5 flex items-center mx-auto gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 transition text-white font-medium rounded shadow hover:shadow-lg"
              >
                <Download size={18} />
                Download
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThumbnailViewer;
