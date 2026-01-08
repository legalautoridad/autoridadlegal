'use server'

import { createAdminClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Assigns a case to a lawyer, deducting the platform fee from their wallet.
 * @param caseId 
 * @param lawyerId 
 */
export async function assignCaseToLawyer(caseId: string, lawyerId: string) {
    const supabase = await createAdminClient()

    // 1. Fetch Case Details
    const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single()

    if (caseError || !caseData) {
        throw new Error('Case not found')
    }

    if (caseData.status !== 'NEW') {
        throw new Error('Case is not in NEW status')
    }

    const TOTAL_FEE = caseData.honorarios || 0 // e.g. 1000
    const PLATFORM_FEE = TOTAL_FEE * 0.25 // 250
    const RESERVATION = caseData.reservation_amount || 0 // 50
    const DEDUCTION = PLATFORM_FEE - RESERVATION // 200

    if (DEDUCTION < 0) {
        throw new Error('Invalid deduction amount calculation')
    }

    // 2. Fetch Lawyer Wallet
    const { data: wallet, error: walletError } = await supabase
        .from('lawyer_wallets')
        .select('balance')
        .eq('lawyer_id', lawyerId)
        .single()

    if (walletError || !wallet) {
        throw new Error('Lawyer wallet not found')
    }

    if (wallet.balance < DEDUCTION) {
        // Here we might just return an error, OR we could update stats to skip this lawyer
        throw new Error('INSUFFICIENT_FUNDS')
    }

    // 3. Atomic Transaction (Simulated via sequential operations with checks, logic implies single transaction if possible)
    // Note: Supabase RPC is better for true atomicity, but for now we do sequential with error handling.
    // Ideally we would wrap this in a postgres function, but here is the JS logic as requested.

    // Deduct Balance
    const { error: updateError } = await supabase
        .from('lawyer_wallets')
        .update({ balance: wallet.balance - DEDUCTION })
        .eq('lawyer_id', lawyerId)

    if (updateError) throw new Error('Failed to update wallet balance')

    // Create Transaction Record
    const { error: txError } = await supabase
        .from('wallet_transactions')
        .insert({
            lawyer_id: lawyerId,
            amount: -DEDUCTION, // Negative for deduction
            case_id: caseId,
            type: 'CASE_FEE',
            description: `Fee deduction for case ${caseId}`
        })

    if (txError) {
        // CRITICAL: Rollback wallet (manual compensation)
        await supabase.from('lawyer_wallets').update({ balance: wallet.balance }).eq('lawyer_id', lawyerId)
        throw new Error('Failed to create transaction record')
    }

    // Assign Case
    const { error: assignError } = await supabase
        .from('cases')
        .update({
            status: 'ASSIGNED',
            assigned_lawyer_id: lawyerId
        })
        .eq('id', caseId)

    if (assignError) {
        // CRITICAL: Rollback wallet & transaction (manual compensation)
        await supabase.from('wallet_transactions').delete().eq('case_id', caseId).eq('type', 'CASE_FEE') // naive rollback
        await supabase.from('lawyer_wallets').update({ balance: wallet.balance }).eq('lawyer_id', lawyerId)
        throw new Error('Failed to assign case')
    }

    // Update Stats (Increment Assigned count)
    // Update Stats (Increment Assigned count)
    const { error: rpcError } = await supabase.rpc('increment_cases_assigned', { lawyer_uuid: lawyerId })

    if (rpcError) {
        // If RPC doesn't exist or fails, do manually
        const { data: stats } = await supabase.from('lawyer_stats').select('cases_assigned').eq('lawyer_id', lawyerId).single()
        if (stats) {
            await supabase.from('lawyer_stats').update({ cases_assigned: stats.cases_assigned + 1 }).eq('lawyer_id', lawyerId)
        } else {
            await supabase.from('lawyer_stats').insert({ lawyer_id: lawyerId, cases_assigned: 1 })
        }
    }


    revalidatePath('/dashboard')
    return { success: true, deduction: DEDUCTION }
}

/**
 * Reports a client as unreachable after 3 attempts. Refunds the fee.
 * @param caseId 
 */
export async function reportUnreachableClient(caseId: string) {
    const supabase = await createAdminClient()

    // Verify preconditions (mocking "3 failed attempts" check logic here as requested)
    // In real app, we would query a 'contact_attempts' table.

    const { data: caseData, error } = await supabase.from('cases').select('*').eq('id', caseId).single()
    if (error || !caseData) throw new Error('Case not found')

    if (caseData.status !== 'ASSIGNED') {
        throw new Error('Case must be ASSIGNED to report unreachable')
    }

    // Calculate Refund Amount (Same logic as deduction)
    const TOTAL_FEE = caseData.honorarios || 0
    const PLATFORM_FEE = TOTAL_FEE * 0.25
    const RESERVATION = caseData.reservation_amount || 0
    const DEDUCTION = PLATFORM_FEE - RESERVATION

    // Refund Logic
    const { data: wallet } = await supabase.from('lawyer_wallets').select('balance').eq('lawyer_id', caseData.assigned_lawyer_id).single()
    if (!wallet) throw new Error('Wallet not found')

    await supabase.from('lawyer_wallets').update({ balance: wallet.balance + DEDUCTION }).eq('lawyer_id', caseData.assigned_lawyer_id)

    await supabase.from('wallet_transactions').insert({
        lawyer_id: caseData.assigned_lawyer_id,
        amount: DEDUCTION, // Positive for refund
        case_id: caseId,
        type: 'REFUND_UNREACHABLE',
        description: `Refund for unreachable client case ${caseId}`
    })

    await supabase.from('cases').update({ status: 'UNREACHABLE' }).eq('id', caseId)

    revalidatePath('/dashboard')
    return { success: true }
}

/**
 * Reports a client cancellation. Refunds the fee. Updates stats.
 * @param caseId 
 * @param reason 
 */
export async function reportClientCancellation(caseId: string, reason: string) {
    const supabase = await createAdminClient()

    const { data: caseData, error } = await supabase.from('cases').select('*').eq('id', caseId).single()
    if (error || !caseData) throw new Error('Case not found')

    if (caseData.status !== 'ASSIGNED') {
        throw new Error('Case must be ASSIGNED to report cancellation')
    }

    // Calculate Refund
    const TOTAL_FEE = caseData.honorarios || 0
    const PLATFORM_FEE = TOTAL_FEE * 0.25
    const RESERVATION = caseData.reservation_amount || 0
    const DEDUCTION = PLATFORM_FEE - RESERVATION

    // Refund
    const { data: wallet } = await supabase.from('lawyer_wallets').select('balance').eq('lawyer_id', caseData.assigned_lawyer_id).single()
    if (!wallet) throw new Error('Wallet not found')

    await supabase.from('lawyer_wallets').update({ balance: wallet.balance + DEDUCTION }).eq('lawyer_id', caseData.assigned_lawyer_id)

    await supabase.from('wallet_transactions').insert({
        lawyer_id: caseData.assigned_lawyer_id,
        amount: DEDUCTION,
        case_id: caseId,
        type: 'REFUND_CANCELLED',
        description: `Refund for cancelled client case ${caseId}`
    })

    await supabase.from('cases').update({
        status: 'CANCELLED_BY_CLIENT',
        close_reason: reason
    }).eq('id', caseId)

    // Update Stats
    // Ideally use RPC, handling manual inc here
    const { data: stats } = await supabase.from('lawyer_stats').select('cases_cancelled, cases_assigned').eq('lawyer_id', caseData.assigned_lawyer_id).single()

    let statsParams = { cases_cancelled: 1 }
    let currentCancelled = 1
    let currentAssigned = 1 // avoid div/0

    if (stats) {
        statsParams.cases_cancelled = stats.cases_cancelled + 1
        currentCancelled = statsParams.cases_cancelled
        currentAssigned = stats.cases_assigned || 1
        await supabase.from('lawyer_stats').update(statsParams).eq('lawyer_id', caseData.assigned_lawyer_id)
    } else {
        await supabase.from('lawyer_stats').insert({ lawyer_id: caseData.assigned_lawyer_id, cases_cancelled: 1 })
    }

    // Check Trigger
    const cancellationRate = currentCancelled / currentAssigned
    if (cancellationRate > 0.30) {
        // TODO: Send Alert to Admin
        console.warn(`[ALERT] Lawyer ${caseData.assigned_lawyer_id} cancellation rate > 30%: ${cancellationRate}`)
    }

    revalidatePath('/dashboard')
    return { success: true }
}
