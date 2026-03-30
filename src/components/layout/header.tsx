import { logout } from '@/app/login/actions'

export function Header({ email }: { email: string | undefined }) {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 sticky top-0 z-10">
            <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-slate-600">{email}</span>
                <form action={logout}>
                    <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        Log out
                    </button>
                </form>
            </div>
        </header>
    )
}
