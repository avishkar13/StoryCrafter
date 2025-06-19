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
  const [download, setDownload] = useState(false)
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
    if (saved) {
      setSaveMsg('Saved successfully! 🎉');
    } else {
      setSaveMsg('❌ Failed to save');
    }
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
    <div className="max-w-7xl mx-auto px-0 md:px-6 py-10 space-y-12">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center text-blue-700"
      >
        🎬 StoryCrafter AI Generator
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white shadow-xl rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10"
      >
        {/* LEFT SECTION */}
        <div className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Select Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="script">📝 Script</option>
              <option value="title">🎬 Title</option>
              <option value="thumbnailPrompt">🖼️ Thumbnail Prompt</option>
              <option value="seo">🔍 SEO Tags</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How AI will change jobs"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
            <button
              onClick={handleClear}
              className="flex items-center justify-center px-4 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-sm min-h-[250px] flex flex-col"
        >
          {result ? (
            <>
              <div className="flex flex-wrap justify-between items-center mb-4 gap-4  ">
                <h3 className="font-semibold text-lg text-gray-800">Generated {generatedType}:</h3>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    data-tooltip-id="tooltip-copy"
                    data-tooltip-content={copied ? "Copied!" : "Copy"}
                    onClick={handleCopy}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Copy size={16} />
                  </button>

                  <button
                    data-tooltip-id="tooltip-save"
                    data-tooltip-content={saveMsg ? "Saved!" : "Save"}
                    onClick={handleSave}
                    className="text-sm text-green-600 hover:underline flex items-center gap-1"
                  >
                    <Save size={16} />
                  </button>

                  <button
                    data-tooltip-id="tooltip-download"
                    data-tooltip-content={download ? "Downloaded!" : "Download"}
                    onClick={handleExportPDF}
                    className="text-sm text-purple-600 hover:underline flex items-center gap-1"
                  >
                    <Download size={16} />
                  </button>
                  <Tooltip id="tooltip-copy" />
                  <Tooltip id="tooltip-save" />
                  <Tooltip id="tooltip-download" />

                </div>
              </div>

              <div
                id="pdf-content"
                className="whitespace-pre-wrap text-gray-900 font-mono text-sm leading-relaxed max-h-[40vh] overflow-auto "
              >
                {result}
              </div>


            </>
          ) : (
            <div className="flex flex-col justify-center items-center text-gray-400 text-sm h-full">
              <img
                src="https://illustrations.popsy.co/gray/web-design.svg"
                alt="Placeholder"
                className="w-32 h-32 mb-4 opacity-60"
              />
              <p className="text-center">Generated content will appear here. Enter a topic & click "Generate".</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>

  );
};

export default Generate;
