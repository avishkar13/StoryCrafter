import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';

// DND-KIT IMPORTS
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import {
  Trash2, PenSquare, ImagePlus, Type, SearchCode,
  EyeOff, Eye, BrainCircuit, Lightbulb, GripVertical
} from 'lucide-react';

import useContentStore from '../store/contentStore';
import useDashboardStore from '../store/useDashboardStore';

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};


const SortableNote = ({ id, text, deleteNote }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes} // keep attributes for a11y
      className="bg-[#1a1a40] text-slate-200 p-5 rounded-xl border border-[#2b2b5a] shadow-lg max-w-xs min-w-[160px] relative flex-shrink-0"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-sm pr-6">{text}</p>

      <div className="absolute top-1 right-2 flex items-center gap-2">
        {/* ✅ Separate Drag Handle */}
        <div
          {...listeners}
          className="cursor-grab hover:text-white text-slate-400"
          title="Drag"
        >
          <GripVertical size={16} />
        </div>

        {/* ✅ Reliable Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // important: prevent drag start
            deleteNote(id);
          }}
          className="hover:text-red-500 text-slate-400 transition"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};


const Dashboard = () => {
  const { contents, fetchUserContent } = useContentStore();

  const { ideaNotes, addNote, deleteNote, reorderNotes } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showIdeas, setShowIdeas] = useState(true);


  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchUserContent();
  }, [fetchUserContent]);

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(newNote.trim());
      setNewNote('');
      setIsModalOpen(false);
    }
  };


  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      reorderNotes(active.id, over.id);
    }
  };

  const summaryData = [
    {
      label: 'Scripts',
      count: contents.filter((c) => c.type === 'script').length,
      icon: <PenSquare className="text-blue-600 w-6 h-6" />, // PenSquare kept for this icon usage
      link: '/scripts',
    },
    {
      label: 'Thumbnails',
      count: contents.filter((c) => c.type === 'thumbnailPrompt').length,
      icon: <ImagePlus className="text-purple-600 w-6 h-6" />,
      link: '/thumbnails',
    },
    {
      label: 'Titles',
      count: contents.filter((c) => c.type === 'title').length,
      icon: <Type className="text-green-600 w-6 h-6" />,
      link: '/titles',
    },
    {
      label: 'SEO',
      count: contents.filter((c) => c.type === 'seo').length,
      icon: <SearchCode className="text-yellow-600 w-6 h-6" />,
      link: '/seo',
    },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  const recentActivity = [...contents]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((c) => ({
      type: c.type.charAt(0).toUpperCase() + c.type.slice(1),
      title: c.data?.prompt || 'Untitled',
    }));

  return (
    <div className="sm:px-6 py-6 max-w-8xl mx-auto space-y-12">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80 }}
        className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold tracking-tight text-indigo-400 flex items-center gap-2"
      >
        <BrainCircuit className="w-6 h-6 md:w-8 md:h-8 text-indigo-300" />
        Dashboard
      </motion.h2>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contents.length === 0 ? (
          <div className="col-span-full text-center text-gray-300 italic py-10">
            No content found. Create some Scripts, Titles, Thumbnails, or SEO prompts to see them here.
          </div>
        ) : (
          summaryData.map(({ label, count, icon, link }, idx) => (
            <Link key={label} to={link}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="bg-gradient-to-br from-[#1a1a40] via-[#101024] to-[#0f0f0f] border border-[#2b2b5a] p-4 rounded-2xl shadow-md hover:shadow-slate-800 transition-all duration-300 text-white cursor-pointer flex flex-col items-center justify-center space-y-2 text-center"
              >
                <div className="flex items-center space-x-3">{icon}<h3 className="font-semibold">{label}</h3></div>
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <ResponsiveContainer width="100%" height={40}>
                  <LineChart data={[{ count }, { count: count + 1 }, { count }]}>
                    <Line type="monotone" dataKey="count" stroke={COLORS[idx % COLORS.length]} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </Link>
          ))
        )}
      </div>

      <AnimatePresence>
        {/* ✅ Idea Notes */}
        <motion.div
          key="idea"
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#0f0f0f] via-[#1a1a40] to-[#0c0c2f] p-4 sm:p-6 rounded-2xl shadow-xl border border-[#2b2b5a]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-lg font-semibold text-yellow-400">💡 Idea Board</h3>
            <div className="flex gap-4 md:gap-6">
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 px-2 py-1 text-sm bg-gradient-to-r from-[#0e7490] via-[#3b82f6] to-[#4f46e5] text-white rounded hover:bg-gradient-to-br transition">
                <Lightbulb size={14} /> Add
              </button>
              <button onClick={() => setShowIdeas(!showIdeas)} className="text-slate-400 hover:text-white">
                {showIdeas ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {showIdeas && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="max-h-72 overflow-y-auto pr-1">
                <SortableContext
                  items={ideaNotes.map(note => note.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    {ideaNotes.length === 0 ? (
                      <p className="text-slate-500 italic">No ideas yet.</p>
                    ) : (
                      ideaNotes.map((note) => (
                        <SortableNote
                          key={note.id}
                          id={note.id}
                          text={note.text}
                          deleteNote={deleteNote}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </div>
            </DndContext>
          )}
        </motion.div>

        {/* ✅ Charts Section */}
        <motion.div
          key="charts"
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Bar Chart */}
          <div className="bg-[#101024] p-4 sm:p-6 rounded-2xl shadow-xl border border-[#2b2b5a] text-white">
            <h3 className="text-sm md:text-lg font-semibold mb-2 text-indigo-400">📊 Content Stats</h3>
            {contents.length === 0 ? (
              <div className="text-center text-slate-500 italic h-full flex items-center justify-center">
                No data to display in charts.
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={summaryData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <XAxis
                      dataKey="label"
                      stroke="#94a3b8"
                      tick={false} 
                    />

                    <YAxis stroke="#94a3b8" allowDecimals={false} tick={{ fill: '#cbd5e1' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#888993', borderColor: '#e5e7eb', color: '#fff' }}
                      labelStyle={{ color: '#101024' }}
                    />

                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {summaryData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* ✅ Custom Legend Below */}
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  {summaryData.map((entry, index) => (
                    <div key={entry.label} className="flex items-center gap-2">
                      <span
                        className="inline-block w-4 h-4 rounded-sm"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></span>
                      <span className="text-slate-300">{entry.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>



          {/* Pie Chart */}
          <div className="bg-[#101024] p-4 sm:p-6 rounded-2xl shadow-xl border border-[#2b2b5a] text-white flex flex-col items-center justify-between">
            <h3 className="text-sm md:text-lg font-semibold mb-2 text-indigo-400">📈 Content Distribution</h3>
            {contents.length === 0 ? (
              <div className="text-center text-slate-500 italic h-full flex items-center justify-center">No data available for pie chart.</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={summaryData} cx="50%" cy="50%" innerRadius={40} outerRadius={90} paddingAngle={5} labelLine label={({ percent }) => ` ${(percent * 100).toFixed(0)}%`} dataKey="count">
                    {summaryData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Legend payload={summaryData.map((entry, index) => ({ value: entry.label, type: 'circle', color: COLORS[index % COLORS.length] }))} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* ✅ Recent Activity */}
        <motion.div
          key="recent"
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-[#0f0f0f] p-4 sm:p-6 rounded-2xl shadow-xl border border-[#2b2b5a] text-white"
        >
          <h3 className="text-lg font-semibold mb-4 text-indigo-400">🕒 Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-slate-500 italic text-center">No recent activity to show.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {recentActivity.map(({ type, title }, idx) => (
                <li key={idx} className="border-b border-dashed border-slate-600 pb-2">
                  <span className="font-medium text-blue-400">{type}</span> - {title}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 📦 Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-[#131111] text-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-sm border border-[#2b2b5a]">
            <Dialog.Title className="text-lg font-bold mb-2">New Idea</Dialog.Title>
            <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} className="w-full border border-slate-600 bg-[#101024] text-white rounded p-2 mb-4" rows={3} placeholder="Type your idea..." />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleAddNote} className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Dashboard;