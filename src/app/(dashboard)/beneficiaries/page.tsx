import { createClient } from '@/utils/supabase/server'
import { addBeneficiary, updateBeneficiary, deleteBeneficiary } from './actions'
import { Users, Trash2, Mail, Phone, Shield, Star, Edit } from 'lucide-react'
import { PageTransition, StaggerChildren, StaggerItem } from '@/components/PageTransition'
import Link from 'next/link'

export default async function BeneficiariesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
    const resolvedParams = await searchParams;
    const editId = resolvedParams?.edit;

    const supabase = await createClient()
    const { data: beneficiaries } = await supabase.from('beneficiaries').select('*, assets (id), memories (id)').order('created_at', { ascending: false })

    let editingPerson: any = null;
    let editRel = '';
    let editPhone = '';
    let editAccess = 'limited';
    let editPrimary = false;

    if (editId && beneficiaries) {
        editingPerson = beneficiaries.find(b => b.id === editId);
        if (editingPerson) {
            editRel = editingPerson.relationship || '';
            editPhone = editingPerson.phone || '';
            editAccess = editingPerson.access_level || 'limited';
            editPrimary = editingPerson.is_primary || false;

            if (editRel.startsWith('{')) {
                try {
                    const parsed = JSON.parse(editRel);
                    editRel = parsed.relation || parsed.Relation || parsed.RELATION || '';
                    if (!editPhone) editPhone = parsed.phone || parsed.Phone || parsed.PHONE || '';
                    if (editAccess === 'limited') editAccess = parsed.access_level || parsed.Access_level || parsed.ACCESS_LEVEL || 'limited';
                    if (!editPrimary) editPrimary = parsed.is_primary || parsed.Is_primary || parsed.IS_PRIMARY || false;
                } catch(e) {}
            }
        }
    }

    return (
        <PageTransition>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Beneficiaries</h1>
                <p className="text-slate-500 mt-1 max-w-2xl">Add trusted individuals who will receive your digital legacy. Define their access level below.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-slate-900">{editingPerson ? 'Edit Beneficiary' : 'Add Beneficiary'}</h3>
                            {editingPerson && (
                                <Link href="/beneficiaries" className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</Link>
                            )}
                        </div>
                        <form action={editingPerson ? updateBeneficiary : addBeneficiary} className="flex flex-col gap-4">
                            {editingPerson && <input type="hidden" name="id" value={editingPerson.id} />}
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Full Name</label>
                                <input name="name" defaultValue={editingPerson?.name || ''} required placeholder="John Doe" className="px-4 py-2.5 bg-slate-50 border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Email Address</label>
                                <input name="email" type="email" defaultValue={editingPerson?.email || ''} required placeholder="john@example.com" className="px-4 py-2.5 bg-slate-50 border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Phone Number</label>
                                <input name="phone" type="tel" defaultValue={editPhone} placeholder="+1 (555) 000-0000" className="px-4 py-2.5 bg-slate-50 border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Relationship</label>
                                <input name="relationship" defaultValue={editRel} required placeholder="e.g. Spouse, Sibling" className="px-4 py-2.5 bg-slate-50 border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Access Level</label>
                                <select name="access_level" defaultValue={editAccess} className="px-4 py-2.5 bg-slate-50 border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-slate-700">
                                    <option value="limited">Limited (Only assigned items)</option>
                                    <option value="full">Full (Can access all items)</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" name="is_primary" value="true" defaultChecked={editPrimary} className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" />
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Set as Primary Beneficiary</span>
                                </label>
                            </div>

                            <button type="submit" className="mt-4 w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-all hover:shadow-md hover:-translate-y-0.5 border border-transparent cursor-pointer">
                                {editingPerson ? 'Update Beneficiary' : 'Save Beneficiary'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4 pt-4 lg:pt-0">
                    {!beneficiaries?.length ? (
                        <div className="bg-slate-50 p-12 rounded-3xl border border-dashed border-slate-300 text-center flex items-center justify-center flex-col">
                            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No people added yet.</h3>
                            <p className="text-slate-500">Your assets and memories need recipients. Add someone here.</p>
                        </div>
                    ) : (
                        <StaggerChildren className="space-y-4">
                            {beneficiaries.map(person => {
                                let displayRel = person.relationship || '';
                                let displayPhone = person.phone || '';
                                let displayAccess = person.access_level || 'limited';
                                let displayPrimary = person.is_primary || false;

                                if (displayRel.startsWith('{')) {
                                    try {
                                        const parsed = JSON.parse(displayRel);
                                        displayRel = parsed.relation || parsed.Relation || parsed.RELATION || '';
                                        if (!displayPhone) displayPhone = parsed.phone || parsed.Phone || parsed.PHONE || '';
                                        if (displayAccess === 'limited') displayAccess = parsed.access_level || parsed.Access_level || parsed.ACCESS_LEVEL || 'limited';
                                        if (!displayPrimary) displayPrimary = parsed.is_primary || parsed.Is_primary || parsed.IS_PRIMARY || false;
                                    } catch(e) {}
                                }

                                return (
                                    <StaggerItem key={person.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between transition-all hover:border-slate-300 hover:shadow-md group">
                                        <div className="flex items-start gap-5 flex-1">
                                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors relative">
                                                <Users className="w-6 h-6" />
                                                {displayPrimary && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Primary Beneficiary">
                                                        <Star className="w-2.5 h-2.5 text-white fill-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                        {person.name}
                                                    </h4>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                                        {displayRel}
                                                    </span>
                                                    {displayAccess === 'full' && (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-1">
                                                            <Shield className="w-3 h-3" /> Full Access
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-2">
                                                    <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                                                        <Mail className="w-4 h-4 text-slate-400" />{person.email}
                                                    </p>
                                                    {displayPhone && (
                                                        <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                                                            <Phone className="w-4 h-4 text-slate-400" />{displayPhone}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-5 flex gap-3">
                                                    <div className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                                                        {person.assets?.length || 0} Assets
                                                    </div>
                                                    <div className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                                                        {person.memories?.length || 0} Memories
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="shrink-0 flex sm:flex-col gap-2 pt-1">
                                            <Link href={`/beneficiaries?edit=${person.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Edit Beneficiary">
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <form action={deleteBeneficiary.bind(null, person.id)}>
                                                <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Delete Beneficiary">
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
