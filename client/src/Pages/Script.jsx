import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Eye, Trash2, X, Plus, Download, Search,
  Edit3, CirclePlus, Volume2,
  WandSparkles
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import useContentStore from '../store/contentStore';
import useMVPStore from '../store/useMVPStore';
import TTSOverlay from '../components/TTSOverlay';

const Scripts = () => {
  const {
    contents, fetchUserContent,
    createContent, deleteContent, loading,
  } = useContentStore();

  const {
    audioUrl, generateAudio, clearAudio
  } = useMVPStore();

  const navigate = useNavigate();
  const scripts = contents.filter((c) => c.type === 'script');

  const [copiedId, setCopiedId] = useState(null);
  const [viewScript, setViewScript] = useState(null);
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
    if (!newPrompt || !newContent) return alert('Please provide both fields');
    await createContent('script', { prompt: newPrompt, response: newContent });
    setNewPrompt('');
    setNewContent('');
    setShowCreateModal(false);
    setShowFabOptions(false);
  };

  const exportToPDF = (script) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(script.data?.prompt || 'Untitled Script', 10, 20);
    doc.setFontSize(12);
    doc.text(script.data?.response || '', 10, 30, { maxWidth: 180 });
    doc.save(`${script.data?.prompt.slice(0, 20)}.pdf`);
  };

  const filteredScripts = scripts.filter((s) =>
    s.data?.prompt.toLowerCase().includes(search.toLowerCase()) ||
    s.data?.response.toLowerCase().includes(search.toLowerCase()),
  );
  const visibleScripts = filteredScripts.slice(0, visibleCount);

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
      if (entries[0].isIntersecting && visibleCount < filteredScripts.length) {
        loadMore();
      }
    });
    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [filteredScripts.length, loadMore, visibleCount]);

  const tooltipStyle = {
    backgroundColor: '#1a1a40',
    color: '#f8fafc',
    border: '1px solid #3b82f6',
    fontSize: '12px',
    borderRadius: '4px',
    padding: '6px 8px',
  };

  const FABVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
  };

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
      <TTSOverlay />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 relative text-white">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6 flex items-center"
        >
          📝 Your Scripts
        </motion.h2>

        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search scripts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(6);
              }}
              className="w-full pl-10 pr-4 py-2 bg-[#101024] border border-[#2b2b5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
            />
          </div>
        </div>

        <Tooltip id="scriptAction" style={tooltipStyle} />

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(6).fill('').map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="h-40 bg-[#0f0f0f] animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : visibleScripts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-500 mt-20">
            <p className="text-lg">No Scripts found. Try creating or generating via the "+" button.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {visibleScripts.map((script, idx) => (
              <motion.div
                key={script._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ scale: 1.02 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-gradient-to-br from-[#0c0c2f] via-[#101024] to-[#0a0a1f] border border-[#2b2b5a] p-4 rounded-2xl shadow-xl flex flex-col justify-between"
              >
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-lg font-semibold text-indigo-300 truncate">
                    {script.data?.prompt || 'Untitled'}
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">
                    {new Date(script.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-200 line-clamp-4 whitespace-pre-wrap">
                    {script.data?.response}
                  </p>
                </div>

                <div className="flex justify-end gap-4 mt-4 text-slate-400">
                  <button
                    data-tooltip-id={`copy-${script._id}`}
                    data-tooltip-content={copiedId === script._id ? 'Copied!' : 'Copy'}
                    onClick={() => handleCopy(script.data?.response, script._id)}
                  >
                    <Copy size={18} className={copiedId === script._id ? 'text-blue-400' : ''} />
                    <Tooltip id={`copy-${script._id}`} style={tooltipStyle} />
                  </button>

                  <button
                    data-tooltip-id={`view-${script._id}`}
                    data-tooltip-content="View"
                    onClick={() => setViewScript(script)}
                  >
                    <Eye size={18} className="text-green-400" />
                    <Tooltip id={`view-${script._id}`} style={tooltipStyle} />
                  </button>

                  <button
                    data-tooltip-id={`download-${script._id}`}
                    data-tooltip-content="Download"
                    onClick={() => exportToPDF(script)}
                  >
                    <Download size={18} className="text-purple-400" />
                    <Tooltip id={`download-${script._id}`} style={tooltipStyle} />
                  </button>

                  <button
                    data-tooltip-id={`tts-${script._id}`}
                    data-tooltip-content={audioUrl?.includes(script._id) ? "Stop TTS" : "Listen"}
                    onClick={() => {
                      if (audioUrl?.includes(script._id)) clearAudio();
                      else {
                        clearAudio();
                        generateAudio(script.data?.response, script._id);
                      }
                    }}
                  >
                    <Volume2
                      size={18}
                      className={`${audioUrl?.includes(script._id)
                        ? 'text-blue-400 animate-pulse'
                        : 'text-indigo-400'}`}
                    />
                    <Tooltip id={`tts-${script._id}`} style={tooltipStyle} />
                  </button>

                  <button
                    data-tooltip-id={`delete-${script._id}`}
                    data-tooltip-content="Delete"
                    onClick={() => setDeleteId(script._id)}
                  >
                    <Trash2 size={18} className="text-red-500" />
                    <Tooltip id={`delete-${script._id}`} style={tooltipStyle} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div ref={observerRef} className="h-10 mt-10 text-center">
          {loadingMore && <span className="text-slate-400">Loading more...</span>}
        </div>

       <AnimatePresence>
  {viewScript && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      variants={modalBackdrop} // Apply your modalBackdrop variant here
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={() => setViewScript(null)}
    >
      <motion.div
        className="bg-[#101024] text-white rounded-2xl p-6 w-[90%] max-w-2xl shadow-lg flex flex-col"
        variants={modalContent} // Apply your modalContent variant here
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '70vh' }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-700 mb-3 sticky top-0 bg-[#101024] z-10">
          <h2 className="text-lg font-bold text-indigo-300">{viewScript.data?.prompt}</h2>
          <button onClick={() => setViewScript(null)}><X className="text-slate-200" /></button>
        </div>
        <div className="flex-grow overflow-y-auto">
          <p className="whitespace-pre-wrap text-sm text-slate-200">
            {viewScript.data?.response}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

        <AnimatePresence>
          {deleteId && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              variants={modalBackdrop}
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
                <h2 className="text-lg text-red-500 font-semibold mb-3">Delete Script?</h2>
                <p className="text-sm text-slate-200 mb-4">This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setDeleteId(null)} className="text-slate-400">Cancel</button>
                  <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-6 right-6 flex flex-col items-end z-40">
          <AnimatePresence>
            {showFabOptions && (
              <>
                <motion.button
                  key="manual-create"
                  variants={FABVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => {
                    setShowCreateModal(true);
                    setShowFabOptions(false);
                  }}
                  className="mb-3 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600"
                  data-tooltip-id="manualCreateScript"
                  data-tooltip-content="Create Manually"
                >
                  <Edit3 size={20} />
                </motion.button>
                <Tooltip id="manualCreateScript" style={tooltipStyle} />

                <motion.button
                  key="generate"
                  variants={FABVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => {
                    navigate('/generate');
                    setShowFabOptions(false);
                  }}
                  className="mb-3 p-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600"
                  data-tooltip-id="generateScript"
                  data-tooltip-content="Generate with AI"
                >
                  <WandSparkles size={20} />
                </motion.button>
                <Tooltip id="generateScript" style={tooltipStyle} />
              </>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowFabOptions(!showFabOptions)}
            data-tooltip-id="addScript"
            data-tooltip-content="Add Script"
            className="bg-gradient-to-tr from-[#22c55e] via-[#0e7490] to-[#3b82f6] text-white p-4 rounded-full shadow-lg hover:bg-gradient-to-tl"
          >
            <CirclePlus size={22} />
          </button>
          <Tooltip id="addScript" style={tooltipStyle} />
        </div> 

        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              variants={modalBackdrop}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                className="bg-[#101024] text-white p-6 rounded-lg w-[90%] max-w-lg shadow-xl"
                variants={modalContent}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between mb-4 items-center">
                  <h3 className="text-xl font-semibold text-indigo-300">Create Script</h3>
                  <button onClick={() => setShowCreateModal(false)}><X className="text-slate-200" /></button>
                </div>
                <input
                  type="text"
                  placeholder="Prompt"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full mb-3 p-3 bg-[#0f0f0f] border border-[#2b2b5a] rounded-md text-white"
                />
                <textarea
                  placeholder="Response"
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full mb-3 p-3 bg-[#0f0f0f] border border-[#2b2b5a] rounded-md text-white"
                />
                <button
                  onClick={handleManualCreate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
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

export default Scripts;
