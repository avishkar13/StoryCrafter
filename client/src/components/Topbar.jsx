import {  useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { PencilLine } from 'lucide-react';

const Topbar = () => {
  const { authUser, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <header className="w-full h-[10vh] bg-white shadow-sm px-4 md:px-6 py-4 sticky top-0 z-50 flex items-center justify-end ">
      {/* Logo */}
      <div className="flex items-center gap-4 mr-auto">
        <Link to='/'>
          <h1 className="text-lg md:text-2xl font-extrabold text-blue-600 tracking-wide">
            <span className="text-blue-700">Story</span>
            <span className="text-black">Crafter</span>
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {/* Create New */}
        <Link to='/generate'>
        <button
          onClick={() => navigate('/generate')}
          className="bg-gradient-to-bl from-[#2b4480] via-[#1e1a78] to-[#2b3345] text-white px-4 py-2 rounded-md hover:bg-gradient-to-tl transition"
          title='Generate'
        >
           <PencilLine size={18} />
        </button>
        </Link>
        

        {/* Right-side Auth Buttons */}
        {authUser ? ( 
          <button
            onClick={() => navigate('/settings')}
            className="text-sm font-medium text-gray-700 hover:text-blue-700 transition"
            title="settings"
          >
            ⚙️  <span className='hidden md:inline-block'>Settings</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
