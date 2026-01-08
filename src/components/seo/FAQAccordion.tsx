import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    items: FAQItem[];
    className?: string;
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
    return (
        <div className={cn("space-y-4", className)} itemScope itemType="https://schema.org/FAQPage">
            {items.map((item, index) => (
                <details
                    key={index}
                    className="group border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-300 hover:shadow-md [&[open]]:shadow-lg [&[open]]:border-slate-300"
                    itemScope
                    itemProp="mainEntity"
                    itemType="https://schema.org/Question"
                >
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-slate-900 font-medium group-hover:text-primary transition-colors">
                        <span itemProp="name">{item.question}</span>
                        <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-300 group-open:rotate-180" />
                    </summary>
                    <div
                        className="px-6 pb-6 text-slate-600 leading-relaxed text-sm animate-in slide-in-from-top-2 fade-in"
                        itemScope
                        itemProp="acceptedAnswer"
                        itemType="https://schema.org/Answer"
                    >
                        <div itemProp="text" dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </div>
                </details>
            ))}
        </div>
    );
}
