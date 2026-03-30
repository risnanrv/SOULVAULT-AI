'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAsset(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const textInstructions = formData.get('instructions') as string
    const beneficiary_id = formData.get('beneficiary_id') as string // 'all' or specific id
    const asset_type = formData.get('asset_type') as string
    const sensitive_data_raw = formData.get('sensitive_data') as string

    const encryptedData = sensitive_data_raw ? `enc_v1_${Buffer.from(sensitive_data_raw).toString('base64')}` : ''
    const is_global = beneficiary_id === 'all'
    const actual_beneficiary_id = (beneficiary_id && beneficiary_id !== 'none' && !is_global) ? beneficiary_id : null

    const { error } = await supabase.from('assets').insert({
        user_id: user.id,
        name,
        description,
        instructions: textInstructions,
        asset_type: asset_type || 'Other',
        encrypted_data: encryptedData,
        is_global,
        beneficiary_id: actual_beneficiary_id,
    })

    if (error) {
        console.error('Error adding asset:', error)
        throw new Error('Failed to add asset')
    }

    revalidatePath('/vault')
    revalidatePath('/dashboard')
}

export async function updateAsset(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const textInstructions = formData.get('instructions') as string
    const beneficiary_id = formData.get('beneficiary_id') as string 
    const asset_type = formData.get('asset_type') as string
    const sensitive_data_raw = formData.get('sensitive_data') as string

    const is_global = beneficiary_id === 'all'
    const actual_beneficiary_id = (beneficiary_id && beneficiary_id !== 'none' && !is_global) ? beneficiary_id : null

    // We only update encrypted_data if a new value was provided, to prevent overwriting with nothing if they didn't change it.
    const updates: any = {
        name,
        description,
        instructions: textInstructions,
        asset_type: asset_type || 'Other',
        is_global,
        beneficiary_id: actual_beneficiary_id,
    }

    if (sensitive_data_raw && sensitive_data_raw.trim() !== '') {
        updates.encrypted_data = `enc_v1_${Buffer.from(sensitive_data_raw).toString('base64')}`
    }

    const { error } = await supabase.from('assets').update(updates).match({ id, user_id: user.id })

    if (error) {
        console.error('Error updating asset:', error)
        throw new Error('Failed to update asset')
    }

    revalidatePath('/vault')
    revalidatePath('/dashboard')
}

export async function deleteAsset(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    await supabase.from('assets').delete().match({ id, user_id: user.id })

    revalidatePath('/vault')
    revalidatePath('/dashboard')
}
