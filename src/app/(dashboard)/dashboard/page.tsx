import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Shield, Users, BookOpen, ArrowRight, CheckCircle2, Circle, Sparkles, BrainCircuit, Activity } from 'lucide-react'
import { PageTransition, StaggerChildren, StaggerItem } from '@/components/PageTransition'
import { FutureShowcase } from '@/components/FutureShowcase'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Execute count queries concurrently
    const [
        { count: assetsCount },
        { count: beneficiariesCount },
        { count: memoriesCount }
    ] = await Promise.all([
        supabase.from('assets').select('*', { count: 'exact', head: true }),
        supabase.from('beneficiaries').select('*', { count: 'exact', head: true }),
        supabase.from('memories').select('*', { count: 'exact', head: true }),
    ])

    // Fetch some recent data for previews
    const { data: allMemories } = await supabase
        .from('memories')
        .select('id, message, created_at, optional_audio_url')
        .order('created_at', { ascending: false })
        
    const recentMemories = allMemories?.filter(m => !m.optional_audio_url?.includes('ai-training')).slice(0, 3) || []

    const { data: recentBeneficiaries } = await supabase
        .from('beneficiaries')
        .select('id, name, relationship')
        .order('created_at', { ascending: false })
        .limit(3)

    const assets = Number(assetsCount) || 0;
    const beneficiaries = Number(beneficiariesCount) || 0;
    const memories = Number(memoriesCount) || 0;

    // Calculate Legacy Score (Mock logic)
    // 20 points for 1st asset, 20 points for 1st beneficiary, 20 points for 1st memory
    // + extra for more
    let score = 0;
    if (assets > 0) score += 20 + Math.min(10, (assets - 1) * 2);
    if (beneficiaries > 0) score += 20 + Math.min(10, (beneficiaries - 1) * 2);
    if (memories > 0) score += 20 + Math.min(10, (memories - 1) * 2);
    // Max 100
    const legacyScore = Math.min(100, score);

    const checklist = [
        { id: 1, label: 'Add your first digital asset', done: assets > 0, href: '/vault' },
        { id: 2, label: 'Assign a beneficiary', done: beneficiaries > 0, href: '/beneficiaries' },
        { id: 3, label: 'Record a memory', done: memories > 0, href: '/memories' },
        { id: 4, label: 'Train your AI Legacy', done: false, href: '/ai-training' }, // New feature
    ]

    const completedTasks = checklist.filter(c => c.done).length;
    const progressPercent = Math.round((completedTasks / checklist.length) * 100);

    return (
        <PageTransition>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">An overview of your digital legacy.</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-3">
                        {memories > 0 && (
                            <p className="text-rose-500 text-sm font-medium flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4" /> You've preserved {memories} memories
                            </p>
                        )}
                        {beneficiaries > 0 && (
                            <p className="text-purple-600 text-sm font-medium flex items-center gap-1.5">
                                <Users className="w-4 h-4" /> {beneficiaries} people will receive your legacy
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                            {legacyScore}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Legacy Score</p>
                            <p className="text-sm font-medium text-slate-900">{legacyScore === 100 ? 'Exceptional' : legacyScore > 50 ? 'Growing' : 'Getting Started'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StaggerItem className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-start gap-4 transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold tracking-wide uppercase text-slate-400">Digital Assets</p>
                        <h3 className="text-4xl font-extrabold text-slate-900 mt-1">{assets}</h3>
                    </div>
                </StaggerItem>

                <StaggerItem className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-start gap-4 transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold tracking-wide uppercase text-slate-400">Beneficiaries</p>
                        <h3 className="text-4xl font-extrabold text-slate-900 mt-1">{beneficiaries}</h3>
                    </div>
                </StaggerItem>

                <StaggerItem className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-start gap-4 transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold tracking-wide uppercase text-slate-400">Memories</p>
                        <h3 className="text-4xl font-extrabold text-slate-900 mt-1">{memories}</h3>
                    </div>
                </StaggerItem>
            </StaggerChildren>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Checklist & AI Progress */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Checklist */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900">Complete Your Legacy</h3>
                            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <div className="space-y-3">
                            {checklist.map(item => (
                                <Link href={item.href} key={item.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg group transition-colors">
                                    {item.done ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    )}
                                    <span className={`text-sm font-medium ${item.done ? 'text-slate-500 line-through' : 'text-slate-700 group-hover:text-blue-600'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* AI Training Progress */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <BrainCircuit className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="font-bold">AI Persona</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Train your AI to answer questions and share advice exactly how you would.
                        </p>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-slate-400 font-medium">Training Data</span>
                            <span className="text-xs font-bold text-blue-400">0%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6">
                            <div className="bg-blue-500 h-full rounded-full w-0"></div>
                        </div>
                        <Link href="/ai-training" className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <Activity className="w-4 h-4" /> Start Training
                        </Link>
                    </div>
                </div>

                {/* Right Column: Recent Previews & Beneficiaries */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Memories & Beneficiaries Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Memories */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-900">Recent Memories</h3>
                                <Link href="/memories" className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</Link>
                            </div>
                            {recentMemories && recentMemories.length > 0 ? (
                                <div className="space-y-4">
                                    {recentMemories.map(memory => (
                                        <div key={memory.id} className="flex flex-col gap-1 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                            <span className="font-medium text-sm text-slate-900 line-clamp-1">{memory.message}</span>
                                            <span className="text-xs text-slate-500">{new Date(memory.created_at).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <BookOpen className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500">No memories recorded yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Recent Beneficiaries */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-900">Your Beneficiaries</h3>
                                <Link href="/beneficiaries" className="text-xs font-bold text-blue-600 hover:text-blue-700">Manage</Link>
                            </div>
                            {recentBeneficiaries && recentBeneficiaries.length > 0 ? (
                                <div className="space-y-4">
                                    {recentBeneficiaries.map(ben => {
                                    let displayRelation = ben.relationship || 'No relation specified'
                                    if (displayRelation.startsWith('{')) {
                                        try {
                                            const p = JSON.parse(displayRelation)
                                            displayRelation = p.relation || p.Relation || p.RELATION || 'Unknown'
                                        } catch(e) {}
                                    }
                                    return (
                                        <div key={ben.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs uppercase">
                                                {ben.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-slate-900">{ben.name}</p>
                                                <p className="text-xs text-slate-500 capitalize">{displayRelation}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500">No beneficiaries added.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Simulation Settings Banner */}
                    <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-bold text-slate-900">Simulation Settings</h3>
                            </div>
                            <p className="text-sm text-slate-600 max-w-lg">
                                Your vault will automatically unlock for beneficiaries after a period of verified inactivity. Preview how this looks.
                            </p>
                        </div>
                        <Link href="/simulation" className="whitespace-nowrap px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                            Configure Flow
                        </Link>
                    </div>
                </div>
            </div>

            <FutureShowcase />

        </PageTransition>
    )
}
