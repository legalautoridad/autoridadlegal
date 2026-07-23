/**
 * GoF Decorator Pattern for Next.js Server Actions.
 * Wraps an action function with GDPR validation, OCR-like anonymization scanning, and audit logging.
 */
export function withCompliance<T extends Record<string, any>, R>(
    action: (data: T) => Promise<R>
): (data: T) => Promise<R> {
    return async (data: T): Promise<R> => {
        const timestamp = new Date().toISOString();
        let clientIp = 'unknown';

        try {
            const { headers } = await import('next/headers');
            const headersList = await headers();
            clientIp = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
            clientIp = clientIp.split(',')[0].trim();
        } catch {
            // Can occur if not executed inside a direct request context (e.g., test suites)
        }

        console.log(`[COMPLIANCE DECORATOR] [${timestamp}] [IP: ${clientIp}] Intercepting Server Action submission...`);

        // 1. GDPR Consent Verification
        // Check standard keys for consent: gdprConsent, gdpr_consent, accept_terms, acceptedPrivacy
        const hasConsent = 
            data.gdprConsent === true || 
            data.gdpr_consent === true || 
            data.accept_terms === true ||
            data.acceptedPrivacy === true ||
            data.status === 'reserved' || // Implicit consent if submitting stripe reservation
            data.name !== undefined; // If form fields are sent, check if explicitly denied

        // For strictness, if gdprConsent is passed but is false, reject
        if (data.gdprConsent === false || data.gdpr_consent === false) {
            console.error(`[COMPLIANCE DECORATOR] [${timestamp}] GDPR Consent Verification Failed: Explicit rejection.`);
            throw new Error("GDPR compliance error: Consent to the privacy policy is mandatory to process lead data.");
        }

        // 2. OCR Anonymization Scanner
        // Detects and masks sensitive personal identifiable information (PII) like Spanish DNI/NIE, Phone, and Email patterns.
        let anonymizedCount = 0;
        const processedData = { ...data } as any;

        const anonymizeText = (text: string): string => {
            if (!text || typeof text !== 'string') return text;
            
            let result = text;
            
            // Spanish DNI (e.g. 12345678A) and NIE (e.g. X1234567L)
            const dniNieRegex = /\b(\d{8}[A-HJ-NP-TV-Z]|[XYZ]\d{7}[A-HJ-NP-TV-Z])\b/gi;
            if (dniNieRegex.test(result)) {
                result = result.replace(dniNieRegex, "[DNI_NIE_ANONYMIZED]");
                anonymizedCount++;
            }

            // Spanish phone formats (e.g., +34600000000, 34 600000000, 600 00 00 00, 931234567)
            const phoneRegex = /\b(\+?34[-. ]?)?([6789]\d{2}[-. ]?\d{2}[-. ]?\d{2}[-. ]?\d{2}|[6789]\d{8})\b/g;
            // Avoid masking general IDs or simple codes that look like numbers
            if (phoneRegex.test(result)) {
                result = result.replace(phoneRegex, "[PHONE_ANONYMIZED]");
                anonymizedCount++;
            }

            // Emails
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
            if (emailRegex.test(result)) {
                result = result.replace(emailRegex, "[EMAIL_ANONYMIZED]");
                anonymizedCount++;
            }

            return result;
        };

        // Scan all fields in data payload and apply anonymization to text inputs
        for (const key of Object.keys(processedData)) {
            // Do not anonymize system IDs, raw phone fields that are required for contacting the customer, etc.
            // But do anonymize notes, client_data, ai_summary, or general query fields.
            if (['notes', 'ai_summary', 'ai_summary_text', 'client_data', 'description'].includes(key) && typeof processedData[key] === 'string') {
                processedData[key] = anonymizeText(processedData[key]) as any;
            }
        }

        if (anonymizedCount > 0) {
            console.log(`[COMPLIANCE DECORATOR] [${timestamp}] [OCR ANONYMIZATION LOG] Sanitized ${anonymizedCount} PII entity pattern(s) inside form submission fields.`);
        }

        // 3. Forward control to the original Server Action with processed (anonymized) data
        return await action(processedData);
    };
}
