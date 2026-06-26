import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setCredentials } from '../store/slices/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import { UserPlus, RefreshCw } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      dispatch(setCredentials(data));
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to register';
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
            <UserPlus size={26} />
          </div>
          <h2 className="mt-6 text-3xl font-black text-brand-text-primary tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-brand-text-secondary">
            Join PetNest and find the best for your pets
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="John Doe"
                className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-brand-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
