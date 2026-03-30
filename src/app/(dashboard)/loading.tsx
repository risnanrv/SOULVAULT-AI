import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="h-full w-full flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
                <p className="text-sm text-slate-400 font-medium">Loading...</p>
            </div>
        </div>
    )
}
