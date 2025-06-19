import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-gray-600 px-4">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-4xl text-gray-200 font-bold mb-2">404</h1>
      <p className="text-lg text-gray-300 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-5 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-all duration-200"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
