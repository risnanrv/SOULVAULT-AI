'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Lock, ArrowUpRight, BrainCircuit, Heart, Video, Calendar, Infinity as InfinityIcon } from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
            {/* Header */}
            <header className="absolute top-0 inset-x-0 z-50 px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-between">
                <div className="font-serif font-bold text-2xl tracking-tight text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" /> SoulVault
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-[11px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Sign In</Link>
                </div>
            </header>

            {/* SECTION 1 & 2: HERO & VISUAL */}
            <section className="relative min-h-[100dvh] flex items-center pt-24 pb-12 overflow-hidden">
                {/* Animated Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F4F7FB] to-[#F1F0FA] -z-20" />

                {/* Subtle Moving Glows */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-300/20 blur-[100px] -z-10"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-300/20 blur-[100px] -z-10"
                />

                <div className="max-w-[1400px] mx-auto px-6 lg:px-8 w-full z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

                        {/* LEFT: Section 1 Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                            className="max-w-2xl"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-indigo-100 backdrop-blur-md shadow-sm mb-8">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-800">
                                    AI-Powered Digital Legacy
                                </span>
                            </div>

                            <h1 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] font-serif text-slate-900 tracking-tight leading-[1.05] mb-8">
                                What happens to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 italic">your digital life</span> <br className="hidden sm:block" />when <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 italic">you're gone?</span>
                            </h1>

                            <p className="text-[1.2rem] sm:text-[1.35rem] leading-relaxed text-slate-500 font-sans max-w-xl mb-12">
                                You leave behind memories, accounts, stories. We make sure they reach the people who matter.
                            </p>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                <Link
                                    href="/login"
                                    className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 px-8 py-4 text-[13px] font-bold text-white transition-all overflow-hidden w-full sm:w-auto hover:bg-slate-800"
                                >
                                    {/* Button hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-in-out" />
                                    <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest">
                                        Start Your Vault <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>

                                <Link
                                    href="#how-it-works"
                                    className="group rounded-full bg-white/50 border border-slate-200 px-8 py-4 text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-white hover:border-slate-300 transition-all hover:shadow-sm w-full sm:w-auto text-center uppercase tracking-widest"
                                >
                                    See How It Works
                                </Link>
                            </div>
                        </motion.div>

                        {/* RIGHT: Section 2 Visual (Mock Conversation) */}
                        <motion.div
                            initial={{ opacity: 0, x: 40, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                            className="relative lg:ml-auto w-full max-w-[500px]"
                        >
                            {/* Glass container */}
                            <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.05)] relative z-10">

                                <div className="flex items-center justify-between border-b border-slate-200/50 pb-5 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-rose-100 flex items-center justify-center border border-white shadow-sm">
                                            <Sparkles className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Legacy AI</p>
                                            <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Active
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* User Message */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 1 }}
                                        className="flex gap-4 items-end justify-end"
                                    >
                                        <div className="bg-slate-800 text-white px-6 py-4 rounded-3xl rounded-br-sm max-w-[85%] shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
                                            <p className="text-[15px] font-sans leading-relaxed">
                                                I wish I could hear you again...
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* AI Message */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 2.5 }}
                                        className="flex gap-4 items-end"
                                    >
                                        <div className="bg-white text-slate-700 px-6 py-4 rounded-3xl rounded-bl-sm max-w-[90%] shadow-[0_10px_40px_rgba(99,102,241,0.08)] border border-white/80">
                                            <p className="text-[16px] font-serif italic text-slate-800 leading-relaxed tracking-tight">
                                                "I'm still here. I always will be."
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Decorative background blurs behind the chat */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/10 to-transparent blur-2xl -z-10 rounded-[3rem] transform -translate-x-4 translate-y-4" />
                            <div className="absolute inset-0 bg-gradient-to-bl from-rose-400/10 to-transparent blur-2xl -z-10 rounded-[3rem] transform translate-x-4 -translate-y-4" />
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* SECTION 3: THE PROBLEM */}
            <section id="how-it-works" className="py-32 bg-white relative">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="max-w-xl">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1 }}
                                className="text-[2.5rem] sm:text-[3.5rem] font-serif text-slate-900 tracking-tight leading-[1.1] mb-8"
                            >
                                We live online.<br />But we leave everything behind.
                            </motion.h2>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Glass Card for Problem visual */}
                            <div className="bg-[#FAF9F7] border border-slate-100 rounded-[2rem] p-8 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] group">
                                <div className="space-y-4 mb-12">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-rose-50/50 shadow-sm opacity-50 grayscale transition-all group-hover:grayscale-0 group-hover:opacity-100 group-hover:border-rose-100 pb-5">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Lock className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm line-through decoration-rose-500 decoration-2">Vault Locked</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-rose-50/50 shadow-sm opacity-50 grayscale transition-all group-hover:grayscale-0 group-hover:opacity-100 group-hover:border-rose-100 pb-5">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm line-through decoration-rose-500 decoration-2">Memories Inaccessible</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200/60 pt-8 mt-8">
                                    <p className="text-[1.3rem] text-slate-500 font-serif italic text-center text-balance leading-relaxed">
                                        "I just wanted to hear her voice one more time."
                                    </p>
                                </div>
                            </div>

                            <div className="absolute -inset-4 bg-rose-500/5 blur-3xl -z-10 rounded-[4rem]" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: THE SOLUTION */}
            <section className="py-32 bg-[#FAF9F7]">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1 }}
                            className="text-[3rem] font-serif text-slate-900 tracking-tight"
                        >
                            SoulVault changes that.
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Store Your Digital Life", desc: "Securely upload your passwords, final videos, and written stories into an end-to-end heavily encrypted vault." },
                            { step: "02", title: "Assign Trusted People", desc: "Select beneficiaries and designate exact legacy access levels. They unlock your vault securely when the time comes." },
                            { step: "03", title: "Train Your AI Legacy", desc: "Interact with our intelligence to let it map your tone, memories, and wisdom so you can comfort them when you are gone." }
                        ].map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, delay: i * 0.15 }}
                                className="group relative bg-white rounded-[2rem] p-10 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2"
                            >
                                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300 block mb-8">Step {s.step}</span>
                                <h3 className="text-2xl font-serif text-slate-900 tracking-tight mb-4">{s.title}</h3>
                                <p className="text-slate-500 font-sans leading-relaxed">{s.desc}</p>
                                <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-indigo-100">
                                    <ArrowUpRight className="w-8 h-8" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 5: AI SHOWCASE (DARK CONTRAST) */}
            <section className="py-40 bg-[#0B0C10] relative overflow-hidden text-white border-t border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />

                <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <Heart className="w-8 h-8 text-rose-400 mx-auto mb-10 fill-rose-500/20" />

                        <h2 className="text-[3.5rem] sm:text-[4.5rem] font-serif tracking-tight mb-8">
                            They don't have to face the silence.
                        </h2>

                        <p className="text-xl sm:text-2xl text-slate-400 font-serif italic max-w-3xl mx-auto mb-20 leading-relaxed">
                            "Your loved ones can talk to your memories, hear your advice, and feel your presence exactly when they need it."
                        </p>
                    </motion.div>

                    {/* Massive Beautiful Chat Demo Centerpiece */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className="max-w-3xl mx-auto bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 sm:p-14 shadow-2xl text-left relative overflow-hidden"
                    >
                        <div className="absolute -inset-20 bg-gradient-to-tr from-indigo-500/10 via-transparent to-rose-500/10 blur-[100px] -z-10" />

                        <div className="space-y-10">
                            <div className="flex gap-5 items-end justify-end">
                                <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl rounded-tr-sm max-w-[85%] backdrop-blur-sm shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
                                    <p className="text-[17px] text-slate-200 font-sans leading-relaxed tracking-tight">
                                        What would you say to me right now? I'm so scared.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-5 items-end">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-400 to-orange-300 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(251,113,133,0.3)] border border-rose-300">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white/10 border border-white/20 p-8 rounded-3xl rounded-tl-sm max-w-[85%] backdrop-blur-md shadow-[0_10px_50px_rgba(0,0,0,0.3)]">
                                    <p className="text-[20px] sm:text-[24px] text-white leading-[1.6] font-serif italic tracking-tight text-shadow-sm">
                                        "I'm proud of you. Always. You are so much stronger than you know."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 6: FUTURE FEATURES */}
            <section className="py-32 bg-white relative">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                    <div className="mb-20">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 block mb-4">Ecosystem Expansion</span>
                        <h2 className="text-[3rem] font-serif text-slate-900 tracking-tight">Building the Future of Preservation</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Calendar, title: "Scheduled Delivery", desc: "Set precise dates to release specific memories automatically to loved ones.", status: "Core" },
                            { icon: Video, title: "AI Video Calling", desc: "Interactive video rendering of your legacy, moving gracefully to match your cadence.", status: "Coming Soon", dark: true },
                            { icon: InfinityIcon, title: "Digital Twin", desc: "A photorealistic generated legacy twin built entirely from local vault references.", status: "R&D" }
                        ].map((f, i) => (
                            <div key={i} className={`p-10 rounded-[2.5rem] relative overflow-hidden group border ${f.dark ? 'bg-[#0B0C10] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-100'}`}>
                                <f.icon className={`w-8 h-8 mb-8 ${f.dark ? 'text-indigo-400' : 'text-slate-400'}`} />
                                <h3 className="text-xl font-bold tracking-tight mb-3">{f.title}</h3>
                                <p className={`leading-relaxed text-sm ${f.dark ? 'text-slate-400' : 'text-slate-500'}`}>{f.desc}</p>

                                <div className="absolute top-8 right-8">
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${f.dark ? 'bg-indigo-900/50 text-indigo-300 border-indigo-800' : 'bg-white text-slate-400 border-slate-200 shadow-sm'}`}>
                                        {f.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 7: EMOTIONAL CTA */}
            <section className="py-40 bg-gradient-to-b from-[#FAF9F7] to-white text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 1 }}
                        className="text-[3.5rem] sm:text-[5rem] font-serif text-slate-900 tracking-tight leading-[1.05] mb-8"
                    >
                        Your story deserves to live on.
                    </motion.h2>
                    <p className="text-xl text-slate-500 font-serif italic mb-16">Start building your legacy today.</p>

                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 px-12 py-5 text-[14px] font-bold text-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:bg-slate-800 transition-all hover:scale-105 tracking-widest uppercase"
                    >
                        Create Your Vault Free
                    </Link>
                </div>
            </section>

        </div>
    )
}
