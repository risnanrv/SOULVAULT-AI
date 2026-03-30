'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart } from 'lucide-react'

export function ExperienceWrapper({ children, beneficiaryName }: { children: React.ReactNode, beneficiaryName: string }) {
    const [isEntered, setIsEntered] = useState(false)

    return (
        <>
            <AnimatePresence>
                {!isEntered && (
                    <motion.div 
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 1.5, ease: "easeInOut" } }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 h-[100dvh] w-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-xl"
                    >
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                            className="text-center max-w-lg mx-auto flex flex-col items-center"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" /> A message has been left for you
                            </span>
                            
                            <h1 className="text-5xl md:text-6xl font-serif text-slate-800 mb-6 tracking-tight font-medium">
                                For {beneficiaryName}
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-500 italic font-serif leading-relaxed mb-12">
                                "Everything here was prepared with love."
                            </p>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsEntered(true)}
                                className="bg-slate-900 text-white font-serif italic text-lg px-10 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.15)] transition-all hover:bg-slate-800 flex items-center gap-3 border border-slate-700/50"
                            >
                                <Heart className="w-4 h-4 text-rose-300" /> Enter Your Legacy
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The main content that appears after they enter */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isEntered ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                className={`min-h-[100dvh] transition-colors duration-1000 ${isEntered ? 'bg-neutral-50/50' : 'bg-white h-screen overflow-hidden'}`}
            >
                {children}
            </motion.div>
        </>
    )
}
