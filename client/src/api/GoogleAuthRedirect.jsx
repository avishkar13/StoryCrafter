import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const GoogleAuthRedirect = () => {
  const navigate = useNavigate();
  const { setGoogleAuth } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = JSON.parse(decodeURIComponent(params.get('user')));

    if (token && user) {
      setGoogleAuth(token, user);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate, setGoogleAuth]);

  return <div className="text-center p-10">Logging you in with Google...</div>;
};

export default GoogleAuthRedirect;
