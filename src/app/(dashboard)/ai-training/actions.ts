'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTrainingData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { responses: [], persona: null }

    const { data: memories } = await supabase.from('memories')
        .select('*')
        .eq('user_id', user.id)

    const { data: assets } = await supabase.from('assets')
        .select('*')
        .eq('user_id', user.id)
        .eq('name', 'SYSTEM_AI_PERSONA')
        .single()

    const responses = (memories || [])
        .filter(m => m.optional_audio_url && m.optional_audio_url.includes('ai-training'))
        .map(m => {
            let promptText = ''
            let answerText = m.message || ''
            
            if (m.message && m.message.startsWith('Prompt: ')) {
                const parts = m.message.split('\nAnswer: ')
                promptText = parts[0].replace('Prompt: ', '')
                answerText = parts[1] || ''
            } else {
                try {
                    promptText = JSON.parse(m.optional_audio_url).ai_training_prompt || ''
                } catch (e) {}
            }
            return { prompt: promptText, answer: answerText }
        })

    let persona = null
    if (assets && assets.instructions) {
        try {
            persona = JSON.parse(assets.instructions)
        } catch(e) {}
    }

    return { responses, persona }
}

export async function saveTrainingResponse(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const prompt = formData.get('prompt') as string
    const response = formData.get('response') as string

    if (!response.trim()) return;

    // We store this as a special "memory" assigned to all beneficiaries
    const message = `Prompt: ${prompt}\nAnswer: ${response}`
    const metadata = JSON.stringify({ type: 'ai-training', media_url: null })

    // Find all beneficiaries to assign this training memory
    const { data: bens } = await supabase.from('beneficiaries').select('id').eq('user_id', user.id)
    
    if (!bens || bens.length === 0) {
        throw new Error("You must add at least one beneficiary before training the AI, so the AI knows who it's talking to!")
    }

    const inserts = bens.map(b => ({
        user_id: user.id,
        beneficiary_id: b.id,
        message,
        optional_audio_url: metadata,
    }))

    const { error } = await supabase.from('memories').insert(inserts)

    if (error) {
        console.error('Error saving training data:', error)
        throw new Error('Failed to save training response')
    }

    revalidatePath('/ai-training')
    revalidatePath('/dashboard')
}

export async function savePersonaProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const tone = formData.get('tone') as string
    const style = formData.get('style') as string
    const values = formData.get('values') as string

    const profileData = JSON.stringify({ tone, style, values })

    const { data: existing } = await supabase.from('assets').select('id').eq('user_id', user.id).eq('name', 'SYSTEM_AI_PERSONA').single()
    
    if (existing) {
        await supabase.from('assets').update({ instructions: profileData }).eq('id', existing.id)
    } else {
        await supabase.from('assets').insert({
            user_id: user.id,
            name: 'SYSTEM_AI_PERSONA',
            description: 'Internal AI Configuration',
            instructions: profileData,
            is_global: true
        })
    }

    revalidatePath('/ai-training')
    revalidatePath('/shared')
}
