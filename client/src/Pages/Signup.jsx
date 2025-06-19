import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Signup = () => {
  const { signup, verifyOtp, completeSignup, error, loading } = useAuthStore();
  const { register, handleSubmit, reset } = useForm();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const onSendOtp = async (data) => {
    const response = await signup(data.email);
    if (response) {
      setEmail(data.email);
      setStep(2);
    }
  };

  const onVerifyOtp = async (data) => {
    const res = await verifyOtp({ email, otp: data.otp });
    if (res?.message?.includes('successfully')) setStep(3);
  };

  const onCompleteSignup = async (data) => {
    const res = await completeSignup({ email, name: data.name, password: data.password });
    if (res !== undefined) {
      reset();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-blue-900 px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Create your StoryCrafter account
        </h2>

        {/* Google Auth Button */}
        <a
          href={import.meta.env.VITE_API_BASE_URL + "/auth/google"}
          className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 py-2 px-4 rounded-full hover:bg-slate-100 transition "
        >
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <g>
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
            </g>
          </svg>
          <span>Sign up with Google</span>
        </a>

        <div className=' my-4 text-center text-white font-serif font-bold '>or</div>

        {/* Step 1: Send OTP */}
        {step === 1 && (
          <form onSubmit={handleSubmit(onSendOtp)} className="space-y-4">
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-[50%] mx-auto flex justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-full hover:opacity-90 transition"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-4">
            <input
              {...register('otp')}
              type="text"
              placeholder="Enter OTP"
              required
              className="w-full  px-4 py-3 border border-gray-300 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={loading}
              className=" w-[50%] mx-auto flex justify-center bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-full hover:opacity-90 transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {/* Step 3: Complete Signup */}
        {step === 3 && (
          <form onSubmit={handleSubmit(onCompleteSignup)} className="space-y-4">
            <input
              {...register('name')}
              type="text"
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-[50%] mx-auto flex justify-center bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 rounded-full hover:opacity-90 transition"
            >
              {loading ? 'Creating account...' : 'Complete Signup'}
            </button>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}

        {/* Login Link */}
        <p className="text-center text-sm mt-6 text-gray-300">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        {/* Dashboard Redirect */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-blue-300 transition font-medium"
          >
            <ArrowRight className="w-4 h-4" /> Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
