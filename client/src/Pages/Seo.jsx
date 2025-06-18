import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Eye, Trash2, X, Plus, Download, Search, Edit3, // Added Edit3
  CirclePlus
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import useContentStore from '../store/contentStore';

const Seo = () => {
  const {
    contents, fetchUserContent, createContent, deleteContent, loading,
  } = useContentStore();

  const navigate = useNavigate(); // Initialize useNavigate

  const seoContents = contents.filter((c) => c.type === 'seo');

  const [copiedId, setCopiedId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFabOptions, setShowFabOptions] = useState(false); // New state for FAB options

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
    await createContent('seo', { prompt: newPrompt, response: newContent });
    setNewPrompt('');
    setNewContent('');
    setShowCreateModal(false);
    setShowFabOptions(false); // Close FAB options after creating
  };

  const exportToPDF = (item) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(item.data?.prompt || 'Untitled Prompt', 10, 20);
    doc.setFontSize(12);
    doc.text(item.data?.response || '', 10, 30, { maxWidth: 180 });
    doc.save(`${item.data?.prompt.slice(0, 20)}.pdf`);
  };

  const filteredSeoContents = seoContents.filter((s) =>
    s.data?.prompt.toLowerCase().includes(search.toLowerCase()) ||
    s.data?.response.toLowerCase().includes(search.toLowerCase())
  );

  const visibleSeoContents = filteredSeoContents.slice(0, visibleCount);

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
      if (target.isIntersecting && visibleCount < filteredSeoContents.length) {
        loadMore();
      }
    });

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [filteredSeoContents.length, loadMore, visibleCount]);

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

  return (
    <div className="max-w-6xl mx-auto px-0 md:px-6 py-4 md:py-10 relative">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text3xl font-bold text-blue-700 mb-6"
      >
        🔍 Your SEO Content
      </motion.h2>

      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search SEO content..."
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

      <Tooltip id="seoActions" style={{ backgroundColor: '#1e3a8a', color: 'white', borderRadius: '5px', padding: '4px 8px', fontSize: '12px' }} />

      {loading ? (
        <p className="text-center text-gray-500">Loading SEO content...</p>
      ) : visibleSeoContents.length === 0 ? (
        <motion.div animate={{ opacity: 1 }} className="text-center text-gray-600 space-y-5 mt-20">
          <p className="text-lg">No SEO content found. Try Creating/Generating by clicking the add button</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {visibleSeoContents.map((seo) => (
            <motion.div
              key={seo._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition h-full flex flex-col justify-between overflow-hidden"
            >
              <div className="flex-1 overflow-hidden">
                <h3 className="text-lg font-semibold text-blue-900 line-clamp-1">
                  {seo.data?.prompt || 'Untitled'}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(seo.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm line-clamp-4 whitespace-pre-wrap overflow-hidden">
                  {seo.data?.response}
                </p>
              </div>

              <div className="flex justify-end gap-4 mt-4 text-gray-500">
                <button
                  data-tooltip-id={`copy-${seo._id}`}
                  data-tooltip-content={copiedId === seo._id ? 'Copied!' : 'Copy'}
                  onClick={() => handleCopy(seo.data?.response, seo._id)}
                >
                  <Copy size={18} className={`${copiedId === seo._id ? 'text-blue-600' : ''}`} />
                  <Tooltip id={`copy-${seo._id}`} />
                </button>

                <button
                  data-tooltip-id={`view-${seo._id}`}
                  data-tooltip-content="View"
                  onClick={() => setViewItem(seo)}
                >
                  <Eye size={18} className="text-green-600" />
                  <Tooltip id={`view-${seo._id}`} />
                </button>

                <button
                  data-tooltip-id={`download-${seo._id}`}
                  data-tooltip-content="Download"
                  onClick={() => exportToPDF(seo)}
                >
                  <Download size={18} className="text-purple-600" />
                  <Tooltip id={`download-${seo._id}`} />
                </button>

                <button
                  data-tooltip-id={`delete-${seo._id}`}
                  data-tooltip-content="Delete"
                  onClick={() => setDeleteId(seo._id)}
                >
                  <Trash2 size={18} className="text-red-600" />
                  <Tooltip id={`delete-${seo._id}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div ref={observerRef} className="h-10 mt-10 text-center">
        {loadingMore && <span className="text-gray-400">Loading more...</span>}
      </div>

      {/* Create SEO Modal */}
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
                <h3 className="text-xl font-semibold text-blue-700">Create SEO Content</h3>
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

      {/* View SEO Modal */}
      <AnimatePresence>
        {viewItem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setViewItem(null)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-[90%] max-w-2xl shadow-lg overflow-y-auto max-h-[80vh]"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-3">
                <h2 className="text-lg text-blue-900 font-bold">{viewItem.data?.prompt}</h2>
                <button onClick={() => setViewItem(null)}><X /></button>
              </div>
              <div className="mb-4 h-auto max-h-[60vh] overflow-auto">
                <p className="whitespace-pre-wrap text-sm text-gray-800">{viewItem.data?.response}</p>
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
              <h2 className="text-lg font-semibold text-red-600 mb-3">Delete SEO Content?</h2>
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
                data-tooltip-id="manualCreateSeo"
                data-tooltip-content="Create Manually"
              >
                <Edit3 size={20} />
              </motion.button>
              <Tooltip id="manualCreateSeo" />

              <motion.button
                key="generate-button"
                variants={fabButtonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => {
                  navigate('/generate'); // Adjust the path if needed for SEO generation
                  setShowFabOptions(false);
                }}
                className="mb-3 p-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 flex items-center justify-center"
                data-tooltip-id="generateSeo"
                data-tooltip-content="Generate with AI"
              >
                <Plus size={20} />
              </motion.button>
              <Tooltip id="generateSeo" />
            </>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowFabOptions(!showFabOptions)}
          data-tooltip-id="addSeo"
          data-tooltip-content="Add SEO Content"
          className="bg-blue-800 text-white p-4 rounded-full shadow-lg hover:bg-blue-900"
        >
          <CirclePlus size={22} />
        </button>
        <Tooltip id="addSeo" />
      </div>
    </div>
  );
};

export default Seo;