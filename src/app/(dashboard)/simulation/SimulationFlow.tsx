'use client'

import { useState, useEffect } from 'react'
import { Activity, ShieldAlert, Key, CheckCircle2, ArrowRight, Loader2, Clock, Mail, Smartphone, Users } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

type Step = 'IDLE' | 'CONFIG' | 'DETECTED' | 'VERIFYING' | 'RECOVERY' | 'GRANTED'

export default function SimulationFlow({ beneficiaries }: { beneficiaries: any[] }) {
    const [step, setStep] = useState<Step>('IDLE')
    const [inactivityPeriod, setInactivityPeriod] = useState(30)
    const [progress, setProgress] = useState(0)

    const startSimulation = () => {
        setStep('DETECTED')
        setProgress(0)

        setTimeout(() => {
            setStep('VERIFYING')
            setProgress(33)
        }, 3000)

        setTimeout(() => {
            setStep('RECOVERY')
            setProgress(66)
        }, 6000)

        setTimeout(() => {
            setStep('GRANTED')
            setProgress(100)
        }, 9000)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Configuration Panel */}
            <div className="col-span-1 border-r border-slate-100 lg:pr-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Vault Protocol</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Configure the conditions that will trigger the release of your digital legacy to assigned beneficiaries.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-3">Inactivity Trigger</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[7, 14, 30].map(days => (
                                    <button
                                        key={days}
                                        onClick={() => setInactivityPeriod(days)}
                                        disabled={step !== 'IDLE'}
                                        className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                                            inactivityPeriod === days
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {days} Days
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-slate-400" /> Grace Period
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Once {inactivityPeriod} days of silence pass, we attempt to contact you for 48 hours before granting access.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <button 
                            onClick={step === 'IDLE' ? startSimulation : () => { setStep('IDLE'); setProgress(0); }} 
                            className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                                step === 'IDLE' 
                                 ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 border border-transparent'
                                 : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                            }`}
                        >
                            {step === 'IDLE' ? 'Run Simulation' : 'Reset Protocol'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Simulation Timeline */}
            <div className="col-span-1 lg:col-span-2">
                {step === 'IDLE' ? (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 py-24 bg-slate-50/50 rounded-3xl border border-dashed border-slate-300">
                        <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to Simulate</h2>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Adjust the inactivity period on the left and click "Run Simulation" to watch how your legacy will be securely transferred.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden min-h-[500px]">
                        {/* Progress Line */}
                        <div className="absolute left-[3.25rem] sm:left-[4.25rem] top-12 bottom-12 w-1 bg-slate-100 rounded-full">
                            <motion.div 
                                className="w-full bg-indigo-500 rounded-full"
                                initial={{ height: "0%" }}
                                animate={{ height: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        <div className="space-y-12 relative z-10">
                            {/* Step 1: Detected */}
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className={`flex gap-6 items-start ${progress >= 0 ? 'opacity-100' : 'opacity-40 grayscale'}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center border-4 border-white shadow-sm relative z-10 ${progress >= 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-xl font-bold text-slate-900">Inactivity Triggered</h3>
                                    <p className="text-slate-500 mt-1 max-w-lg">Zero account activity detected for {inactivityPeriod} consecutive days. Protocol initialized.</p>
                                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-md border border-slate-200">
                                        <Clock className="w-3.5 h-3.5" /> T-Minus 48 Hours
                                    </div>
                                </div>
                            </motion.div>

                            {/* Step 2: Verifying */}
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: step === 'VERIFYING' || progress >= 33 ? 1 : 0, x: step === 'VERIFYING' || progress >= 33 ? 0 : -20 }}
                                transition={{ duration: 0.5 }}
                                className={`flex gap-6 items-start ${progress >= 33 ? 'opacity-100' : 'hidden'}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center border-4 border-white shadow-sm relative z-10 ${progress >= 33 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {step === 'VERIFYING' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Smartphone className="w-6 h-6" />}
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-xl font-bold text-slate-900">Failsafe Verification</h3>
                                    <p className="text-slate-500 mt-1 max-w-lg">Attempting to contact you via SMS and alternate email to ensure it's a genuine absence.</p>
                                    {step === 'VERIFYING' && (
                                        <div className="mt-4 flex gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Step 3: Extracting / Decrypting */}
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: step === 'RECOVERY' || progress >= 66 ? 1 : 0, x: step === 'RECOVERY' || progress >= 66 ? 0 : -20 }}
                                transition={{ duration: 0.5 }}
                                className={`flex gap-6 items-start ${progress >= 66 ? 'opacity-100' : 'hidden'}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center border-4 border-white shadow-sm relative z-10 ${progress >= 66 ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {step === 'RECOVERY' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Key className="w-6 h-6" />}
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-xl font-bold text-slate-900">Unlocking Vault</h3>
                                    <p className="text-slate-500 mt-1 max-w-lg">Grace period expired. Decrypting assets and routing memories to assigned beneficiaries.</p>
                                </div>
                            </motion.div>

                            {/* Step 4: Granted */}
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: step === 'GRANTED' ? 1 : 0, x: step === 'GRANTED' ? 0 : -20 }}
                                transition={{ duration: 0.5 }}
                                className={`flex gap-6 items-start ${step === 'GRANTED' ? 'opacity-100 bg-emerald-50/50 -m-6 p-6 rounded-3xl border border-emerald-100' : 'hidden'}`}
                            >
                                <div className="w-14 h-14 rounded-2xl shrink-0 bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-white shadow-sm relative z-10">
                                    <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <div className="w-full pt-1">
                                    <h3 className="text-xl font-bold text-emerald-900 mb-1">Access Granted</h3>
                                    <p className="text-emerald-700/80 font-medium mb-6">Security protocols complete. Your legacy has been secured and delivered.</p>

                                    {beneficiaries.length === 0 ? (
                                        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                                            <p className="text-amber-600 text-sm font-bold flex items-center gap-2">
                                                <Users className="w-4 h-4"/> No beneficiaries assigned.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm w-full">
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5" /> Notifications Sent
                                            </p>
                                            <div className="space-y-3">
                                                {beneficiaries.map(b => (
                                                    <Link key={b.id} href={`/shared/${b.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm transition-all text-slate-700 hover:text-indigo-900 group">
                                                        <span className="font-bold text-slate-800">{b.name}</span>
                                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            View Beneficiary Portal <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
