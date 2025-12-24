'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const supabase = createClient()

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/app/auth/callback?next=/update-password`,
      })

      if (error) throw error

      setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.')
    } catch (error) {
      setError(error.message || 'حدث خطأ ما')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          استعادة كلمة المرور
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleReset}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 text-sm text-red-700">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 text-sm text-green-700">
                {message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                العودة لتسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
