'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff, GraduationCap, Sparkles } from 'lucide-react';
import { login } from './actions';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      console.log('🔐 Attempting login...');
      const result = await login(formData);

      if (result?.error) {
        console.error('❌ Login error:', result.error);
        setError(result.error);
        setLoading(false);
      } else {
        // Success - force a hard refresh to ensure state sync
        console.log('✅ Login successful - refreshing...');
        router.refresh();
        // The redirect is handled by the server action
      }
    } catch (error) {
      console.error('❌ Login exception:', error);
      setError('حدث خطأ أثناء تسجيل الدخول');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-xl shadow-primary-500/30"
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-black text-white mb-2"
          >
            مرحباً بعودتك! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400"
          >
            سجل دخول للمتابعة
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pr-10 pl-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pr-10 pl-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:from-slate-700 disabled:to-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-primary-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <LogIn className="group-hover:translate-x-1 transition-transform" size={20} />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/50 text-slate-500">أو</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-3">
              ليس لديك حساب؟
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors group"
            >
              <Sparkles className="group-hover:rotate-12 transition-transform" size={16} />
              إنشاء حساب جديد
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-slate-500 text-sm mt-6"
        >
          بالمتابعة، أنت توافق على{' '}
          <Link href="/terms" className="text-primary-400 hover:underline">
            الشروط والأحكام
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
