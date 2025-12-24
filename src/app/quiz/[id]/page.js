import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import QuizPlayer from '@/components/QuizPlayer'
import { ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function QuizPage({ params }) {
    const supabase = await createClient()
    const { id } = params

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect(`/login?next=/quiz/${id}`)

    // 2. Get Quiz Details
    const { data: quiz, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !quiz) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">الاختبار غير موجود</h1>
                    <Link href="/dashboard" className="text-blue-500 hover:text-blue-400">
                        العودة للوحة التحكم
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
                        <ChevronRight size={20} className="rotate-180" /> العودة للوحة التحكم
                    </Link>
                </div>

                <QuizPlayer quiz={quiz} user={user} />
            </div>
        </div>
    )
}
