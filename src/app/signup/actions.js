'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData) {
    const supabase = await createClient()

    const email = formData.get('email')
    const password = formData.get('password')
    const fullName = formData.get('full_name')

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    })

    if (authError) {
        return { error: authError.message }
    }

    // 2. Create User Profile
    if (authData.user) {
        const { error: profileError } = await supabase
            .from('users')
            .insert([
                {
                    id: authData.user.id,
                    email: email,
                    full_name: fullName,
                    role: 'student',
                }
            ])

        if (profileError) {
            console.error('Error creating user profile:', profileError)
            // We don't return error here to allow the user to proceed, 
            // but ideally this should be handled transactionally or via triggers.
        }
    }

    redirect('/dashboard')
}
