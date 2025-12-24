import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SmartDev Academy",
  description: "أكاديمية تعليم البرمجة",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <LanguageProvider>
              <Navbar />
              {/* إضافة min-h-screen لضمان أن الخلفية تغطي كامل الشاشة */}
              <main className="min-h-screen">
                {children}
              </main>
            </LanguageProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
