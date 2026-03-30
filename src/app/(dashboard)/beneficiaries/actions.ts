'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addBeneficiary(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const relationship = formData.get('relationship') as string
    const phone = formData.get('phone') as string
    const access_level = formData.get('access_level') as string
    const is_primary = formData.get('is_primary') === 'true'

    const { error } = await supabase.from('beneficiaries').insert({
        user_id: user.id,
        name,
        email,
        relationship,
        phone,
        access_level,
        is_primary
    })

    if (error) {
        console.error('Error adding beneficiary:', error)
        throw new Error('Failed to add beneficiary')
    }

    revalidatePath('/beneficiaries')
    revalidatePath('/dashboard')
    revalidatePath('/vault')
    revalidatePath('/memories')
}

export async function updateBeneficiary(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const relationship = formData.get('relationship') as string
    const phone = formData.get('phone') as string
    const access_level = formData.get('access_level') as string
    const is_primary = formData.get('is_primary') === 'true'

    const { error } = await supabase.from('beneficiaries').update({
        name,
        email,
        relationship,
        phone,
        access_level,
        is_primary
    }).match({ id, user_id: user.id })

    if (error) {
        console.error('Error updating beneficiary:', error)
        throw new Error('Failed to update beneficiary')
    }

    revalidatePath('/beneficiaries')
    revalidatePath('/dashboard')
    revalidatePath('/vault')
    revalidatePath('/memories')
}

export async function deleteBeneficiary(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    await supabase.from('beneficiaries').delete().match({ id, user_id: user.id })

    revalidatePath('/beneficiaries')
    revalidatePath('/dashboard')
    revalidatePath('/vault')
    revalidatePath('/memories')
}
