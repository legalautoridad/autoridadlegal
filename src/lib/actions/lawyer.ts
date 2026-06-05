'use server'

import { createClient, createAdminClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'

export type DashboardData = {
    wallet: {
        balance: number
    } | null
    status: {
        is_active: boolean
    }
    profile: {
        id: string
        email: string
        full_name: string | null
    } | null
    activeCases: any[]
    historicalCases: any[]
    availability: any[]
    verification: {
        is_verified: boolean
    } | null
    leads: any[]
}

export async function getLawyerDashboardData(): Promise<DashboardData> {
    const supabase = await createClient()

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const lawyerId = user.id

    // 2. Fetch Wallet & Key Profile Data
    const { data: walletData } = await supabase
        .from('lawyer_wallets')
        .select('balance')
        .eq('lawyer_id', lawyerId)
        .single()

    const { data: profileData } = await supabase
        .from('lawyer_members')
        .select('id, email, full_name, is_active, is_verified')
        .eq('id', lawyerId)
        .single()

    // 3. Fetch Assigned Cases (Active ones mainly)
    const { data: cases } = await supabase
        .from('cases')
        .select('*')
        .eq('assigned_lawyer_id', lawyerId)
        .in('status', ['ASSIGNED', 'CONTACTED', 'OPEN', 'CLOSED_FINISHED', 'CLOSED_REJECTED'])
        .order('created_at', { ascending: false })

    // 4. Fetch Availability (Future dates)
    const today = new Date().toISOString().split('T')[0]
    const { data: availability } = await supabase
        .from('lawyer_availability')
        .select('*')
        .eq('lawyer_id', lawyerId)
        .gte('blocked_date', today)

    // lawyer_profiles no longer has verification_status or is_verified (consolidated in lawyer_members)

    // 5. Fetch Available Leads (Marketplace)
    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('is_taken', false) // Only show leads that are NOT taken
        .order('created_at', { ascending: false })

    return {
        wallet: {
            balance: walletData?.balance || 0
        },
        status: {
            is_active: profileData?.is_active || false
        },
        profile: profileData ? {
            id: profileData.id,
            email: profileData.email,
            full_name: profileData.full_name
        } : null,
        activeCases: cases?.filter(c => !c.status.startsWith('CLOSED')) || [],
        historicalCases: cases?.filter(c => c.status.startsWith('CLOSED')) || [],
        availability: availability || [],
        verification: {
            is_verified: profileData?.is_verified || false
        },
        leads: leads || []
    }
}

export async function claimLead(leadId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Get Lead Data
    const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

    if (leadError || !lead) throw new Error('Lead not found')
    if (lead.is_taken) throw new Error('Lead already taken')

    // 2. Mark lead as taken (Use Admin Client to bypass RLS on leads table)
    const adminSupabase = await createAdminClient()
    const { error: updateLeadError } = await adminSupabase
        .from('leads')
        .update({
            is_taken: true,
            claimed_by: user.id,
            claimed_at: new Date().toISOString()
        })
        .eq('id', leadId)

    if (updateLeadError) throw new Error('Failed to claim lead')

    // 3. Copy to cases table
    const { error: createCaseError } = await supabase
        .from('cases')
        .insert({
            lead_id: lead.id,
            assigned_lawyer_id: user.id,
            status: 'OPEN',
            client_name: lead.name,
            client_phone: lead.phone,
            client_email: lead.email,
            client_city: lead.city,
            honorarios: lead.calculated_price || 0,
            incident_type: lead.incident_type,
            incident_date_time: lead.incident_date_time,
            judicial_district: lead.judicial_district,
            priors: lead.priors,
            priors_details: lead.priors_details,
            concerns: lead.concerns,
            calculated_price: lead.calculated_price,
            chosen_quota: lead.chosen_quota,
            dependents: lead.dependents,
            income_data: lead.income_data,
            has_citation: lead.has_citation,
            work_status: lead.work_status,
            needs_license_for_work: lead.needs_license_for_work,
            contact_date_time: lead.contact_date_time,
            jail: lead.jail,
            ai_summary: lead.ai_summary,
            citation_date_time: lead.citation_date_time,
            rate: lead.rate,
            systemin: lead.systemin
        })

    if (createCaseError) {
        console.error('Error creating case:', createCaseError)
        throw new Error('Failed to create case from lead')
    }

    revalidatePath('/lawyer/dashboard')
    return { success: true }
}

export async function updateCase(caseId: string, data: { status?: string, observations?: string, notes?: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('cases')
        .update(data)
        .eq('id', caseId)
        .eq('assigned_lawyer_id', user.id)

    if (error) {
        console.error('Error updating case:', error)
        throw new Error(`Failed to update case: ${error.message}`)
    }

    revalidatePath('/lawyer/dashboard')
    return { success: true }
}

export async function cancelCase(caseId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Get data from case
    const { data: caseData } = await supabase
        .from('cases')
        .select('lead_id, assigned_lawyer_id, status')
        .eq('id', caseId)
        .single()

    if (!caseData || caseData.assigned_lawyer_id !== user.id) {
        throw new Error('Unauthorized access to case')
    }

    if (caseData.status !== 'OPEN') {
        throw new Error('Solo se pueden cancelar casos en estado ABIERTO')
    }

    if (caseData.lead_id) {
        // 2. Mark lead as NOT taken (using admin client to bypass RLS)
        const adminSupabase = await createAdminClient()
        await adminSupabase
            .from('leads')
            .update({
                is_taken: false,
                claimed_by: null,
                claimed_at: null
            })
            .eq('id', caseData.lead_id)
    }

    // 3. Mark case as CANCELLED (so it disappears from active lists)
    await supabase
        .from('cases')
        .update({ status: 'CANCELLED' })
        .eq('id', caseId)

    revalidatePath('/lawyer/dashboard')
    return { success: true }
}

export async function confirmCaseContact(caseId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Verify ownership
    const { data: caseData } = await supabase
        .from('cases')
        .select('assigned_lawyer_id, status, client_phone') // fetching phone for mock SMS
        .eq('id', caseId)
        .single()

    if (!caseData || caseData.assigned_lawyer_id !== user.id) {
        throw new Error('Unauthorized access to case')
    }

    if (caseData.status !== 'ASSIGNED') {
        throw new Error('Case is not in ASSIGNED status')
    }

    // Update Status
    const { error } = await supabase
        .from('cases')
        .update({ status: 'CONTACTED' })
        .eq('id', caseId)

    if (error) throw new Error('Failed to update status')

    // MOCK SMS NOTIFICATION to client
    console.log(`[MOCK SMS] To Client ${caseData.client_phone}: Your lawyer has confirmed they have contacted you.`)

    revalidatePath('/lawyer/dashboard')
    return { success: true }
}

export async function toggleDayAvailability(date: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Check if blocked
    const { data: existing } = await supabase
        .from('lawyer_availability')
        .select('id')
        .eq('lawyer_id', user.id)
        .eq('blocked_date', date)
        .single()

    if (existing) {
        // Unblock
        await supabase.from('lawyer_availability').delete().eq('id', existing.id)
    } else {
        // Block
        await supabase.from('lawyer_availability').insert({
            lawyer_id: user.id,
            blocked_date: date,
            reason: 'User toggled'
        })
    }

    revalidatePath('/lawyer/dashboard')
    return { success: true }
}

export async function toggleLawyerStatus(isActive: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    await supabase.from('lawyer_members').update({ is_active: isActive }).eq('id', user.id)
    revalidatePath('/lawyer/dashboard')
    return { success: true }
}

export async function rechargeWallet(amount: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    if (![500, 1000, 1500].includes(amount)) {
        throw new Error('Invalid recharge amount')
    }

    // 1. Get Current Balance
    const { data: wallet } = await supabase
        .from('lawyer_wallets')
        .select('balance')
        .eq('lawyer_id', user.id)
        .single()

    if (!wallet) throw new Error('Wallet not found')

    // 2. Update Balance
    const newBalance = Number(wallet.balance) + amount
    const { error: updateError } = await supabase
        .from('lawyer_wallets')
        .update({ balance: newBalance })
        .eq('lawyer_id', user.id)

    if (updateError) throw new Error('Failed to update wallet')

    // 3. Log Transaction
    await supabase.from('wallet_transactions').insert({
        lawyer_id: user.id,
        amount: amount,
        type: 'DEPOSIT',
        description: `Recarga de saldo (Pack ${amount}€)`
    })

    revalidatePath('/lawyer/dashboard')
    return { success: true, newBalance }
}
