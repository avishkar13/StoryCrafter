import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Eye, Trash2, X, Edit3, Search, CirclePlus, WandSparkles, Download
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import useContentStore from '../store/contentStore';

const Titles = () => {
  const {
    contents, fetchUserContent, createContent, deleteContent, loading,
  } = useContentStore();

  const navigate = useNavigate();
  const titles = contents.filter((c) => c.type === 'title');

  const [copiedId, setCopiedId] = useState(null);
  const [viewTitle, setViewTitle] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFabOptions, setShowFabOptions] = useState(false);

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
    if (!newPrompt || !newContent) {
      alert('Please provide both fields');
      return;
    }
    await createContent('title', { prompt: newPrompt, response: newContent });
    setNewPrompt('');
    setNewContent('');
    setShowCreateModal(false);
    setShowFabOptions(false); // Ensure FAB options close after creation
  };

  const exportToPDF = (title) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title.data?.prompt || 'Untitled Title', 10, 20);
    doc.setFontSize(12);
    doc.text(title.data?.response || '', 10, 30, { maxWidth: 180 });
    doc.save(`${(title.data?.prompt || 'title').slice(0, 20)}.pdf`); // Added slice for prompt, fallback
  };

  const filteredTitles = titles.filter((t) =>
    t.data?.prompt.toLowerCase().includes(search.toLowerCase()) ||
    t.data?.response.toLowerCase().includes(search.toLowerCase())
  );

  const visibleTitles = filteredTitles.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    if (loadingMore || visibleCount >= filteredTitles.length) return; // Prevent loading more if already at end
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setLoadingMore(false);
    }, 500);
  }, [loadingMore, visibleCount, filteredTitles.length]); // Added dependencies

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && visibleCount < filteredTitles.length) {
        loadMore();
      }
    }, { threshold: 1.0 }); // Consistent threshold

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [filteredTitles.length, loadMore, visibleCount]);

  // Unified Tooltip Style from Scripts page
  const tooltipStyle = {
    backgroundColor: '#1a1a40',
    color: '#f8fafc',
    border: '1px solid #3b82f6',
    fontSize: '12px',
    borderRadius: '4px',
    padding: '6px 8px',
  };

  // Unified FAB Button Variants from Scripts page
  const FABVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
  };

  // Unified Modal Backdrop and Content Variants from Scripts page
  const modalBackdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const modalContent = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 100 } },
    exit: { y: "100vh", opacity: 0 },
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 relative text-white"> {/* Adjusted padding and font size for consistency */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6 flex items-center" // Adjusted text color and added flex
        >
          ✨ Your Titles
        </motion.h2>

        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} /> {/* Consistent icon color */}
            <input
              type="text"
              placeholder="Search titles..."
              className="w-full pl-10 pr-4 py-2 bg-[#101024] border border-[#2b2b5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 placeholder-slate-500" // Aligned input styles
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(6);
              }}
            />
          </div>
        </div>

        <Tooltip id="titleActions" style={tooltipStyle} /> {/* Applied unified tooltip style */}

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(6).fill('').map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="h-40 bg-[#0f0f0f] animate-pulse rounded-2xl" // Consistent skeleton loader
              />
            ))}
          </div>
        ) : visibleTitles.length === 0 && !loading ? ( // Added !loading condition
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-500 mt-20"> {/* Aligned text color */}
            <p className="text-lg">No Titles found. Try creating or generating by clicking the add button.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {visibleTitles.map((title, idx) => (
              <motion.div
                key={title._id}
                initial={{ opacity: 0, y: 20 }} // Added initial y for staggered appearance
                whileInView={{ opacity: 1, y: 0 }} // Added whileInView for lazy loading effect
                viewport={{ once: true, amount: 0.3 }} // Viewport config
                whileHover={{ scale: 1.02 }}
                transition={{ delay: idx * 0.04 }} // Staggered transition
                className="bg-gradient-to-br from-[#0c0c2f] via-[#101024] to-[#0a0a1f] border border-[#2b2b5a] p-4 rounded-2xl shadow-xl flex flex-col justify-between" // Aligned card styling
              >
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-lg font-semibold text-indigo-300 truncate"> {/* Consistent text color */}
                    {title.data?.prompt || 'Untitled'}
                  </h3>
                  <p className="text-xs text-slate-500 mb-2"> {/* Consistent text color */}
                    {new Date(title.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-200 line-clamp-4 whitespace-pre-wrap overflow-hidden"> {/* Consistent text color and overflow */}
                    {title.data?.response}
                  </p>
                </div>

                <div className="flex justify-end gap-4 mt-4 text-slate-400"> {/* Consistent icon wrapper and color */}
                  <button
                    data-tooltip-id={`copy-${title._id}`}
                    data-tooltip-content={copiedId === title._id ? 'Copied!' : 'Copy'}
                    onClick={() => handleCopy(title.data?.response, title._id)}
                  >
                    <Copy size={18} className={copiedId === title._id ? 'text-blue-400' : ''} /> {/* Consistent icon color */}
                    <Tooltip id={`copy-${title._id}`} style={tooltipStyle} /> {/* Applied unified tooltip style */}
                  </button>

                  <button
                    data-tooltip-id={`view-${title._id}`}
                    data-tooltip-content="View"
                    onClick={() => setViewTitle(title)}
                  >
                    <Eye size={18} className="text-green-400" /> {/* Consistent icon color */}
                    <Tooltip id={`view-${title._id}`} style={tooltipStyle} /> {/* Applied unified tooltip style */}
                  </button>

                  <button
                    data-tooltip-id={`download-${title._id}`}
                    data-tooltip-content="Download"
                    onClick={() => exportToPDF(title)}
                  >
                    <Download size={18} className="text-purple-400" /> {/* Consistent icon color */}
                    <Tooltip id={`download-${title._id}`} style={tooltipStyle} /> {/* Applied unified tooltip style */}
                  </button>

                  <button
                    data-tooltip-id={`delete-${title._id}`}
                    data-tooltip-content="Delete"
                    onClick={() => setDeleteId(title._id)}
                  >
                    <Trash2 size={18} className="text-red-500" /> {/* Consistent icon color */}
                    <Tooltip id={`delete-${title._id}`} style={tooltipStyle} /> {/* Applied unified tooltip style */}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div ref={observerRef} className="h-10 mt-10 text-center">
          {loadingMore && <span className="text-slate-400">Loading more...</span>} {/* Consistent loading text color */}
        </div>

        {/* FAB Actions */}
        <div className="fixed bottom-6 right-6 flex flex-col items-end z-40">
          <AnimatePresence>
            {showFabOptions && (
              <>
                <motion.button
                  key="manual-create"
                  variants={FABVariants} // Applied unified FAB variants
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => {
                    setShowCreateModal(true);
                    setShowFabOptions(false);
                  }}
                  className="mb-3 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition" // Aligned FAB button styles
                  data-tooltip-id="manualCreateTitle"
                  data-tooltip-content="Create Manually"
                >
                  <Edit3 size={20} />
                </motion.button>
                <Tooltip id="manualCreateTitle" style={tooltipStyle} /> {/* Applied unified tooltip style */}

                <motion.button
                  key="generate-ai"
                  variants={FABVariants} // Applied unified FAB variants
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => {
                    navigate('/generate');
                    setShowFabOptions(false);
                  }}
                  className="mb-3 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition" // Aligned FAB button styles
                  data-tooltip-id="generateTitle"
                  data-tooltip-content="Generate with AI"
                >
                  <WandSparkles size={20} />
                </motion.button>
                <Tooltip id="generateTitle" style={tooltipStyle} /> {/* Applied unified tooltip style */}
              </>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowFabOptions(!showFabOptions)}
            className="bg-gradient-to-tr from-[#22c55e] via-[#0e7490] to-[#3b82f6] text-white p-4 rounded-full shadow-lg hover:bg-gradient-to-tl"
          
            data-tooltip-id="addTitle"
            data-tooltip-content="Add Title"
          >
            <CirclePlus size={22} />
          </button>
          <Tooltip id="addTitle" style={tooltipStyle} /> {/* Applied unified tooltip style */}
        </div>

        {/* View Modal (Aligned with Script's View Modal) */}
        <AnimatePresence>
          {viewTitle && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              variants={modalBackdrop} // Used consistent modal backdrop variant
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setViewTitle(null)}
            >
              <motion.div
                className="bg-[#101024] text-white rounded-2xl p-6 w-[90%] max-w-2xl shadow-lg flex flex-col" // Aligned modal content styling
                variants={modalContent} // Used consistent modal content variant
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: '70vh' }} // Consistent max height
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-700 mb-3 sticky top-0 bg-[#101024] z-10"> {/* Fixed header */}
                  <h2 className="text-lg font-bold text-indigo-300">{viewTitle.data?.prompt}</h2>
                  <button onClick={() => setViewTitle(null)}><X className="text-slate-200 hover:text-slate-400 transition" /></button> {/* Consistent close button */}
                </div>
                <div className="flex-grow overflow-y-auto"> {/* Scrollable content */}
                  <p className="whitespace-pre-wrap text-sm text-slate-200"> {/* Consistent text color */}
                    {viewTitle.data?.response}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Modal (Aligned with Script's Delete Modal) */}
        <AnimatePresence>
          {deleteId && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              variants={modalBackdrop} // Used consistent modal backdrop variant
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setDeleteId(null)}
            >
              <motion.div
                className="bg-[#101024] text-white p-6 rounded-2xl shadow-md w-[90%] max-w-md"
                variants={modalContent} 
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg text-red-500 font-semibold mb-3">Delete Title?</h2> 
                <p className="text-sm text-slate-200 mb-4">This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setDeleteId(null)} className="text-slate-400 hover:text-slate-200 transition">Cancel</button> 
                  <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">Delete</button> 
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Modal*/ }
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              variants={modalBackdrop} // Used consistent modal backdrop variant
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                className="bg-[#101024] text-white p-6 rounded-lg w-[90%] max-w-lg shadow-xl" // Aligned modal content styling
                variants={modalContent} // Used consistent modal content variant
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between mb-4 items-center">
                  <h3 className="text-xl font-semibold text-indigo-300">Create Title</h3> {/* Consistent text color */}
                  <button onClick={() => setShowCreateModal(false)}><X className="text-slate-200 hover:text-slate-400 transition" /></button> {/* Consistent close button */}
                </div>
                <input
                  type="text"
                  placeholder="Prompt"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full mb-3 p-3 bg-[#0f0f0f] border border-[#2b2b5a] rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <textarea
                  placeholder="Response"
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full mb-3 p-3 bg-[#0f0f0f] border border-[#2b2b5a] rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <button
                  onClick={handleManualCreate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full transition" 
                >
                  Save
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Titles;