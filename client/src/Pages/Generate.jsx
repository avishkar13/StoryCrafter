import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Download, Save } from 'lucide-react';
import useContentStore from '../store/contentStore';
import { jsPDF } from 'jspdf';
import { Tooltip } from 'react-tooltip';

const Generate = () => {
  const [type, setType] = useState('script');
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [saveMsg, setSaveMsg] = useState(false);
  const [download, setDownload] = useState(false);
  const [generatedType, setGeneratedType] = useState('');

  const { generateContent, saveContent, loading } = useContentStore();

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    const prompt = `Generate a ${type} for a YouTube video on: ${topic}`;
    const generated = await generateContent(prompt, type);
    const generatedText = generated?.data?.response;

    if (generatedText) {
      setResult(generatedText);
      setGeneratedType(type);
      setSaveMsg('');
    } else {
      setResult('Generation failed. Try again.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTopic('');
    setResult('');
    setSaveMsg('');
  };

  const handleSave = async () => {
    if (!result || !generatedType) {
      setSaveMsg("Nothing to save!");
      return;
    }
    const saved = await saveContent(generatedType || type, topic, result);
    setSaveMsg(saved ? 'Saved successfully! 🎉' : '❌ Failed to save');
    setTimeout(() => setSaveMsg(''), 2500);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(topic || 'Untitled Script', 10, 20);
    doc.setFontSize(12);
    doc.text(result || 'No script content available.', 10, 30, { maxWidth: 180 });
    doc.save(`${(topic || 'script').slice(0, 20)}.pdf`);
    setDownload(true);
    setTimeout(() => setDownload(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto md:px-6 py-10 space-y-12 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold font-serif text-center text-indigo-400"
      >
        🎬 StoryCrafter AI Generator
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#0f0f0f] via-[#1a1a40] to-[#0c0c2f] shadow-xl rounded-2xl p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 border border-[#2b2b5a]"
      >
        {/* LEFT */}
        <div className="space-y-6">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Select Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 bg-[#101024] border border-[#2b2b5a] rounded-md text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="script">📝 Script</option>
              <option value="title">🎬 Title</option>
              <option value="thumbnailPrompt">🖼️ Thumbnail Prompt</option>
              <option value="seo">🔍 SEO Tags</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How AI will change jobs"
              className="w-full p-3 bg-[#101024] border border-[#2b2b5a] text-white rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 bg-gradient-to-br from-indigo-500 to-pink-500 text-white py-2 rounded hover:bg-gradient-to-tl transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className={`flex items-center justify-center px-4 text-white rounded transition
    ${loading ? 'bg-slate-600 cursor-not-allowed opacity-50' : 'bg-slate-700 hover:bg-slate-600'}
  `}
            >
              <Trash2 size={18} />
            </button>

          </div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative border border-[#2b2b5a] rounded-xl p-3 md:p-6 bg-[#101024] shadow-inner min-h-[250px] flex flex-col"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 animate-pulse"
              >
                <div className="h-4 w-2/3 bg-slate-700 rounded"></div>
                <div className="h-3 w-full bg-slate-800 rounded"></div>
                <div className="h-3 w-full bg-slate-800 rounded"></div>
                <div className="h-3 w-5/6 bg-slate-700 rounded"></div>
                <div className="h-3 w-4/6 bg-slate-800 rounded"></div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="generated"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                  <h3 className="font-semibold text-[14px] md:text-lg text-slate-200">Generated {generatedType}:</h3>
                  <div className="flex flex-wrap items-center  gap-4">
                    <button
                      data-tooltip-id="tooltip-copy"
                      data-tooltip-content={copied ? "Copied!" : "Copy"}
                      onClick={handleCopy}
                      className="text-sm text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Copy size={16} />
                    </button>

                    <button
                      data-tooltip-id="tooltip-save"
                      data-tooltip-content={saveMsg ? "Saved!" : "Save"}
                      onClick={handleSave}
                      className="text-sm text-green-400 hover:underline flex items-center gap-1"
                    >
                      <Save size={16} />
                    </button>

                    <button
                      data-tooltip-id="tooltip-download"
                      data-tooltip-content={download ? "Downloaded!" : "Download"}
                      onClick={handleExportPDF}
                      className="text-sm text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Download size={16} />
                    </button>
                    <Tooltip
                      id="tooltip-copy"
                      style={{
                        backgroundColor: '#1a1a40',
                        color: '#f8fafc',
                        border: '1px solid #3b82f6',
                        fontSize: '12px',
                        borderRadius: '6px',
                        padding: '6px 8px',
                      }}
                    />

                    <Tooltip
                      id="tooltip-save"
                      style={{
                        backgroundColor: '#1a1a40',
                        color: '#f8fafc',
                        border: '1px solid #10b981',
                        fontSize: '12px',
                        borderRadius: '6px',
                        padding: '6px 8px',
                      }}
                    />
                    <Tooltip
                      id="tooltip-download"
                      style={{
                        backgroundColor: '#1a1a40',
                        color: '#f8fafc',
                        border: '1px solid #8b5cf6',
                        fontSize: '12px',
                        borderRadius: '6px',
                        padding: '6px 8px',
                      }}
                    />

                  </div>
                </div>

                <div
                  id="pdf-content"
                  className="whitespace-pre-wrap text-center text-slate-200 font-mono text-sm leading-relaxed max-h-[40vh] overflow-auto"
                >
                  {result}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col justify-center items-center text-slate-500 text-sm h-full"
              >
                <img
                  src="PlaceHolder.png"
                  alt="Placeholder"
                  className="w-72 h-48 opacity-60"
                />
                <p className="text-center">Generated content will appear here. Enter a topic & click "Generate".</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Generate;
