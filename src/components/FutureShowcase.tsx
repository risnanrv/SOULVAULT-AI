import { Sparkles, Video, Mic, Glasses, ArrowRight } from 'lucide-react'

export function FutureShowcase() {
    return (
        <div className="mt-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none group-hover:bg-indigo-400/20 transition-all duration-1000" />
            <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-purple-500/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold uppercase tracking-widest mb-4 border border-indigo-500/30">
                        <Sparkles className="w-3.5 h-3.5" /> SoulVault Roadmap
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">The Future of Legacy</h2>
                    <p className="text-indigo-200/80 leading-relaxed font-medium">
                        We are building cutting-edge integrations to make your digital afterlife as immersive and authentic as your actual life. Here is what we are training our models for next.
                    </p>
                </div>
                <button className="whitespace-nowrap flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm border border-white/10 transition-all backdrop-blur-md hover:shadow-[0_0_20px_rgba(129,140,248,0.3)]">
                    Join Waitlist <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-5 border border-indigo-500/30">
                        <Video className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Deepfake Video Legacy</h3>
                    <p className="text-sm text-indigo-200/70 leading-relaxed">
                        Leave a realistic, emotionally intelligent video avatar that your loved ones can interact with. Trained on your facial expressions and mannerisms.
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">In Development</span>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-5 border border-purple-500/30">
                        <Mic className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Hyper-Realistic Voice</h3>
                    <p className="text-sm text-indigo-200/70 leading-relaxed">
                        Read them a bedtime story or offer advice using a fully synthesized voice clone that captures your exact cadence, breath, and emotion.
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-purple-400">Model Training</span>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-5 border border-emerald-500/30">
                        <Glasses className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">AR Environment Anchors</h3>
                    <p className="text-sm text-indigo-200/70 leading-relaxed">
                        Pin digital memories, videos, and 3D assets to real-world physical locations using spatial computing for your family to discover.
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">Concept Phase</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
