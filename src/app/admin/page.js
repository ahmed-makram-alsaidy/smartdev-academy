import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()

  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Role Check (Must be 'admin')
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    // If logged in but not admin, go to normal dashboard
    redirect('/dashboard')
  }

  // 3. Fetch Initial Admin Data (Optional optimization)

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="min-h-screen">
        {/* We pass the user prop if needed by the component */}
        <AdminDashboard user={user} />
      </main>
    </div>
  )
}
