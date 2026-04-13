import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, ShieldCheck, RefreshCw, Smartphone, CheckCircle2, AlertCircle, Fingerprint } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1); // 1: Info, 2: OTP, 3: Success
  const [formData, setFormData] = useState({
    rail_id: '',
    name: '',
    email: '',
    password: '',
    mobile: '',
  });
  
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Captcha
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showSms, setShowSms] = useState(false);
  const [smsContent, setSmsContent] = useState('');

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserCaptcha('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (userCaptcha.toUpperCase() !== captchaText) {
      setError('Invalid Captcha. Please try again.');
      generateCaptcha();
      return;
    }

    // Simulate sending OTP
    setLoading(true);
    setTimeout(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      
      // Show simulated SMS
      setSmsContent(`RailConnect NextGen: Your OTP for registration is ${newOtp}. Please do not share it with anyone.`);
      setShowSms(true);
      
      setStep(2);
      setLoading(false);
      
      // Auto hide SMS after 10 seconds
      setTimeout(() => setShowSms(false), 10000);
    }, 1500);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (otp !== generatedOtp) {
      setError('Invalid OTP. Please check the console for simulated OTP.');
      return;
    }

    setLoading(true);
    console.log('--- ATTEMPTING FINAL REGISTRATION ---');
    console.log('Form Data to send:', {
      rail_id: formData.rail_id,
      email: formData.email,
      name: formData.name,
      mobile: formData.mobile
    });

    try {
      if (!formData.rail_id || formData.rail_id.trim() === '') {
        throw new Error('User ID is missing in form data!');
      }
      await register(formData.rail_id, formData.name, formData.email, formData.password, formData.mobile);
      setStep(3);
    } catch (err) {
      console.error('Registration call failed:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 relative">
      {/* Simulated SMS Notification */}
      {showSms && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-500 max-w-sm w-full">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border-2 border-primary-600/50 flex gap-4 items-start">
            <div className="bg-primary-600 p-2 rounded-xl shrink-0">
              <Smartphone size={24} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">Message • Now</span>
                <button onClick={() => setShowSms(false)} className="text-slate-500 hover:text-white">
                  <RefreshCw size={12} />
                </button>
              </div>
              <p className="font-black text-sm text-slate-200">RailConnect NextGen</p>
              <p className="text-xs font-bold text-slate-400 leading-relaxed">{smsContent}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-xl w-full bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary-600 shadow-lg shadow-primary-500/50" />
        
        {step === 1 && (
          <>
            <div className="text-center space-y-4 mb-8 sm:mb-10">
              <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl mb-2">
                <UserPlus size={28} className="sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Join RailConnect</h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold px-2">Create your unique ID to start your journey.</p>
            </div>

            {error && (
              <div className="p-4 mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 border border-red-100 dark:border-red-900/50 text-sm font-black">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">User ID (Unique)</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      name="rail_id"
                      type="text"
                      placeholder="e.g. saket468"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                      value={formData.rail_id}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email ID</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      name="email"
                      type="email"
                      placeholder="name@email.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Mobile No</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      name="mobile"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Verification</label>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl flex items-center justify-center gap-6 border-2 border-dashed border-slate-300 dark:border-slate-700 select-none">
                    <span className="text-3xl font-black italic tracking-[0.5em] text-slate-400 dark:text-slate-600 line-through decoration-primary-600/50">{captchaText}</span>
                    <button type="button" onClick={generateCaptcha} className="text-primary-600 hover:rotate-180 transition-all duration-500">
                      <RefreshCw size={24} />
                    </button>
                  </div>
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={userCaptcha}
                      onChange={(e) => setUserCaptcha(e.target.value)}
                      placeholder="Enter Captcha"
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-black tracking-widest"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-primary-700 transform transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-primary-500/30 mt-8"
              >
                {loading ? 'Processing...' : 'Verify & Register'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <div className="text-center space-y-8 animate-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center p-6 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-full">
              <Smartphone size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black">Verify Mobile</h2>
              <p className="text-slate-500 font-bold leading-relaxed">Enter the 6-digit OTP sent to <br/><span className="text-slate-900 dark:text-white">{formData.mobile}</span></p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-8">
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="XXXXXX"
                className="w-full p-6 text-center text-4xl font-black tracking-[0.5em] bg-slate-50 dark:bg-slate-900 border-2 border-primary-600/20 rounded-3xl focus:ring-4 focus:ring-primary-500/20 transition-all outline-none"
                required
              />
              {error && <p className="text-red-500 font-black text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-primary-700 shadow-xl shadow-primary-500/30"
              >
                {loading ? 'Creating ID...' : 'Complete Registration'}
              </button>
            </form>
            <p className="text-xs font-bold text-slate-400">Tip: Check the browser console for simulated OTP code.</p>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-10 py-10 animate-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center p-8 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
              <CheckCircle2 size={80} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">Welcome, {formData.rail_id}!</h2>
              <p className="text-xl font-bold text-slate-500">Your ID has been successfully created.</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-12 py-5 bg-primary-600 text-white rounded-2xl font-black text-xl hover:bg-primary-700 shadow-xl shadow-primary-500/30 transition-all hover:scale-105"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-700 text-center">
          <p className="text-slate-500 dark:text-slate-400 font-bold">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 underline underline-offset-4 decoration-2">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
