import { createClient } from '@/utils/supabase/server'
import LeaderboardUI from '@/components/LeaderboardUI'

export const revalidate = 60 // Update every minute

export default async function LeaderboardPage() {
  const supabase = await createClient()

  // 1. Get Top 10 Users from the View
  const { data: topUsers } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_score', { ascending: false })
    .limit(10)

  // 2. Get Current User
  const { data: { user } } = await supabase.auth.getUser()

  let userRank = null
  let currentUserProfile = null

  if (user) {
    // Get user profile for display
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    currentUserProfile = { ...user, ...profile }

    // Calculate Rank efficiently
    // Count how many users have a higher score than the current user
    if (currentUserProfile) {
      const { data: userScoreData } = await supabase
        .from('leaderboard')
        .select('total_score')
        .eq('user_id', user.id)
        .single()

      const myScore = userScoreData?.total_score || 0

      const { count } = await supabase
        .from('leaderboard')
        .select('*', { count: 'exact', head: true })
        .gt('total_score', myScore)

      userRank = (count || 0) + 1
    }
  }

  return (
    <LeaderboardUI
      topUsers={topUsers || []}
      currentUser={currentUserProfile}
      userRank={userRank}
    />
  )
}
