'use server';

import { createClient } from '@/lib/supabase/server';
import { OnboardingData } from '@/app/lawyer/onboarding/page';
import { redirect } from 'next/navigation';

export async function submitOnboarding(data: OnboardingData) {
    const supabase = await createClient();

    // 1. Get Current User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('User not authenticated');
    }

    // 2. Insert Lawyer Profile
    // We use upsert to allow updates if they come back to onboarding, but normally it's a one-off
    const { error: profileError } = await supabase
        .from('lawyer_profiles')
        .upsert({
            id: user.id,
            document_type: data.documentType,
            document_number: data.documentNumber,
            bar_association: data.barAssociation,
            bar_number: data.barNumber,
            office_address: data.officeAddress,
            notification_email: data.notificationEmail,
            notification_phone: data.notificationPhone,
            website_url: data.websiteUrl,
            is_verified: false,
            verification_status: 'PENDING'
        }, { onConflict: 'id' });

    if (profileError) {
        console.error('Profile Error:', profileError);
        throw new Error('Failed to create lawyer profile: ' + profileError.message);
    }

    // 3. Insert Subscription
    // For MVP, we treat this as a "Paid" subscription immediately
    const { error: subError } = await supabase
        .from('lawyer_subscriptions')
        .insert({
            lawyer_id: user.id,
            active_zones: data.activeZones,
            active_matters: data.activeMatters,
            monthly_fee: data.price,
            status: 'ACTIVE',
            // stripe_subscription_id: 'sub_simulated_' + Date.now() 
        });

    if (subError) {
        console.error('Subscription Error:', subError);
        // Note: If this fails, we strictly should rollback profile, but for MVP we proceed
        throw new Error('Failed to create subscription: ' + subError.message);
    }

    // 4. Success - The client component will handle the redirection or state change
    return { success: true };
}
