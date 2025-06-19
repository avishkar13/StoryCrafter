import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { WandSparkles } from 'lucide-react';

const Topbar = () => {
  const { authUser, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <header className="w-full h-18 bg-gradient-to-r from-[#0f0f0f] via-[#1a1a40] to-[#0c0c2f]  shadow-xl px-4 md:px-8 py-4 sticky top-0 z-50 flex items-center justify-between">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-1">
        <h1 className="text-2xl font-extrabold tracking-wide">
          <span className="text-indigo-500 font-mono">Story</span>
          <span className="text-slate-200 font-extrabold font-mono">Crafter</span>
        </h1>
      </Link>


      {/* Right-side Controls */}
      <div className="flex items-center gap-4">
        {/* Generate Button */}
        <Link to="/generate">
          <button
            className="bg-gradient-to-tl from-[#9d174d] via-[#d946ef] to-[#f0abfc] hover:from-purple-500 hover:to-pink-400 transition text-white px-3 py-3 rounded-full shadow-lg flex items-center justify-center"
            title="Generate"
          >
            <WandSparkles size={18} />
          </button>

        </Link> 

        {/* Auth Buttons */}
        {authUser ? (
          <button
            onClick={() => navigate('/settings')}
            className="text-sm font-medium text-gray-300 hover:text-white transition flex items-center gap-1"
            title="Settings"
          >
            <span className="text-xl">⚙️</span>
            <span className="hidden md:inline-block">Settings</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-b from-[#06b6d4] via-[#2563eb] to-[#6366f1]  transition duration-200 hover:bg-gradient-to-t text-slate-50 px-4 py-2 rounded-lg shadow-sm font-semibold font-mono"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
