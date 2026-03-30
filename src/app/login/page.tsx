import { login, signup } from './actions'
import Link from 'next/link'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ errorMessage?: string }> }) {
    const resolvedParams = await searchParams;
    const errorMessage = resolvedParams?.errorMessage;

    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SoulVault AI</h1>
                    <p className="text-sm text-slate-500 mt-2">Secure your digital legacy.</p>
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
                            className="px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-colors"
                        />
                    </div>

                    {errorMessage && (
                        <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-100 rounded-lg">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mt-4">
                        <button formAction={login} className="w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
                            Sign In
                        </button>
                        <button formAction={signup} className="w-full bg-white text-slate-800 font-medium border border-slate-200 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                            Create Account
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-4 border-t border-slate-100 text-center">
                    <Link href="/beneficiary-login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                        Are you a beneficiary? Login here.
                    </Link>
                </div>
            </div>
        </div>
    )
}
