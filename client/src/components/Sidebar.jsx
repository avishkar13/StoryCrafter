import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PencilLine,
  FileText,
  Heading,
  Image,
  Settings,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', to: '/', icon: <LayoutDashboard size={18} /> },
    { label: 'Generate', to: '/generate', icon: <PencilLine size={18} /> },
    { label: 'Scripts', to: '/scripts', icon: <FileText size={18} /> },
    { label: 'Titles', to: '/titles', icon: <Heading size={18} /> },
    { label: 'Thumbnails', to: '/thumbnails', icon: <Image size={18} /> },
    { label: 'SEO', to: '/seo', icon: <Search size={18} /> },
    { label: 'Settings', to: '/settings', icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Floating Hamburger - visible on small screens */}
      <div className="lg:hidden fixed top-18 mt-2 left-1 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1a1a40] text-slate-100 p-2 rounded-lg shadow-md hover:bg-[#2b2b5a] transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-52 h-[92vh] bg-gradient-to-b from-[#0f0f0f] via-[#1a1a40] to-[#0c0c2f] text-white shadow-md border-r border-[#1f1f3f]">
        <nav className="mt-6 flex flex-col gap-2 px-4">
          {navItems.map(({ label, to, icon }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-[#292960] text-indigo-300'
                    : 'text-slate-300 hover:bg-[#1f1f3f] hover:text-white'
                }`}
              >
                {icon}
                {label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
               exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="fixed top-18 left-0 z-50 w-64 h-full bg-gradient-to-b from-[#0f0f0f] via-[#1a1a40] to-[#0c0c2f] text-white shadow-lg border-r border-[#1f1f3f]"
            >
              {/* Close button */}
              <div className="flex items-center justify-end px-4 py-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex flex-col gap-2 px-4">
                {navItems.map(({ label, to, icon }) => {
                  const isActive = location.pathname === to;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all text-sm font-medium ${
                        isActive
                          ? 'bg-[#292960] text-indigo-300'
                          : 'text-slate-300 hover:bg-[#1f1f3f] hover:text-white'
                      }`}
                    >
                      {icon}
                      {label}
                    </NavLink>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
