import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, Heart, LockKeyhole, FileText, Mic, Video, Play, Clock, Sparkles } from 'lucide-react'
import { BeneficiaryChat } from '@/components/chat/BeneficiaryChat'
import { AssetCard } from './AssetCard'
import { ExperienceWrapper } from './ExperienceWrapper'

interface PageProps {
    params: Promise<{ beneficiaryId: string }>
}

export default async function SharedBeneficiaryView({ params }: PageProps) {
    const beneficiaryId = (await params).beneficiaryId
    const supabase = await createClient()

    const { data: beneficiary, error: beneficiaryError } = await supabase.from('beneficiaries').select('*').eq('id', beneficiaryId).single()
    if (beneficiaryError || !beneficiary) return notFound()

    const { data: assetsData } = await supabase.from('assets').select('*').or(`beneficiary_id.eq.${beneficiaryId},is_global.eq.true`).order('created_at', { ascending: false })
    const { data: memories } = await supabase.from('memories').select('*').eq('beneficiary_id', beneficiaryId).order('created_at', { ascending: false })

    // Find and separate the AI Persona configuration from presentation assets
    let systemPersona = null;
    const assets = (assetsData || []).filter(asset => {
        if (asset.name === 'SYSTEM_AI_PERSONA') {
            try {
                systemPersona = JSON.parse(asset.instructions || '{}');
            } catch(e) {}
            return false;
        }
        return true;
    });

    return (
        <ExperienceWrapper beneficiaryName={beneficiary.name}>
            <div className="text-slate-900 font-sans pb-32 overflow-x-hidden">
                {/* Soft gradient background spanning entire view */}
                <div className="fixed top-0 left-0 right-0 h-[100dvh] bg-gradient-to-b from-white via-slate-50 to-blue-50/20 pointer-events-none -z-10" />

                {/* Minimal Header */}
                <div className="max-w-[700px] mx-auto px-6 py-10 flex items-center justify-between">
                    <Link href="/dashboard" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </Link>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <LockKeyhole className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Secure</span>
                    </div>
                </div>

                <main className="max-w-[700px] mx-auto px-6 py-8">
                    
                    {/* Intro */}
                    <div className="mb-24 text-center">
                        <h1 className="text-4xl md:text-[2.75rem] leading-tight font-serif text-slate-900 mb-6 tracking-tight">
                            Their Legacy
                        </h1>
                        <p className="text-lg text-slate-500 italic font-serif leading-relaxed max-w-lg mx-auto">
                            A curated digital memorial space holding the memories, stories, and final wishes meant for you.
                        </p>
                    </div>

                    {/* Section 1: AI Chat (Top Priority) */}
                    <div className="mb-24">
                        <BeneficiaryChat memories={memories || []} systemPersona={systemPersona} />
                    </div>

                    {/* Section 2: Personal Messages (Emotional Letters) */}
                    <div className="mb-32">
                        <div className="text-center mb-16">
                            <h2 className="text-[2rem] font-serif text-slate-900 tracking-tight">Letters for you</h2>
                            <div className="w-8 h-px bg-slate-200 mx-auto mt-6"></div>
                        </div>

                        {!memories || memories.length === 0 ? (
                            <div className="text-center">
                                <p className="text-lg text-slate-400 italic font-serif">"No messages have been preserved."</p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {memories.map(memory => {
                                    // Skip purely internal training prompts if designated type
                                    if (memory.optional_audio_url?.includes('ai-training')) return null;

                                    let meta = { type: 'text', media_url: null, duration: null };
                                    try {
                                        if (memory.optional_audio_url && memory.optional_audio_url.startsWith('{')) {
                                            meta = JSON.parse(memory.optional_audio_url);
                                        }
                                    } catch (e) {}

                                    const IconMap: Record<string, any> = { text: FileText, voice: Mic, video: Video };
                                    const TypeIcon = IconMap[meta.type] || FileText;
                                    const isMedia = meta.type === 'voice' || meta.type === 'video';

                                    return (
                                        <div key={memory.id} className="relative group p-10 md:p-14 bg-[#FCFBF9] backdrop-blur-sm rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.04)] transition-all duration-500">
                                            {/* Decorative Quote Mark */}
                                            <div className="absolute top-8 left-6 md:left-10 text-[60px] text-slate-200/50 font-serif leading-none select-none -z-0">
                                                ❝
                                            </div>
                                            
                                            <div className="relative z-10 w-full pl-2">
                                                {isMedia && (
                                                    <div className="mb-8 bg-white rounded-2xl p-4 flex items-center gap-5 border border-slate-100 shadow-sm max-w-sm hover:shadow-md transition-shadow cursor-default">
                                                        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform">
                                                            <Play className="w-5 h-5 fill-white ml-1 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                <span>{meta.type} Record</span>
                                                                <span className="font-mono">{meta.duration || '0:00'}</span>
                                                            </div>
                                                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="w-0 h-full bg-slate-900 rounded-full"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <p className="text-[1.3rem] md:text-[1.5rem] text-slate-700 whitespace-pre-wrap leading-[1.8] font-serif tracking-tight">
                                                    {memory.message}
                                                </p>
                                                
                                                <div className="mt-10 pt-6 border-t border-slate-100 flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                                        {new Date(memory.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Section 3: Important Instructions (Secondary, Collapsed by Default built via details/summary) */}
                    <div className="mb-12">
                        <details className="group/details">
                            <summary className="list-none flex items-center justify-between cursor-pointer p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <h2 className="text-xl font-serif text-slate-900 tracking-tight flex items-center gap-3">
                                        <LockKeyhole className="w-5 h-5 text-slate-400" /> Important Instructions
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1 max-w-sm font-sans">
                                        These were securely stored and can only be accessed by you. Click to expand.
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-full text-slate-400 group-open/details:rotate-180 transition-transform">
                                    <ArrowLeft className="w-4 h-4 -rotate-90" />
                                </div>
                            </summary>
                            
                            <div className="pt-8">
                                {!assets || assets.length === 0 ? (
                                    <div className="text-center py-6">
                                        <p className="text-[15px] text-slate-400 italic font-serif">"No secure instructions left behind."</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {assets.map(asset => (
                                            <AssetCard key={asset.id} asset={asset} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </details>
                    </div>

                </main>
            </div>
        </ExperienceWrapper>
    )
}
