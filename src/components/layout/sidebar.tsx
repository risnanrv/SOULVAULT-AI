'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Shield, Users, BookOpen, Activity, BrainCircuit } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Vault', href: '/vault', icon: Shield },
    { name: 'Beneficiaries', href: '/beneficiaries', icon: Users },
    { name: 'Memories', href: '/memories', icon: BookOpen },
    { name: 'AI Training', href: '/ai-training', icon: BrainCircuit },
    { name: 'Simulation', href: '/simulation', icon: Activity },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
            <div className="p-6">
                {/* We can hide the text behind a logo later, for now we will show text */}
                <h2 className="text-xl font-bold tracking-tight text-slate-900">SoulVault AI</h2>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            )}
                        >
                            <item.icon className={cn('w-5 h-5', isActive ? 'text-slate-900' : 'text-slate-400')} />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
