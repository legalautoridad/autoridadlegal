export type Profile = {
    id: string;
    email: string;
    full_name: string | null;
    reputation_score: number;
    credit_balance: number;
    created_at: string;
};

export type LeadStatus = 'new' | 'reserved' | 'claimed' | 'resolved' | 'expired';

export type Lead = {
    id: string;
    vertical: string;
    city: string; // Added
    status: LeadStatus;
    customer_name?: string; // Added
    customer_email?: string; // Added
    customer_phone?: string; // Added
    agreed_price: number; // Added
    amount_paid: number; // Added
    unlock_price: number;
    quality_score: number | null;
    ai_summary: string | null;
    exclusive_winner_id: string | null;
    created_at: string;
    unlocked_at?: string;
};

export type TransactionType = 'deposit' | 'withdrawal' | 'lead_purchase';

export type Transaction = {
    id: string;
    profile_id: string;
    amount: number;
    description: string | null;
    type: TransactionType;
    created_at: string;
};
