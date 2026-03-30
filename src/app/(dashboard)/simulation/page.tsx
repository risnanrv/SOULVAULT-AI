import { createClient } from '@/utils/supabase/server'
import SimulationFlow from './SimulationFlow'

export default async function SimulationPage() {
    const supabase = await createClient()

    // Bring beneficiaries to allow the simulation to hand-off to their respective views
    const { data: beneficiaries } = await supabase
        .from('beneficiaries')
        .select('id, name')

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inactivity Simulation</h1>
                <p className="text-slate-500 mt-1">
                    Test the protocol that activates when your account is flagged as inactive.
                </p>
            </div>

            <SimulationFlow beneficiaries={beneficiaries || []} />
        </div>
    )
}
