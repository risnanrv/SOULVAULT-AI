'use server'

import { redirect } from 'next/navigation'

export async function beneficiaryLogin(formData: FormData) {
    const email = formData.get('email') as string;
    const accessCode = formData.get('accessCode') as string;

    // Simulate validation
    if (!email || !accessCode) {
        redirect('/beneficiary-login?errorMessage=Please provide both email and access code.')
    }

    if (accessCode.length < 6) {
        redirect('/beneficiary-login?errorMessage=Invalid access code format. It should be at least 6 characters.')
    }

    // Simulate login success and redirect to a dummy beneficiary shared view
    redirect('/shared/demo-beneficiary-123')
}
