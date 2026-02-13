'use server'

import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'

export type DashboardData = {
    wallet: {
        balance: number
        is_active: boolean
    } | null
    cases: {
        id: string
        client_name: string
        client_phone: string
        client_city: string
        honorarios: number
        status: string
        created_at: string
        ai_summary?: string
        client_profile?: any
        notes?: string
    }[]
    availability: any[]
    verification: {
        is_verified: boolean
        status: string
    } | null
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
        .select('is_active')
        .eq('id', lawyerId)
        .single()

    // 3. Fetch Assigned Cases (Active ones mainly)
    // We want cases that are ASSIGNED or CONTACTED. Maybe UNREACHABLE/CANCELLED for history?
    // Let's grab all active ones for the Inbox.
    const { data: cases } = await supabase
        .from('cases')
        .select('*')
        .eq('assigned_lawyer_id', lawyerId)
        .in('status', ['ASSIGNED', 'CONTACTED'])
        .order('created_at', { ascending: false })

    // 4. Fetch Availability (Future dates)
    const today = new Date().toISOString().split('T')[0]
    const { data: availability } = await supabase
        .from('lawyer_availability')
        .select('*')
        .eq('lawyer_id', lawyerId)
        .gte('blocked_date', today)

    const { data: lawyerProfile } = await supabase
        .from('lawyer_profiles')
        .select('is_verified, verification_status')
        .eq('id', lawyerId)
        .single()

    return {
        wallet: walletData ? {
            balance: walletData.balance,
            is_active: profileData?.is_active || false
        } : null,
        cases: cases || [],
        availability: availability || [],
        verification: lawyerProfile ? {
            is_verified: lawyerProfile.is_verified,
            status: lawyerProfile.verification_status
        } : null
    }
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
