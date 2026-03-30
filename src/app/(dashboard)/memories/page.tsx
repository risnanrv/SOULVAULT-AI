import { createClient } from '@/utils/supabase/server'
import { addMemory, deleteMemory } from './actions'
import { BookOpen, Trash2, Heart, Mic, Video, Users, FileText, Play, Clock, Calendar, Sparkles } from 'lucide-react'
import { PageTransition, StaggerChildren, StaggerItem } from '@/components/PageTransition'

export default async function MemoriesPage() {
    const supabase = await createClient()
    const { data: memories } = await supabase.from('memories').select('*, beneficiaries (name, relationship, phone, access_level)').order('created_at', { ascending: false })
    const { data: beneficiaries } = await supabase.from('beneficiaries').select('id, name')

    return (
        <PageTransition>
            <div className="mb-8 relative">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Memories</h1>
                <p className="text-slate-500 mt-1 max-w-2xl">Leave personal messages, voice recordings, and video stories for your loved ones.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                <div className="lg:col-span-1 border-r border-slate-100 lg:pr-8">
                    <div className="sticky top-24">
                        <h3 className="text-lg font-bold text-slate-900 mb-5">Record New Memory</h3>
                        <form action={addMemory} className="flex flex-col gap-5">

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Memory Type</label>
                                <select name="type" className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow text-slate-700 font-medium shadow-sm appearance-none cursor-pointer">
                                    <option value="text">Text (Written Letter)</option>
                                    <option value="voice">Voice Recording (Coming soon)</option>
                                    <option value="video">Video Message (Coming soon)</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">For Whom?</label>
                                <select name="beneficiary_id" required className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow text-slate-700 font-medium shadow-sm appearance-none cursor-pointer">
                                    <option value="">-- Select Beneficiary --</option>
                                    <option value="all">Everyone (All Beneficiaries)</option>
                                    {beneficiaries?.map(b => (
                                        <option key={b.id} value={b.id}>Specific: {b.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 flex justify-between">
                                    <span>Transcript / Message</span>
                                </label>
                                <textarea name="message" required placeholder="Share a story, feeling, or final words... If uploading media, provide context here." rows={5} className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none shadow-sm text-sm" />
                            </div>

                            <div className="flex flex-col gap-1.5 p-4 bg-gradient-to-br from-rose-50 to-white border border-rose-100 rounded-xl shadow-sm">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-1">
                                    <Calendar className="w-3.5 h-3.5 text-rose-500" /> Scheduled Delivery (Optional)
                                    <span className="bg-rose-500 text-white px-2 py-0.5 rounded font-bold text-[8px] tracking-widest uppercase shadow-[0_0_10px_rgba(244,63,94,0.3)] flex items-center gap-1 animate-pulse">
                                        <Sparkles className="w-2.5 h-2.5" /> WOW Feature
                                    </span>
                                </label>
                                <p className="text-[11px] text-slate-500 font-medium mb-3 leading-relaxed">
                                    Want to send a message to your daughter on her wedding day? Set a date below to temporarily lock this memory from beneficiaries until the exact day you specify.
                                </p>
                                <input type="date" name="scheduled_date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-inner text-sm font-medium text-slate-700" />
                            </div>

                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700 leading-relaxed font-medium">
                                <span className="font-bold flex items-center gap-1.5 mb-1"><Mic className="w-3.5 h-3.5" /> Note:</span>
                                Selecting Voice or Video will attach a simulated media recording to this memory. Real media uploads will be available soon.
                            </div>

                            <button type="submit" className="mt-2 w-full bg-rose-600 text-white font-bold py-3.5 rounded-xl hover:bg-rose-700 transition-all hover:shadow-lg hover:-translate-y-0.5 border border-transparent shadow-md flex items-center justify-center gap-2">
                                <Heart className="w-4 h-4" /> Save Memory
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4 pt-4 lg:pt-0">
                    {!memories?.length ? (
                        <div className="bg-slate-50 p-12 rounded-3xl border border-dashed border-slate-300 text-center flex flex-col justify-center items-center">
                            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No messages yet.</h3>
                            <p className="text-slate-500 max-w-sm">Leave something meaningful. Your voice, face, and words will matter immensely.</p>
                        </div>
                    ) : (
                        <StaggerChildren className="space-y-6">
                            {memories.map(memory => {
                                let meta: any = { type: 'text', media_url: null, duration: null, scheduled_date: null };
                                try {
                                    if (memory.optional_audio_url && memory.optional_audio_url.startsWith('{')) {
                                        meta = JSON.parse(memory.optional_audio_url);
                                    }
                                } catch (e) {}

                                const IconMap: Record<string, any> = {
                                    text: FileText,
                                    voice: Mic,
                                    video: Video
                                };
                                const TypeIcon = IconMap[meta.type] || FileText;
                                const isMedia = meta.type === 'voice' || meta.type === 'video';

                                // Format the beneficiary data beautifully
                                let benDetails = [];
                                if (memory.beneficiaries) {
                                    let rawRel = memory.beneficiaries.relationship || '';
                                    if (rawRel.startsWith('{')) {
                                        try {
                                            const p = JSON.parse(rawRel);
                                            rawRel = p.relation || p.Relation || p.RELATION || '';
                                        } catch(e) {}
                                    }
                                    if (rawRel) benDetails.push(rawRel);
                                    if (memory.beneficiaries.phone) benDetails.push(memory.beneficiaries.phone);
                                    if (memory.beneficiaries.access_level) benDetails.push(memory.beneficiaries.access_level === 'full' ? 'Full Access' : 'Limited Access');
                                }
                                const cleanBenInfo = benDetails.length > 0 ? benDetails.join(' • ') : 'Relation Unknown';

                                return (
                                    <StaggerItem key={memory.id} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 justify-between transition-all hover:shadow-md hover:border-rose-100 group relative overflow-hidden">
                                        <span className="absolute -top-4 -left-2 text-[12rem] text-slate-50/50 font-serif leading-none select-none transition-colors group-hover:text-rose-50/50 -z-0">"</span>
                                        <div className="flex items-start gap-5 relative z-10 w-full">
                                            <div className="p-3 bg-rose-50 border border-slate-100 text-rose-500 rounded-xl shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors shadow-sm">
                                                <TypeIcon className="w-6 h-6" />
                                            </div>
                                            <div className="w-full">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                                    <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                        To: {memory.beneficiaries?.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                                                            {cleanBenInfo}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                                                            <TypeIcon className="w-3 h-3" /> {meta.type}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isMedia && (
                                                    <div className="mb-5 bg-slate-900 rounded-xl p-4 flex items-center gap-4 text-white hover:bg-slate-800 transition-colors cursor-pointer group/player border border-slate-800">
                                                        <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center shrink-0 group-hover/player:scale-110 transition-transform">
                                                            <Play className="w-5 h-5 fill-white ml-0.5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                                <div className="w-1/3 h-full bg-rose-500 rounded-full"></div>
                                                            </div>
                                                            <div className="flex justify-between items-center mt-2 text-xs font-mono text-slate-400">
                                                                <span>0:45</span>
                                                                <span>{meta.duration || '2:45'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                                        {isMedia ? 'Transcript / Notes' : 'Message'}
                                                    </p>
                                                    <p className="text-[15px] text-slate-700 whitespace-pre-wrap italic leading-relaxed font-serif">
                                                        "{memory.message}"
                                                    </p>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(memory.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>

                                                    {meta.scheduled_date && (
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 shadow-sm">
                                                            <Calendar className="w-3 h-3" />
                                                            Unlocks: {new Date(meta.scheduled_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <form action={deleteMemory.bind(null, memory.id)} className="shrink-0 relative z-10 pt-1">
                                            <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete Memory">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </StaggerItem>
                                )
                            })}
                        </StaggerChildren>
                    )}
                </div>
            </div>
        </PageTransition>
    )
}
