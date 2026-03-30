import { beneficiaryLogin } from './actions'
import Link from 'next/link'

export default async function BeneficiaryLoginPage({ searchParams }: { searchParams: Promise<{ errorMessage?: string }> }) {
    const resolvedParams = await searchParams;
    const errorMessage = resolvedParams?.errorMessage;

    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background elements to match new styling */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-50/60 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-rose-50/60 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Beneficiary Access</h1>
                    <p className="text-sm text-slate-500 mt-2">Enter the credentials provided in your email.</p>
                </div>

                <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="accessCode" className="text-sm font-medium text-slate-700">Access Code / Password</label>
                        <input
                            id="accessCode"
                            name="accessCode"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                        />
                    </div>

                    {errorMessage && (
                        <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-100 rounded-lg">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mt-4">
                        <button formAction={beneficiaryLogin} className="w-full bg-purple-600 text-white font-medium py-2.5 rounded-lg hover:bg-purple-700 transition-colors shadow-sm cursor-pointer border border-transparent">
                            Access Vault
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-4 border-t border-slate-100 text-center">
                    <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                        Return to Main Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
