// Login.jsx
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ArrowRight } from 'lucide-react';

const Login = () => {
  const { authUser, login, loading, error } = useAuthStore();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) navigate('/');
  }, [authUser, navigate]);

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password);
    if (res) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-blue-900 px-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome back 👋</h2>

        {error && <p className="text-red-400 text-sm mb-4 text-center bg-red-100/10 py-2 rounded shadow">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <a 
            href={import.meta.env.VITE_API_BASE_URL + "/auth/google"}
            className="flex items-center justify-center gap-2 bg-white text-black border border-gray-300 py-2 px-4 rounded-full hover:bg-slate-100 transition mb-5 w-full mx-auto"
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <g>
                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
              </g>
            </svg>
            <span>Login with Google</span>
          </a>

           <div className=' my-4 text-center text-white font-serif font-bold '>or</div>

          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-full bg-white backdrop-blur-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

          <input
            {...register('password', { required: true })}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-full bg-white backdrop-blur-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

          <button
            type="submit"
            className="w-[50%] flex mx-auto justify-center  bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm mt-5 text-gray-300">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline font-medium">Sign up</Link>
        </p>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-blue-300 transition font-medium">
            <ArrowRight className="w-4 h-4" /> Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;



