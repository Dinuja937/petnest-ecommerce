import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = searchParams.get('token');

      if (!token) {
        toast.error('Authentication failed: No token received.');
        navigate('/login');
        return;
      }

      try {
        // Fetch full profile from backend using the OAuth token in Authorization header
        const { data } = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Save the complete credentials in Redux and localStorage
        const userData = {
          ...data,
          token,
        };
        dispatch(setCredentials(userData));
        toast.success('Logged in successfully with Google!');

        // Redirect based on role
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('OAuth profile fetch failed:', err);
        const errorMsg = err.response?.data?.message || 'Failed to sync user profile';
        toast.error(errorMsg);
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] bg-brand-background">
      <div className="text-center space-y-4">
        <LoadingSpinner />
        <h2 className="text-2xl font-semibold text-brand-text-primary">Syncing your account...</h2>
        <p className="text-sm text-brand-text-secondary">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
