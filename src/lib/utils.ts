import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
}

export function cleanMessageContent(content: string): string {
    if (!content) return "";
    return content
        .replace(/\[LEAD_DATA:[\s\S]*?\]/g, "")
        .replace(/\[SLOTS:[\s\S]*?\]/g, "")
        .replace(/\[PAYMENT_BUTTON:[\s\S]*?\]/g, "")
        .replace(/\[LEAD_FORM:[\s\S]*?\]/g, "")
        .replace(/\[SAVE_LEAD:[\s\S]*?\]/g, "")
        .replace(/\[DEBUG:[\s\S]*?\]/g, "")
        .replace(/\[FREE_CALL_REQUEST\]/g, "")
        .replace(/\[PAYMENT_LINK_DISCOUNT\]/g, "")
        .trim();
}
