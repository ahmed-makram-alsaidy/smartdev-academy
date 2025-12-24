'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Loader2, Eye, EyeOff, GraduationCap, CheckCircle } from 'lucide-react';
import { signup } from './actions';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('full_name', formData.fullName);

    const result = await signup(formDataToSend);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Success handled by server action redirect
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: '', color: '' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, text: 'ضعيفة', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 66, text: 'متوسطة', color: 'bg-yellow-500' };
    return { strength: 100, text: 'قوية', color: 'bg-green-500' };
  };

  const passStrength = passwordStrength();

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
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
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-600 via-purple-600 to-secondary-600 flex items-center justify-center shadow-xl shadow-primary-500/30"
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-black text-white mb-2"
          >
            ابدأ رحلتك معنا! 🚀
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400"
          >
            أنشئ حسابك المجاني الآن
          </motion.p>
        </div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pr-10 pl-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="أحمد محمد"
                />
              </div>
            </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">قوة كلمة المرور:</span>
                    <span className={`text-xs font-medium ${passStrength.strength === 100 ? 'text-green-400' :
                      passStrength.strength === 66 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                      {passStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${passStrength.color}`}
                      style={{ width: `${passStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pr-10 pl-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {/* Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400">كلمات المرور متطابقة</span>
                    </>
                  ) : (
                    <span className="text-xs text-red-400">كلمات المرور غير متطابقة</span>
                  )}
                </div>
              )}
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
              className="w-full bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 hover:from-primary-500 hover:via-purple-500 hover:to-secondary-500 disabled:from-slate-700 disabled:to-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  جاري إنشاء الحساب...
                </>
              ) : (
                <>
                  <UserPlus className="group-hover:scale-110 transition-transform" size={20} />
                  إنشاء الحساب
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-3">
              لديك حساب بالفعل؟
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              تسجيل الدخول
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
          بإنشاء حساب، أنت توافق على{' '}
          <Link href="/terms" className="text-primary-400 hover:underline">
            الشروط والأحكام
          </Link>
          {' '}و{' '}
          <Link href="/privacy" className="text-primary-400 hover:underline">
            سياسة الخصوصية
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
