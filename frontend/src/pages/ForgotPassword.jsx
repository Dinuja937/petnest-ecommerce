import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, KeyRound, ShieldCheck, Eye, EyeOff, Lock, RefreshCw } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Timer for OTP expiration (10 minutes = 600 seconds)
  const [timer, setTimer] = useState(600);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Developer helper to show OTP on screen if email delivery fails
  const [devOtpMsg, setDevOtpMsg] = useState('');

  const otpInputsRef = useRef([]);
  const navigate = useNavigate();

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      toast.error('Verification code has expired. Please request a new one.');
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Format timer into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Focus management for OTP digits
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // keep last char only
    setOtp(newOtp);

    // If input is filled, move to next field
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Move to previous on Backspace if empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && !isNaN(pastedData)) {
      const pasteArray = pastedData.split('');
      setOtp(pasteArray);
      otpInputsRef.current[5]?.focus();
    }
  };

  // Step 1: Request OTP
  const requestOtpHandler = async (e) => {
    e.preventDefault();
    setDevOtpMsg('');
    try {
      setIsLoading(true);
      const { data } = await api.post('/auth/send-otp', { email: email.trim() });
      
      toast.success(data.message || 'OTP sent successfully!');
      
      // If we are in development mode/no SMTP configured and the backend returned the devOtp
      if (data.devOtp) {
        setDevOtpMsg(data.devOtp);
        console.log(`[Dev Mode] Verification code: ${data.devOtp}`);
      }

      setTimer(600); // Reset to 10 minutes
      setIsTimerActive(true);
      setStep(2);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to process request';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit verification code.');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.post('/auth/verify-otp', {
        email: email.trim(),
        otp: otpCode
      });
      
      toast.success(data.message || 'Verification successful!');
      setResetToken(data.resetToken);
      setIsTimerActive(false);
      setStep(3);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid or expired OTP';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      await api.put('/auth/reset-password', {
        resetToken,
        password
      });
      toast.success('Password updated successfully!');
      setStep(4); // Success step
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset password';
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
        className="max-w-md w-full space-y-6 bg-brand-card-background p-8 md:p-10 rounded-brand-lg shadow-brand-soft border border-brand-border"
      >
        
        {/* Progress indicator */}
        {step <= 3 && (
          <div className="flex justify-between items-center px-4 mb-6">
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step >= 1 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                1
              </div>
              <span className="text-[10px] mt-1 text-brand-text-secondary font-semibold">Email</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 transition-all duration-500 ${step >= 2 ? 'bg-brand-primary' : 'bg-brand-border'}`} />
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step >= 2 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                2
              </div>
              <span className="text-[10px] mt-1 text-brand-text-secondary font-semibold">Verify</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 transition-all duration-500 ${step >= 3 ? 'bg-brand-primary' : 'bg-brand-border'}`} />
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step >= 3 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                3
              </div>
              <span className="text-[10px] mt-1 text-brand-text-secondary font-semibold">Reset</span>
            </div>
          </div>
        )}

        {/* STEP 1: ENTER EMAIL */}
        {step === 1 && (
          <>
            <div className="text-center">
              <div className="mx-auto h-14 w-14 bg-brand-secondary text-brand-primary rounded-full flex items-center justify-center shadow-inner">
                <KeyRound size={26} />
              </div>
              <h2 className="mt-4 text-2xl font-black text-brand-text-primary tracking-tight">
                Forgot Password?
              </h2>
              <p className="mt-2 text-sm text-brand-text-secondary">
                Enter your email address and we'll send you a 6-digit verification code.
              </p>
            </div>

            <form className="mt-6 space-y-5" onSubmit={requestOtpHandler}>
              <div>
                <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="email-input">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-brand-md text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Generating OTP...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          </>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 2 && (
          <>
            <div className="text-center">
              <div className="mx-auto h-14 w-14 bg-brand-secondary text-brand-primary rounded-full flex items-center justify-center shadow-inner">
                <ShieldCheck size={26} />
              </div>
              <h2 className="mt-4 text-2xl font-black text-brand-text-primary tracking-tight">
                Verify Code
              </h2>
              <p className="mt-2 text-sm text-brand-text-secondary">
                We sent a 6-digit code to <strong className="text-brand-text-primary font-semibold">{email}</strong>
              </p>
            </div>

            {/* Development helper banner / Alert container */}
            {devOtpMsg && (
              <div className="bg-amber-50 border border-amber-200 rounded-brand-md p-4 text-center shadow-sm">
                <span className="text-xs font-semibold text-amber-800">
                  ⚠️ Development Fallback:
                </span>
                <span className="ml-2 font-mono text-sm font-bold tracking-widest text-amber-900 select-all">
                  {devOtpMsg}
                </span>
              </div>
            )}

            <form className="mt-6 space-y-6" onSubmit={verifyOtpHandler}>
              <div>
                <label className="block text-center text-sm font-semibold text-brand-text-primary mb-3">
                  Enter 6-digit code
                </label>
                
                {/* 6 Digit Input Fields */}
                <div className="flex justify-between gap-2 px-1" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    />
                  ))}
                </div>
              </div>

              {/* Countdown timer & Resend */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-brand-text-secondary font-medium">
                  {timer > 0 ? (
                    <span className="text-brand-primary font-semibold">Expires in: {formatTime(timer)}</span>
                  ) : (
                    <span className="text-brand-danger font-semibold">Code expired</span>
                  )}
                </span>
                
                <button
                  type="button"
                  disabled={timer > 0 || isLoading}
                  onClick={requestOtpHandler}
                  className="font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Resend Code
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-sm font-bold rounded-brand-md text-brand-text-secondary hover:bg-gray-50 hover:text-brand-text-primary transition-all cursor-pointer bg-white"
                >
                  Change Email
                </button>
                <button
                  type="submit"
                  disabled={isLoading || timer === 0}
                  className="flex-1 py-3 px-4 border border-transparent text-sm font-bold rounded-brand-md text-white bg-brand-primary hover:bg-brand-primary-hover transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <>
            <div className="text-center">
              <div className="mx-auto h-14 w-14 bg-brand-secondary text-brand-primary rounded-full flex items-center justify-center shadow-inner">
                <Lock size={26} />
              </div>
              <h2 className="mt-4 text-2xl font-black text-brand-text-primary tracking-tight">
                New Password
              </h2>
              <p className="mt-2 text-sm text-brand-text-secondary">
                Please enter and confirm your new secure password.
              </p>
            </div>

            <form className="mt-6 space-y-5" onSubmit={resetPasswordHandler}>
              <div>
                <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="password-input">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="confirm-password-input">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirm-password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password strength helper */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          password.length >= level * 3
                            ? level <= 1
                              ? 'bg-brand-danger'
                              : level <= 2
                              ? 'bg-amber-400'
                              : level <= 3
                              ? 'bg-yellow-400'
                              : 'bg-brand-success'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-brand-text-secondary font-medium">
                    {password.length < 6
                      ? 'Too short'
                      : password.length < 8
                      ? 'Fair'
                      : password.length < 12
                      ? 'Good'
                      : 'Strong'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-brand-md text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Resetting password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </>
        )}

        {/* STEP 4: SUCCESS PAGE */}
        {step === 4 && (
          <div className="text-center py-4">
            <div className="mx-auto h-16 w-16 bg-brand-success/15 text-brand-success rounded-full flex items-center justify-center mb-4 shadow-inner animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-brand-text-primary tracking-tight">Success!</h2>
            <p className="mt-2 text-sm text-brand-text-secondary font-medium">
              Your password has been successfully reset.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Redirecting you to the sign-in page...
            </p>
          </div>
        )}

        {/* Back Link (only show on early steps) */}
        {step <= 2 && (
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
