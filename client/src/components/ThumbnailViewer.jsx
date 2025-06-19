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
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full"
                >
                    <button
                        className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                        onClick={handleClose}
                    >
                        <X size={22} />
                    </button>

                    {/* Show spinner while loading */}
                    {imageLoading && (
                        <div className="mt-6 flex justify-center">
                            <Loader2 className="animate-spin text-orange-600" size={32} />
                        </div>
                    )}

                    {/* Show error only if image is not present */}
                    {!imageLoading && imageError && !generatedImage && (
                        <p className="text-red-500 mt-4 text-center">It might take few minutes....</p>
                    )}


                    {/* Show image once generated */}
                    {!imageLoading && generatedImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 text-center"
                        >
                            <img
                                src={generatedImage.imageUrl}
                                alt="Generated Thumbnail"
                                className="w-[320px] h-auto mx-auto rounded shadow-lg border"
                            />
                            <button
                                onClick={handleOpenInNewTab}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mx-auto"
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
