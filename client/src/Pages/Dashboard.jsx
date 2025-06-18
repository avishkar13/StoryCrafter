import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import {
  Trash2, Plus, PenSquare, ImagePlus, Type, SearchCode,
  EyeOff, Eye, Check, X as Close
} from 'lucide-react';

import useContentStore from '../store/contentStore';
import useDashboardStore from '../store/useDashboardStore';

const Dashboard = () => {
  const { contents, fetchUserContent } = useContentStore();
  const { ideaNotes, addNote, deleteNote, reorderNotes, updateNote } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showIdeas, setShowIdeas] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState('');

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

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    reorderNotes(source.index, destination.index);
  };

  const summaryData = [
    {
      label: 'Scripts',
      count: contents.filter((c) => c.type === 'script').length,
      icon: <PenSquare className="text-blue-600 w-6 h-6" />,
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
    <div className="sm:px-6 py-6 max-w-8xl mx-auto space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80 }}
        className="text-2xl sm:text-4xl font-extrabold text-blue-700 tracking-tight"
      >
        🧠 Dashboard
      </motion.h2>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contents.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 italic py-10">
            No content found. Create some Scripts, Titles, Thumbnails, or SEO prompts to see them here.
          </div>
        ) : (
          summaryData.map(({ label, count, icon, link }, idx) => (
            <Link key={label} to={link}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-xl shadow hover:shadow-slate-400 hover:shadow-lg transition duration-200 hover:bg-gray-50 flex flex-col items-center justify-center space-y-2 cursor-pointer"
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

      {/* ✅ Idea Notes */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm md:text-lg font-semibold text-yellow-700">💡 Idea Board</h3>
          <div className="flex gap-2">
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              <Plus size={14} /> Add
            </button>
            <button onClick={() => setShowIdeas(!showIdeas)} className="text-gray-500 hover:text-gray-700">
              {showIdeas ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {showIdeas && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="ideas" direction="horizontal">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="overflow-y-auto pr-1 max-h-72 flex flex-wrap gap-3 justify-center lg:justify-start">
                  {ideaNotes.length === 0 ? (
                    <p className="text-gray-400 italic">No ideas yet.</p>
                  ) : (
                    ideaNotes.map((note, index) => (
                      <Draggable key={index} draggableId={`note-${index}`} index={index}>
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="bg-yellow-50 text-yellow-900 p-5 rounded-xl shadow border border-yellow-200 max-w-xs min-w-[160px] relative"
                          >
                            {editingIndex === index ? (
                              <>
                                <textarea
                                  value={editedText}
                                  onChange={(e) => setEditedText(e.target.value)}
                                  className="w-full rounded border p-1 text-sm"
                                />
                                <div className="flex justify-end gap-2 mt-1">
                                  <button
                                    onClick={() => {
                                      updateNote(index, editedText.trim());
                                      setEditingIndex(null);
                                    }}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={() => setEditingIndex(null)}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    <Close size={16} />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="text-sm">{note}</p>
                                <div className="absolute top-1 right-2 flex items-center gap-2">
                                  {/* <button onClick={() => {
                                    setEditingIndex(index);
                                    setEditedText(note);
                                  }}>
                                    <PenSquare size={15} className="text-blue-600" />
                                  </button> */}
                                  <button onClick={() => deleteNote(index)} className="hover:text-red-500">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* ✅ Charts Section (Fallback for No Content) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow min-h-[200px]">
    <h3 className="text-sm md:text-lg font-semibold mb-2">📊 Content Stats</h3>
    {contents.length === 0 ? (
      <div className="text-center text-gray-400 italic h-full flex items-center justify-center">
        No data to display in charts.
      </div>
    ) : (
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={summaryData}
            barGap={8}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="label" stroke="#94a3b8" hide />
            <YAxis stroke="#94a3b8" allowDecimals={false} />
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-slate-600">{value}</span>
              )}
              payload={summaryData.map((entry, index) => ({
                value: entry.label,
                type: 'circle',
                color: COLORS[index % COLORS.length],
              }))}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {summaryData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>

  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow min-h-[200px]">
    <h3 className="text-sm md:text-lg font-semibold mb-2">📈 Content Distribution</h3>
    {contents.length === 0 ? (
      <div className="text-center text-gray-400 italic h-full flex items-center justify-center">
        No data available for pie chart.
      </div>
    ) : (
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={summaryData}
              cx="50%"
              cy="50%"
              innerRadius={40}he
              outerRadius={90}
              paddingAngle={5}
              labelLine={true}
              dataKey="count"
              label={({ percent }) =>
                ` ${(percent * 100).toFixed(0)}%`
              }
            >
              {summaryData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              payload={summaryData.map((entry, index) => ({
                value: entry.label,
                type: 'circle',
                color: COLORS[index % COLORS.length],
              }))}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
</div>


      {/* ✅ Recent Activity */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">🕒 Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-gray-400 italic text-center">No recent activity to show.</p>
        ) : (
          <ul className="space-y-3 text-gray-700 text-sm">
            {recentActivity.map(({ type, title }, idx) => (
              <li key={idx} className="border-b border-dashed border-gray-200 pb-2">
                <span className="font-medium text-blue-700">{type}</span> - {title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📦 Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-sm border">
            <Dialog.Title className="text-lg font-bold mb-2">New Idea</Dialog.Title>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              rows={3}
              placeholder="Type your idea..."
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                Cancel
              </button>
              <button onClick={handleAddNote} className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Dashboard;
