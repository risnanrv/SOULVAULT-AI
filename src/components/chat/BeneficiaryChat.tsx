'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Settings2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
    role: 'user' | 'ai'
    content: string
}

const LANGUAGES = ['English', 'Spanish', 'French', 'Mandarin', 'Hindi']

export function BeneficiaryChat({ memories, systemPersona }: { memories: any[], systemPersona: any }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [language, setLanguage] = useState('English')

    const scrollRef = useRef<HTMLDivElement>(null)

    // Initial greeting trigger
    useEffect(() => {
        let mounted = true
        const startGreeting = async () => {
            setIsLoading(true)
            await new Promise(r => setTimeout(r, 1500))
            // Dynamic first message based on memories presence
            const firstMsgStr = memories.length > 0
                ? "I remember you... I'm glad you're here."
                : "Hello. I am here to share my memories with you.";
                
            if (mounted) {
                setMessages([{ role: 'ai', content: firstMsgStr }])
                setIsLoading(false)
            }
        }
        startGreeting()
        return () => { mounted = false }
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages, isLoading])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            const personaConfig = {
                ...systemPersona,
                language
            }

            const chatHistory = messages.slice(-10);

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, history: chatHistory, memories, personaConfig }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to fetch')

            setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble recalling right now... Give me a moment." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-[500px] relative border-0 bg-gradient-to-b from-white to-[#F8F9FF]">
            
            {/* Soft Header */}
            <div className="px-8 py-6 flex items-center justify-between z-20 bg-transparent border-b border-indigo-50/50">
                <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-serif text-slate-900 tracking-tight leading-tight">Talk to them</h3>
                    <p className="text-[13px] font-sans text-slate-500 relative bg-white/0 font-medium tracking-wide">
                        Have a conversation with the memories they left for you.
                    </p>
                </div>
                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-3 rounded-full text-slate-400 hover:bg-slate-50 transition-colors shadow-sm bg-white border border-slate-100 hidden" // Hide settings for purity
                >
                    <Settings2 className="w-5 h-5" />
                </button>
            </div>

            <AnimatePresence>
                {showSettings && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute inset-x-0 top-[90px] bg-white/95 backdrop-blur-xl border-b border-slate-100 p-8 z-50 shadow-2xl rounded-b-[2rem]"
                    >
                        <h4 className="text-xs font-bold uppercase text-slate-400 mb-5 tracking-widest block">Select Your Language</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {LANGUAGES.map(l => (
                                <button 
                                    key={l}
                                    onClick={() => { setLanguage(l); setShowSettings(false); }}
                                    className={`w-full text-left px-5 py-3.5 rounded-2xl text-[15px] font-medium flex items-center justify-between transition-colors shadow-sm ${language === l ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-600 border border-slate-100 hover:bg-slate-50'}`}
                                >
                                    {l} {language === l && <Check className="w-5 h-5 text-indigo-500" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-8 scroll-smooth relative z-0">
                {messages.map((msg, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        key={i} 
                        className={`flex gap-4 items-end ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`px-6 py-4 max-w-[85%] text-[16px] leading-[1.6] font-sans tracking-tight ${
                            msg.role === 'user' 
                                ? 'bg-slate-900 text-white rounded-3xl rounded-br-sm shadow-[0_5px_15px_rgba(0,0,0,0.1)]' 
                                : 'bg-[#F9FCFF] text-slate-700 shadow-[0_4px_30px_rgba(99,102,241,0.06)] rounded-3xl rounded-bl-sm whitespace-pre-wrap border border-white'
                        }`}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex gap-4 items-end"
                    >
                        <div className="px-6 py-4 rounded-3xl bg-[#F9FCFF] shadow-[0_4px_30px_rgba(99,102,241,0.06)] border border-white rounded-bl-sm flex items-center gap-2 h-[52px] w-24 justify-center">
                            <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-6 md:px-8 z-0 bg-transparent pt-4 pb-8">
                <form onSubmit={handleSend} className="relative flex items-center group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Say something..."
                        className="w-full pl-6 pr-14 py-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white text-[16px] font-sans font-medium transition-all shadow-[0_2px_15px_rgba(0,0,0,0.03)] placeholder:text-slate-400 text-slate-800"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-3 bg-slate-900 text-white rounded-[1rem] hover:bg-slate-800 disabled:opacity-0 disabled:scale-95 transition-all shadow-md active:scale-95 flex items-center justify-center pointer-events-auto"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    )
}
