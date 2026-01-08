'use server';

import { createClient } from '@/lib/supabase/server';
import { RegisterData } from '@/app/lawyer/register/page';

export async function registerLawyer(data: RegisterData) {
    const supabase = await createClient();

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                full_name: data.fullName,
                role: 'lawyer', // Optional metadata
            }
        }
    });

    if (authError) {
        return { error: authError.message };
    }

    if (!authData.user) {
        return { error: 'No se pudo crear el usuario.' };
    }

    const userId = authData.user.id;

    // 2. Create Lawyer Profile
    const { error: profileError } = await supabase
        .from('lawyer_profiles')
        .insert({
            id: userId,
            document_type: data.documentType,
            document_number: data.documentNumber,
            bar_association: data.barAssociation,
            bar_number: data.barNumber,
            office_address: data.officeAddress,
            notification_email: data.email, // Default to auth email
            notification_phone: data.notificationPhone,
            is_verified: false,
            verification_status: 'PENDING'
        });

    if (profileError) {
        // If profile fails, we might technically want to rollback auth user, 
        // but purely via Supabase client that's hard. 
        // For MVP we return error. User exists but has no profile.
        console.error('Profile Creation Error:', profileError);
        return { error: 'Error creando perfil de abogado: ' + profileError.message };
    }

    // 3. Create Subscription
    const { error: subError } = await supabase
        .from('lawyer_subscriptions')
        .insert({
            lawyer_id: userId,
            active_zones: data.activeZones,
            active_matters: ['ALCOHOLEMIA'], // Hardcoded as per specs
            monthly_fee: data.price,
            status: 'ACTIVE',
            // stripe_subscription_id: 'sub_mock_123' // Add later
        });

    if (subError) {
        console.error('Subscription Creation Error:', subError);
        return { error: 'Error creando suscripción: ' + subError.message };
    }

    // Success
    return { success: true };
}
