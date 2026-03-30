import { createClient } from '@/utils/supabase/server'
import { addAsset, updateAsset, deleteAsset } from './actions'
import { Shield, Trash2, Link as LinkIcon, Lock, Landmark, Briefcase, FileText, Smartphone, Users, Edit } from 'lucide-react'
import { PageTransition, StaggerChildren, StaggerItem } from '@/components/PageTransition'
import Link from 'next/link'

export default async function VaultPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
    const editId = (await searchParams)?.edit;
    const supabase = await createClient()

    const { data: assets } = await supabase.from('assets').select(`*, beneficiaries (name)`).order('created_at', { ascending: false })
    const { data: beneficiaries } = await supabase.from('beneficiaries').select('id, name')

    let editingAsset: any = null;
    let editParsedInstructions = '';
    
    if (editId && assets) {
        editingAsset = assets.find(a => a.id === editId);
        if (editingAsset) {
            editParsedInstructions = editingAsset.instructions || '';
            if (editParsedInstructions.startsWith('{')) {
                try {
                    const parsed = JSON.parse(editParsedInstructions);
                    editParsedInstructions = parsed.text || parsed.instructions || '';
                } catch(e) {}
            }
        }
    }

    return (
        <PageTransition>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Digital Vault</h1>
                    <p className="text-slate-500 mt-1 max-w-2xl">Manage your digital accounts. Sensitive data is securely encrypted and only unlocked upon triggering your beneficiary protocol.</p>
                </div>
                <div className="hidden md:flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 shadow-sm relative group cursor-help">
                        <Lock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Encrypted locally before storage</span>
                        <div className="absolute top-full right-0 mt-2 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 pointer-events-none z-50">
                            This data cannot be read without your permission.
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                {/* ADD / EDIT ASSET FORM */}
                <div className="lg:col-span-1 border-r border-slate-100 lg:pr-8">
                    <div className="sticky top-24">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                {editingAsset ? 'Edit Asset' : 'Add New Asset'}
                            </h3>
                            {editingAsset && (
                                <Link href="/vault" className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</Link>
                            )}
                        </div>

                        <form action={editingAsset ? updateAsset : addAsset} className="flex flex-col gap-5">
                            {editingAsset && <input type="hidden" name="id" value={editingAsset.id} />}

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold tracking-wide uppercase text-slate-500">Asset Type</label>
                                <select name="asset_type" defaultValue={editingAsset?.asset_type || 'Other'} className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow font-medium text-slate-700 shadow-sm appearance-none cursor-pointer">
                                    <option value="Social Media">Social Media</option>
                                    <option value="Banking & Finance">Banking & Finance</option>
                                    <option value="Cryptocurrency">Cryptocurrency</option>
                                    <option value="Legal & Documents">Legal & Documents</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold tracking-wide uppercase text-slate-500">Asset Name</label>
                                <input name="name" required defaultValue={editingAsset?.name || ''} placeholder="e.g. Gmail, Main Bank Account" className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold tracking-wide uppercase text-slate-500">Description</label>
                                <input name="description" defaultValue={editingAsset?.description || ''} placeholder="What is this account used for?" className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold tracking-wide uppercase text-slate-500">Sensitive Data (Encrypted)</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input name="sensitive_data" type="password" placeholder={editingAsset?.encrypted_data ? "•••••••• (Leave blank to keep current)" : "PIN, Seed Phrase, combination..."} className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-inner font-mono text-sm" />
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">This will be encrypted. Plain text will NOT be stored.</span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold tracking-wide uppercase text-slate-500">Recovery Instructions</label>
                                <textarea name="instructions" required defaultValue={editParsedInstructions} placeholder="General legacy instructions..." rows={3} className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow shadow-sm" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold tracking-wide uppercase text-slate-500">Assignment</label>
                                <select name="beneficiary_id" defaultValue={editingAsset?.is_global ? 'all' : (editingAsset?.beneficiary_id || 'none')} className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-slate-700 font-medium shadow-sm appearance-none cursor-pointer">
                                    <option value="all">All Beneficiaries</option>
                                    <option value="none">-- Unassigned --</option>
                                    {beneficiaries?.map(b => (
                                        <option key={b.id} value={b.id}>Specific: {b.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="mt-2 w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-transparent">
                                {editingAsset ? 'Save Changes' : 'Secure & Save Asset'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ASSET LIST */}
                <div className="lg:col-span-2 space-y-4 pt-4 lg:pt-0">
                    {!assets?.length ? (
                        <div className="bg-slate-50 p-12 rounded-3xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center">
                            <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Your vault is empty</h3>
                            <p className="text-slate-500 max-w-sm">Start securing your digital life by adding your first asset on the left.</p>
                        </div>
                    ) : (
                        <StaggerChildren className="space-y-4">
                            {assets.map(asset => {
                                // For backwards compatibility if old assets have JSON in instructions
                                let instructionsText = asset.instructions;
                                let assetType = asset.asset_type || 'Other';
                                if (asset.instructions && asset.instructions.startsWith('{')) {
                                    try {
                                        const parsed = JSON.parse(asset.instructions);
                                        instructionsText = parsed.text;
                                    } catch (e) {}
                                }

                                const IconMap: Record<string, any> = {
                                    'Social Media': Smartphone,
                                    'Banking & Finance': Landmark,
                                    'Cryptocurrency': Shield,
                                    'Legal & Documents': FileText,
                                    'Other': Briefcase
                                };
                                const TypeIcon = IconMap[assetType] || Briefcase;

                                return (
                                    <StaggerItem key={asset.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between transition-all hover:shadow-md hover:border-blue-100 group">
                                        <div className="flex items-start gap-5 flex-1">
                                            <div className="p-3 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors shadow-sm">
                                                <TypeIcon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-lg font-bold text-slate-900">{asset.name}</h4>
                                                    <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                                                        {assetType}
                                                    </span>
                                                </div>
                                                {asset.description && <p className="text-sm text-slate-500 mb-4">{asset.description}</p>}

                                                {asset.encrypted_data && (
                                                    <div className="mb-4 bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-slate-300">
                                                            <Lock className="w-4 h-4 text-emerald-400" />
                                                            <span className="text-xs font-mono tracking-wider opacity-70">••••••••••••••••</span>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded">Encrypted Data</span>
                                                    </div>
                                                )}

                                                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl relative overflow-hidden group/instr">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-400 opacity-0 group-hover/instr:opacity-100 transition-opacity"></div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Instructions</p>
                                                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{instructionsText}</p>
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                                    {asset.is_global ? (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                                                            <Users className="w-3 h-3" />
                                                            All Beneficiaries
                                                        </span>
                                                    ) : asset.beneficiaries ? (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
                                                            <LinkIcon className="w-3 h-3" />
                                                            Assigned: {asset.beneficiaries.name}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                                                            Unassigned
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="shrink-0 flex sm:flex-col gap-2 pt-1">
                                            <Link href={`/vault?edit=${asset.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Edit Asset">
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <form action={deleteAsset.bind(null, asset.id)}>
                                                <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Delete Asset">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
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
