import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Eye, Trash2, X, Plus, Download, Search, Image, Edit3, // Added Edit3
  CirclePlus
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import useContentStore from '../store/contentStore';
import ThumbnailViewer from "../components/ThumbnailViewer";

const Thumbnails = () => {
  const {
    contents, fetchUserContent, createContent, deleteContent, loading,
  } = useContentStore();

  const navigate = useNavigate(); // Initialize useNavigate

  const thumbnails = contents.filter((c) => c.type === 'thumbnailPrompt');

  const [copiedId, setCopiedId] = useState(null);
  const [viewThumbnail, setViewThumbnail] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFabOptions, setShowFabOptions] = useState(false);
  const [showThumbnailViewer, setShowThumbnailViewer] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");


  const observerRef = useRef(null);

  useEffect(() => {
    fetchUserContent();
  }, [fetchUserContent]);

  const handleCopy = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    await deleteContent(deleteId);
    setDeleteId(null);
  };

  const handleManualCreate = async () => {
    if (!newPrompt || !newContent) return alert('Please provide both fields');
    await createContent('thumbnail', { prompt: newPrompt, response: newContent });
    setNewPrompt('');
    setNewContent('');
    setShowCreateModal(false);
    setShowFabOptions(false); // Close FAB options after creating
  };

  const exportToPDF = (thumbnail) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(thumbnail.data?.prompt || 'Untitled Thumbnail', 10, 20);
    doc.setFontSize(12);
    doc.text(thumbnail.data?.response || '', 10, 30, { maxWidth: 180 });
    doc.save(`${thumbnail.data?.prompt.slice(0, 20)}.pdf`);
  };

  const filteredThumbnails = thumbnails.filter((t) =>
    t.data?.prompt.toLowerCase().includes(search.toLowerCase()) ||
    t.data?.response.toLowerCase().includes(search.toLowerCase())
  );

  const visibleThumbnails = filteredThumbnails.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setLoadingMore(false);
    }, 500);
  }, [loadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && visibleCount < filteredThumbnails.length) {
        loadMore();
      }
    });

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [filteredThumbnails.length, loadMore, visibleCount]);

  // Modal animation variants
  const modalVariant = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 100 } },
    exit: { y: "100vh", opacity: 0 }
  };

  const backdropVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // FAB button variants
  const fabButtonVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
  };

  const handleGenerateThumbnail = (prompt) => {
    setSelectedPrompt(prompt);
    setShowThumbnailViewer(true);
  };


  return (
    <div className="max-w-6xl mx-auto px-0 md:px-6 py-4 md:py-10 relative">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text3xl font-bold text-blue-700 mb-6"
      >
        🖼️ Your Thumbnails
      </motion.h2>

      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search thumbnails..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(6);
            }}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <Tooltip id="thumbnailActions" style={{ backgroundColor: '#1e3a8a', color: 'white', borderRadius: '5px', padding: '4px 8px', fontSize: '12px' }} />

      {loading ? (
        <p className="text-center text-gray-500">Loading thumbnails...</p>
      ) : visibleThumbnails.length === 0 ? (
        <motion.div animate={{ opacity: 1 }} className="text-center text-gray-600 space-y-5 mt-20">
          <p className="text-lg">No Thumbnails found. Try Creating/Generating by clicking the add button.</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {visibleThumbnails.map((thumbnail) => (
            <motion.div
              key={thumbnail._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition h-[100%] flex flex-col justify-between overflow-hidden"
            >
              <div className="flex-1 overflow-hidden">
                <h3 className="text-lg font-semibold text-blue-900 line-clamp-1">
                  {thumbnail.data?.prompt || 'Untitled'}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(thumbnail.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm line-clamp-4 whitespace-pre-wrap overflow-hidden">
                  {thumbnail.data?.response}
                </p>
              </div>

              <div className="flex justify-end gap-4 mt-4 text-gray-500">
                <button
                  data-tooltip-id={`copy-${thumbnail._id}`}
                  data-tooltip-content={copiedId === thumbnail._id ? 'Copied!' : 'Copy'}
                  onClick={() => handleCopy(thumbnail.data?.response, thumbnail._id)}
                >
                  <Copy size={18} className={`${copiedId === thumbnail._id ? 'text-blue-600' : ''}`} />
                  <Tooltip id={`copy-${thumbnail._id}`} />
                </button>

                <button
                  data-tooltip-id={`view-${thumbnail._id}`}
                  data-tooltip-content="View"
                  onClick={() => setViewThumbnail(thumbnail)}
                >
                  <Eye size={18} className="text-green-600" />
                  <Tooltip id={`view-${thumbnail._id}`} />
                </button>

                <button
                  data-tooltip-id={`download-${thumbnail._id}`}
                  data-tooltip-content="Download"
                  onClick={() => exportToPDF(thumbnail)}
                >
                  <Download size={18} className="text-purple-600" />
                  <Tooltip id={`download-${thumbnail._id}`} />
                </button>

                <button
                  data-tooltip-id={`delete-${thumbnail._id}`}
                  data-tooltip-content="Delete"
                  onClick={() => setDeleteId(thumbnail._id)}
                >
                  <Trash2 size={18} className="text-red-600" />
                  <Tooltip id={`delete-${thumbnail._id}`} />
                </button>
              </div>

              <button
                onClick={() => handleGenerateThumbnail(thumbnail.data?.prompt)}
                className="mt-4 w-full px-3 py-2 bg-gradient-to-tl from-[#162339] via-[#2f31c9] to-[#49497c] text-gray-300 rounded hover:bg-gradient-to-tr text-sm font-semibold"
              >
                Generate Thumbnail Image
              </button>
            </motion.div>
          ))}

        </div>
      )}

      <div ref={observerRef} className="h-10 mt-10 text-center">
        {loadingMore && <span className="text-gray-400">Loading more...</span>}
      </div>

      {/* Create Thumbnail Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-xl"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-700">Create Thumbnail</h3>
                <button onClick={() => setShowCreateModal(false)}><X /></button>
              </div>
              <input
                type="text"
                placeholder="Prompt"
                className="w-full border p-2 mb-3 rounded-md"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
              />
              <textarea
                placeholder="Response"
                className="w-full border p-2 mb-3 rounded-md"
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <button onClick={handleManualCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex mx-auto">
                Save
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Thumbnail Modal */}
      <AnimatePresence>
        {viewThumbnail && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setViewThumbnail(null)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-[90%] max-w-2xl shadow-lg overflow-y-auto max-h-[80vh]"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-3 ">
                <h2 className="text-lg text-blue-900 font-bold">{viewThumbnail.data?.prompt}</h2>
                <button onClick={() => setViewThumbnail(null)}><X /></button>
              </div>
              <div className="mb-4 h-auto max-h-[60vh] overflow-auto">
                <p className="whitespace-pre-wrap text-sm text-gray-800">{viewThumbnail.data?.response}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-red-600 mb-3">Delete Thumbnail?</h2>
              <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setDeleteId(null)} className="text-gray-500">Cancel</button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated FAB and its options */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end z-40">
        <AnimatePresence>
          {showFabOptions && (
            <>
              <motion.button
                key="manual-create-button"
                variants={fabButtonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => {
                  setShowCreateModal(true);
                  setShowFabOptions(false);
                }}
                className="mb-3 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 flex items-center justify-center"
                data-tooltip-id="manualCreateThumbnail"
                data-tooltip-content="Create Manually"
              >
                <Edit3 size={20} />
              </motion.button>
              <Tooltip id="manualCreateThumbnail" />

              <motion.button
                key="generate-button"
                variants={fabButtonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => {
                  navigate('/generate'); // Adjust the path if needed for Thumbnail generation
                  setShowFabOptions(false);
                }}
                className="mb-3 p-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 flex items-center justify-center"
                data-tooltip-id="generateThumbnail"
                data-tooltip-content="Generate with AI"
              >
                <Plus size={20} />
              </motion.button>
              <Tooltip id="generateThumbnail" />
            </>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowFabOptions(!showFabOptions)}
          data-tooltip-id="addThumbnail"
          data-tooltip-content="Add Thumbnail"
          className="bg-blue-800 text-white p-4 rounded-full shadow-lg hover:bg-blue-900"
        >
          <CirclePlus size={22} />
        </button>
        <Tooltip id="addThumbnail" />
      </div>
      <AnimatePresence>
        {showThumbnailViewer && (
          <ThumbnailViewer
            prompt={selectedPrompt}
            onClose={() => setShowThumbnailViewer(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Thumbnails;