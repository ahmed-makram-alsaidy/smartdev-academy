'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext({
  language: 'ar',
  isRtl: true,
  toggleLanguage: () => { },
  setLanguage: () => { }
})

export function LanguageProvider({ children }) {
  // اللغة الافتراضية هي العربية
  const [language, setLanguage] = useState('ar')
  const isRtl = language === 'ar'

  useEffect(() => {
    // محاولة قراءة اللغة المحفوظة في LocalStorage
    const savedLang = localStorage.getItem('app-language')
    if (savedLang) {
      setLanguage(savedLang)
    }
    // تحديث اتجاه الصفحة HTML
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = savedLang || 'ar'
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar'
    setLanguage(newLang)
    localStorage.setItem('app-language', newLang)
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLang
  }

  return (
    <LanguageContext.Provider value={{ language, isRtl, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
