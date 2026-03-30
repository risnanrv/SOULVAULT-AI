'use client'

import { useState } from 'react'
import { Shield, Unlock, LockKeyhole, Loader2, Key, Download } from 'lucide-react'
import { StaggerItem } from '@/components/PageTransition'

export function AssetCard({ asset }: { asset: any }) {
    const [isDecrypting, setIsDecrypting] = useState(false)
    const [isDecrypted, setIsDecrypted] = useState(false)

    let parsedInstructions = asset.instructions || '';
    let isEncrypted = false;
    let sensitiveData = '';
    
    if (asset.encrypted_data) {
        isEncrypted = true;
        sensitiveData = asset.encrypted_data;
    }

    try {
        if (asset.instructions?.startsWith('{')) {
            const parsed = JSON.parse(asset.instructions);
            parsedInstructions = parsed.text || parsed.instructions || '';
            if (!sensitiveData) {
                sensitiveData = parsed.sensitive_data || '';
                isEncrypted = !!sensitiveData;
            }
        }
    } catch (e) {}

    const handleDecrypt = () => {
        setIsDecrypting(true)
        setTimeout(() => {
            setIsDecrypting(false)
            setIsDecrypted(true)
        }, 3000)
    }

    return (
        <StaggerItem className="bg-slate-50/50 p-7 rounded-3xl border border-slate-100 flex flex-col transition-all duration-300 relative overflow-hidden group">
            {isEncrypted && !isDecrypted && (
                <div className="absolute top-0 right-0 p-3 bg-amber-50 text-amber-600 rounded-bl-3xl border-b border-l border-amber-100 flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase">
                    <LockKeyhole className="w-3.5 h-3.5" /> Encrypted Vault
                </div>
            )}
            
            <h3 className="text-xl font-bold text-slate-900 mb-3 pr-24">{asset.name}</h3>
            
            {asset.description && (
                <p className="text-sm font-medium text-slate-500 mb-6 flex-1 leading-relaxed">{asset.description}</p>
            )}

            <div className={`bg-white border border-slate-200 shadow-sm rounded-2xl p-5 mt-auto transition-all ${isDecrypted ? 'bg-emerald-50/50 border-emerald-100 shadow-none' : ''}`}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                    <span>Access Instructions</span>
                    {isDecrypted && <span className="text-emerald-600 flex items-center gap-1"><Unlock className="w-3.5 h-3.5"/> Verified</span>}
                </p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-medium mb-4">{parsedInstructions}</p>
                
                {isEncrypted && !isDecrypted && (
                    <button 
                        onClick={handleDecrypt} 
                        disabled={isDecrypting}
                        className="w-full bg-slate-900 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isDecrypting ? (
                            <><Loader2 className="w-4 h-4 animate-spin text-slate-300" /> Decrypting Secure Data...</>
                        ) : (
                            <><Key className="w-4 h-4" /> Decrypt Sensitive Data</>
                        )}
                    </button>
                )}

                {isDecrypted && (
                    <div className="mt-4 p-4 border border-emerald-200 bg-white rounded-xl">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Decrypted Payload</p>
                        <p className="font-mono text-xs text-slate-800 break-all p-3 bg-slate-50 rounded-lg border border-slate-100 leading-relaxed shadow-inner">
                            {sensitiveData.replace('ENCRYPTED_MOCK_', '')}
                        </p>
                        <button className="mt-3 w-full border border-emerald-200 text-emerald-700 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-emerald-50 transition-colors">
                            <Download className="w-3.5 h-3.5" /> Download Secure Key
                        </button>
                    </div>
                )}
            </div>
        </StaggerItem>
    )
}
