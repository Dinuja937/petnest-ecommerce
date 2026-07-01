import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setCredentials } from '../store/slices/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import { LogIn, RefreshCw } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate, userInfo]);

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await api.post('/auth/login', { email: email.trim(), password });
      dispatch(setCredentials(data));
      toast.success('Login successful!');
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to log in';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-16 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 bg-brand-card-background p-8 md:p-10 rounded-brand-lg shadow-brand-soft border border-brand-border"
      >
        <div className="text-center">
          <div className="mx-auto h-14 w-14 bg-brand-secondary text-brand-primary rounded-full flex items-center justify-center shadow-inner">
            <LogIn size={26} className="ml-1" />
          </div>
          <h2 className="mt-6 text-3xl font-black text-brand-text-primary tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-brand-text-secondary">
            Sign in to access your PetNest account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-brand-md text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
         </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-brand-card-background text-brand-text-secondary font-medium">Or continue with</span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-brand-md text-sm font-bold text-brand-text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.38c0,-0.68 -0.06,-1.33 -0.17,-1.98z" fill="#4285F4" />
                <path d="M12,20.7c2.43,0 4.47,-0.8 5.96,-2.2l-2.58,-2c-0.72,0.48 -1.65,0.77 -2.58,0.77 -2.33,0 -4.3,-1.57 -5,-3.68H2.03v2.66c1.49,2.96 4.55,4.92 8.07,4.92z" fill="#34A853" />
                <path d="M7,13.59c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7c0,-0.59 0.1,-1.16 0.28,-1.7V7.53H2.03c-0.65,1.29 -1.03,2.75 -1.03,4.36c0,1.61 0.38,3.07 1.03,4.36z" fill="#FBBC05" />
                <path d="M12,6.9c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,4.22 14.42,3.3 12,3.3c-3.52,0 -6.58,1.96 -8.07,4.92L7,10.22c0.7,-2.11 2.67,-3.68 5,-3.68z" fill="#EA4335" />
              </g>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-brand-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
