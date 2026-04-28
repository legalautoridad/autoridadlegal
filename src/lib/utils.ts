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
        .replace(/\[LEAD_DATA:.*?\]/gs, "")
        .replace(/\[PAYMENT_BUTTON:.*?\]/gs, "")
        .replace(/\[LEAD_FORM:.*?\]/gs, "")
        .replace(/\[FREE_CALL_REQUEST\]/gs, "")
        .replace(/\[PAYMENT_LINK_DISCOUNT\]/gs, "")
        .trim();
}
