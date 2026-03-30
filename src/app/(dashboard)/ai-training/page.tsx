'use client'

import { useState, useEffect } from 'react'
import { BrainCircuit, Send, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { saveTrainingResponse, savePersonaProfile, getTrainingData } from './actions'

const TARGET_QUESTIONS = 5

export default function AITrainingPage() {
    const [responses, setResponses] = useState<{prompt: string, answer: string}[]>([])
    const [currentPrompt, setCurrentPrompt] = useState("Tell me about your favorite childhood memory.")
    const [draft, setDraft] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [isLoadingNext, setIsLoadingNext] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const [tone, setTone] = useState("Calm & Reassuring")
    const [style, setStyle] = useState("Storytelling")
    const [values, setValues] = useState("Family, Integrity, Resilience")
    const [isSavedPersona, setIsSavedPersona] = useState(false)
    const [isInitializing, setIsInitializing] = useState(true)

    useEffect(() => {
        let mounted = true
        getTrainingData().then(data => {
            if (!mounted) return
            
            if (data.persona) {
                setTone(data.persona.tone || "Calm & Reassuring")
                setStyle(data.persona.style || "Storytelling")
                setValues(data.persona.values || "Family, Integrity, Resilience")
            }
            if (data.responses && data.responses.length > 0) {
                setResponses(data.responses)
                setCurrentPrompt("What comes next to your mind?") // Generic prep prompt
            }
            setIsInitializing(false)
        })
        return () => { mounted = false }
    }, [])

    async function handleSaveChat(e: React.FormEvent) {
        e.preventDefault()
        if (!draft.trim()) return

        setIsSaving(true)
        setErrorMsg("")
        
        try {
            const formData = new FormData()
            formData.append('prompt', currentPrompt)
            formData.append('response', draft)
            await saveTrainingResponse(formData)
            
            const updatedResponses = [...responses, { prompt: currentPrompt, answer: draft }]
            setResponses(updatedResponses)
            setDraft("")
            
            if (updatedResponses.length < TARGET_QUESTIONS) {
                setIsLoadingNext(true)
                try {
                    const res = await fetch('/api/generate-question', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ responses: updatedResponses })
                    })
                    const data = await res.json()
                    if (data.question) {
                        setCurrentPrompt(data.question.replace(/^Q:\s*|question:\s*/i, '').trim())
                    }
                } catch (err) {
                    // Fallback question if API fails
                    setCurrentPrompt("What is a piece of advice you'd like to pass down?")
                }
                setIsLoadingNext(false)
            }
        } catch (err: any) {
            setErrorMsg(err.message || "Failed to save response.")
        } finally {
            setIsSaving(false)
        }
    }

    async function handleSavePersona(e: React.FormEvent) {
        e.preventDefault()
        setIsSavedPersona(false)
        try {
            const formData = new FormData()
            formData.append('tone', tone)
            formData.append('style', style)
            formData.append('values', values)
            await savePersonaProfile(formData)
            setIsSavedPersona(true)
            setTimeout(() => setIsSavedPersona(false), 3000)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold mb-4 shadow-sm">
                    <Sparkles className="w-4 h-4" /> AI Persona Builder
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Define Your Legacy AI</h1>
                <p className="text-slate-500 mt-2 max-w-2xl text-lg">
                    Design how your AI should communicate with your loved ones, and teach it the stories that matter most.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Persona Definition Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -z-0 pointer-events-none" />
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-6 relative z-10">
                            <SlidersHorizontal className="w-5 h-5 text-indigo-500" /> Define Your Personality
                        </h3>
                        
                        <form onSubmit={handleSavePersona} className="space-y-5 relative z-10">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Primary Tone</label>
                                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer">
                                    <option>Emotional & Loving</option>
                                    <option>Calm & Reassuring</option>
                                    <option>Strict but Caring</option>
                                    <option>Humorous & Lighthearted</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Speaking Style</label>
                                <select value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer">
                                    <option>Direct & Short</option>
                                    <option>Storytelling</option>
                                    <option>Philosophical & Advisory</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Core Values (Comma Separated)</label>
                                <input type="text" value={values} onChange={e => setValues(e.target.value)} placeholder="e.g. Family, Hard work, Faith" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                {isSavedPersona ? <CheckCircle2 className="w-4 h-4" /> : "Save Profile"}
                            </button>
                        </form>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-indigo-700 relative overflow-hidden group">
                        <div className="absolute top-5 right-5 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-400/30 transition-colors pointer-events-none" />
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
                            <BrainCircuit className="w-5 h-5 text-indigo-400" /> Teaching Progress
                        </h3>
                        <div className="w-full bg-indigo-950/50 text-indigo-200 rounded-full h-2.5 mb-2 overflow-hidden relative z-10 border border-indigo-800">
                            <motion.div 
                                className="bg-blue-400 h-2.5 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${Math.min((responses.length / TARGET_QUESTIONS) * 100, 100)}%` }}
                                transition={{ duration: 1 }}
                            ></motion.div>
                        </div>
                        <p className="text-sm text-indigo-200 font-medium relative z-10">
                            {responses.length} / {TARGET_QUESTIONS} AI Foundation Modules Complete
                        </p>
                    </div>
                </div>

                {/* Legacy Context Chat */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
                        <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 transition-colors"></div>
                                <BrainCircuit className="w-6 h-6 text-white relative z-10" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 leading-tight">Dynamic Legacy Context</h3>
                                <p className="text-xs font-medium text-emerald-600 flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Generative Intelligence Active
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50/50 relative scroll-smooth">
                            {isInitializing ? (
                                <div className="flex justify-center py-20">
                                    <span className="animate-pulse text-indigo-400 font-bold">Synchronizing Legacy Memory...</span>
                                </div>
                            ) : (
                            <>
                                {/* Intro message */}
                                <div className="flex gap-4 max-w-[85%]">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm border border-indigo-200/50">
                                        <BrainCircuit className="w-5 h-5" />
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-sm p-5 shadow-sm">
                                        <p className="text-slate-700 leading-relaxed font-medium">Hello. I am dynamically adapting to your stories to learn perfectly how to represent you. Let's begin.</p>
                                    </div>
                                </div>

                            {responses.map((item, idx) => (
                                <div key={idx} className="space-y-8">
                                    <div className="flex gap-4 max-w-[85%]">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm border border-indigo-200/50">
                                            <BrainCircuit className="w-5 h-5" />
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-sm p-5 shadow-sm">
                                            <p className="text-slate-800 font-medium leading-relaxed">{item.prompt}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 max-w-[85%] ml-auto justify-end">
                                        <div className="bg-indigo-600 text-white rounded-3xl rounded-tr-sm p-5 shadow-md border border-indigo-700">
                                            <p className="whitespace-pre-wrap leading-relaxed">{item.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoadingNext && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex gap-4 max-w-[85%]"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                                        <BrainCircuit className="w-5 h-5" />
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-sm p-5 shadow-sm flex items-center gap-1.5 h-14 w-24 justify-center">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </motion.div>
                            )}

                            {responses.length < TARGET_QUESTIONS && !isLoadingNext && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-4 max-w-[85%]"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm border border-indigo-200/50">
                                        <BrainCircuit className="w-5 h-5" />
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-sm p-5 shadow-sm relative overflow-hidden">
                                        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-indigo-400 to-blue-400"></div>
                                        <p className="text-slate-800 font-medium pl-2 leading-relaxed">{currentPrompt}</p>
                                    </div>
                                </motion.div>
                            )}
                            
                            {responses.length >= TARGET_QUESTIONS && (
                                <div className="flex justify-center my-12">
                                    <div className="bg-emerald-50 text-emerald-700 px-8 py-4 rounded-full border border-emerald-200 flex items-center gap-3 font-bold shadow-sm">
                                        <CheckCircle2 className="w-6 h-6" /> Foundation Module Complete!
                                    </div>
                                </div>
                            )}
                            
                            {errorMsg && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 text-center mx-auto max-w-sm">
                                    {errorMsg}
                                </div>
                            )}
                            </>
                            )}
                        </div>

                        {responses.length < TARGET_QUESTIONS && (
                            <div className="p-5 bg-white border-t border-slate-100 pointer-events-auto">
                                <form onSubmit={handleSaveChat} className="flex gap-4">
                                    <textarea 
                                        value={draft}
                                        onChange={e => setDraft(e.target.value)}
                                        placeholder="Record your thoughts here..." 
                                        className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner leading-relaxed text-sm font-medium"
                                        rows={3}
                                        disabled={isSaving || isLoadingNext}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={isSaving || isLoadingNext || !draft.trim()}
                                        className="bg-indigo-600 text-white rounded-2xl px-8 font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center self-end h-14"
                                    >
                                        {isSaving ? <span className="animate-pulse">Saving...</span> : <Send className="w-6 h-6" />}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
