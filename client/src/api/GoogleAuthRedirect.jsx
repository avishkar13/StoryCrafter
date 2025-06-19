import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const GoogleAuthRedirect = () => {
  const navigate = useNavigate();
  const { setGoogleAuth } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userParam = params.get('user');

    try {
      const user = userParam && JSON.parse(decodeURIComponent(userParam));

      if (token && user) {
        setGoogleAuth(token, user);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error("Error parsing Google user data:", error);
      navigate('/login');
    }
  }, [navigate, setGoogleAuth]);

  return <div className="text-center text-lg text-gray-600 py-10">Logging you in with Google...</div>;
};

export default GoogleAuthRedirect;
