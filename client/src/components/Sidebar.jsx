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
      {/* Hamburger Icon - visible only on small screens */}
      <div className="lg:hidden p-2">
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-900 bg-gray-100 p-1 rounded-md shadow"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Permanent Sidebar on lg+ */}
      <aside className="hidden lg:block w-48 h-[90vh] bg-white shadow-sm border-r">
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {navItems.map(({ label, to, icon }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {icon}
                {label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Animated Sidebar on mobile using Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed  inset-0 bg-black bg-opacity-30 z-40"
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
              className="fixed top-[10vh] left-0 z-50 w-64 h-full bg-white shadow-lg border-r"
            >
              {/* Close button */}
              <div className="flex items-center justify-end px-4 py-3 ">
                <button onClick={() => setIsOpen(false)} className="text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <nav className=" flex flex-col gap-1 px-3">
                {navItems.map(({ label, to, icon }) => {
                  const isActive = location.pathname === to;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setIsOpen(false)} // Close on link click
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
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
