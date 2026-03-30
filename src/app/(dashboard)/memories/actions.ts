'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMemory(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const message = formData.get('message') as string
    const beneficiary_id = formData.get('beneficiary_id') as string // can be 'all'
    const type = formData.get('type') as string

    // Validate beneficiary
    if (!beneficiary_id || beneficiary_id === 'none') {
        throw new Error('A memory must be assigned to at least one beneficiary')
    }

    const scheduled_date = formData.get('scheduled_date') as string
    
    // Mock media storage via JSON in optional_audio_url
    const metadata = JSON.stringify({
        type: type || 'text',
        media_url: type !== 'text' ? 'https://demo.soulvault.ai/mock-stream' : null,
        duration: type !== 'text' ? '2:45' : null,
        scheduled_date: scheduled_date || null
    })

    let targetBeneficiaryIds: string[] = []

    if (beneficiary_id === 'all') {
        const { data: bens } = await supabase.from('beneficiaries').select('id').eq('user_id', user.id)
        if (bens && bens.length > 0) {
            targetBeneficiaryIds = bens.map(b => b.id)
        } else {
            throw new Error('No beneficiaries found to assign to.')
        }
    } else {
        targetBeneficiaryIds = [beneficiary_id]
    }

    const inserts = targetBeneficiaryIds.map(id => ({
        user_id: user.id,
        beneficiary_id: id,
        message,
        optional_audio_url: metadata,
    }))

    const { error } = await supabase.from('memories').insert(inserts)

    if (error) {
        console.error('Error adding memory:', error)
        throw new Error('Failed to add memory')
    }

    revalidatePath('/memories')
    revalidatePath('/dashboard')
    revalidatePath('/beneficiaries')
}

export async function deleteMemory(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    await supabase.from('memories').delete().match({ id, user_id: user.id })

    revalidatePath('/memories')
    revalidatePath('/dashboard')
    revalidatePath('/beneficiaries')
}
