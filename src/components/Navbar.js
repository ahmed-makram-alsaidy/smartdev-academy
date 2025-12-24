'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogIn, GraduationCap, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  // Debug: log when user changes
  useEffect(() => {
    console.log('🔄 Navbar - User state changed:', user ? `✅ ${user.email} (${user.role})` : '❌ No user');
  }, [user]);

  const navLinks = useMemo(
    () => [
      { name: 'الرئيسية', href: '/' },
      { name: 'الدورات', href: '/courses' },
      { name: 'المدونة', href: '/blog' },
    ],
    []
  );

  const handleLogout = useCallback(async () => {
    await signOut();
    setUserMenuOpen(false);
  }, [signOut]);

  const isActive = useCallback((path) => pathname === path, [pathname]);

  // Show full navbar even during loading to prevent black screen
  const showNavbar = true;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white">SmartDev Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.href)
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600/10 border border-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white transition-all"
                  >
                    <LayoutDashboard size={18} />
                    <span className="text-sm font-medium">الإدارة</span>
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-xs font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">حسابي</span>
                    <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 top-full mt-2 w-64 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-white/10">
                            <p className="text-white font-medium text-sm">{user.email}</p>
                            <p className="text-slate-400 text-xs mt-1">{isAdmin ? 'مسؤول النظام' : 'طالب'}</p>
                          </div>
                          <div className="p-2">
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                            >
                              <User size={18} />
                              <span className="text-sm">لوحة التحكم</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <LogOut size={18} />
                              <span className="text-sm">تسجيل الخروج</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all ${isActive(link.href)
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-300 hover:bg-white/5'
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-yellow-600/10 border border-yellow-600/20 text-yellow-400"
                    >
                      <LayoutDashboard size={20} />
                      <span>لوحة تحكم المسؤول</span>
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-600/10 border border-primary-600/20 text-primary-400"
                  >
                    <User size={20} />
                    <span>لوحة التحكم</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
                  >
                    <LogOut size={20} />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-600 text-white font-bold"
                >
                  <LogIn size={20} />
                  <span>تسجيل الدخول</span>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
