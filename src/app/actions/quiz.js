'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// --- Quiz Actions ---

export async function createQuiz(formData) {
    const supabase = await createClient()

    const title = formData.get('title')
    const description = formData.get('description')
    const course_id = formData.get('course_id')
    const time_limit_minutes = parseInt(formData.get('time_limit_minutes')) || 0
    const passing_score = parseInt(formData.get('passing_score')) || 70
    const is_published = formData.get('is_published') === 'on'

    const { error } = await supabase.from('quizzes').insert({
        title,
        description,
        course_id,
        time_limit_minutes,
        passing_score,
        is_published
    })

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
}

export async function updateQuiz(quizId, formData) {
    const supabase = await createClient()

    const title = formData.get('title')
    const description = formData.get('description')
    const time_limit_minutes = parseInt(formData.get('time_limit_minutes')) || 0
    const passing_score = parseInt(formData.get('passing_score')) || 70
    const is_published = formData.get('is_published') === 'on'

    const { error } = await supabase.from('quizzes').update({
        title,
        description,
        time_limit_minutes,
        passing_score,
        is_published
    }).eq('id', quizId)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
}

export async function deleteQuiz(quizId) {
    const supabase = await createClient()
    const { error } = await supabase.from('quizzes').delete().eq('id', quizId)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
}

// --- Question Actions ---

export async function addQuestion(formData) {
    const supabase = await createClient()

    const quiz_id = formData.get('quiz_id')
    const question_text = formData.get('question_text')
    const points = parseInt(formData.get('points')) || 10

    // Handle Options for MCQ
    const option1 = formData.get('option1')
    const option2 = formData.get('option2')
    const option3 = formData.get('option3')
    const option4 = formData.get('option4')
    const options = [option1, option2, option3, option4].filter(Boolean)

    const correct_answer = formData.get('correct_answer') // Should match one of the options

    const { error } = await supabase.from('quiz_questions').insert({
        quiz_id,
        question_text,
        question_type: 'mcq',
        options,
        correct_answer,
        points
    })

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
}

export async function deleteQuestion(questionId) {
    const supabase = await createClient()
    const { error } = await supabase.from('quiz_questions').delete().eq('id', questionId)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
}

// --- Student Actions ---

export async function getQuizQuestions(quizId) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('quiz_questions')
        .select('id, question_text, question_type, options, points, order')
        .eq('quiz_id', quizId)
        .order('order', { ascending: true })

    if (error) return { error: error.message }
    return { data }
}

export async function submitQuiz(quizId, answers) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // 1. Fetch correct answers and points
    const { data: questions, error: qError } = await supabase
        .from('quiz_questions')
        .select('id, correct_answer, points')
        .eq('quiz_id', quizId)

    if (qError) return { error: qError.message }

    // 2. Calculate Score
    let totalScore = 0
    let maxScore = 0

    questions.forEach(q => {
        maxScore += q.points
        if (answers[q.id] === q.correct_answer) {
            totalScore += q.points
        }
    })

    // 3. Check if passed
    const { data: quiz } = await supabase.from('quizzes').select('passing_score').eq('id', quizId).single()
    const percentage = (totalScore / maxScore) * 100
    const passed = percentage >= (quiz?.passing_score || 70)

    // 4. Save Attempt
    const { error: saveError } = await supabase.from('quiz_attempts').insert({
        user_id: user.id,
        quiz_id: quizId,
        score: totalScore,
        passed,
        answers,
        time_taken: answers.timeTaken || 0
    })

    if (saveError) return { error: saveError.message }

    revalidatePath(`/course`)
    return { success: true, score: totalScore, maxScore, passed, percentage }
}

export async function getQuizAttempts(quizId) {
    const supabase = await createClient()

    console.log('🔍 Fetching quiz attempts for quiz:', quizId)

    const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
            *,
            users (full_name, email)
        `)
        .eq('quiz_id', quizId)
        .order('started_at', { ascending: false })

    if (error) {
        console.error('❌ Error fetching quiz attempts:', error)
        return { error: error.message }
    }

    console.log(`✅ Found ${data?.length || 0} quiz attempts`)
    console.log('📊 Attempts data:', JSON.stringify(data, null, 2))

    return { data }
}
