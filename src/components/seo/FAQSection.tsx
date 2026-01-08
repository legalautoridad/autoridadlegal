import { FAQS } from "@/data/faqs";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

type Props = {
    category: string;
    city: string;
};

export function FAQSection({ category, city }: Props) {
    // Filter FAQs by category (normalize to match data source types)
    const normalizedCategory = category.toLowerCase() as 'alcoholemia' | 'accidentes' | 'herencias';
    const filteredFaqs = FAQS.filter(f => f.category === normalizedCategory);

    if (filteredFaqs.length === 0) return null;

    // Prepare Schema.org Data (FAQPage)
    const schemaData = {
        mainEntity: filteredFaqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer // Schema handles HTML in text
            }
        }))
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <SchemaOrg type="FAQPage" data={schemaData} />

                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-full mb-2">
                        <MessageCircleQuestion className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif">
                        Preguntas Frecuentes sobre {category === 'alcoholemia' ? 'Alcoholemia' : category === 'accidentes' ? 'Accidentes' : 'Herencias'} en {city}
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Respuestas directas basadas en el Código Penal y la legislación vigente en 2025.
                    </p>
                </div>

                <div className="space-y-4">
                    {filteredFaqs.map((faq, index) => (
                        <details
                            key={index}
                            className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md open:bg-white open:ring-1 open:ring-blue-100"
                        >
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
                                <h3 className="text-lg font-bold text-slate-800 pr-8 group-hover:text-blue-700 transition-colors">
                                    {faq.question}
                                </h3>
                                <div className="p-2 bg-white rounded-full text-slate-400 group-open:rotate-180 group-open:bg-blue-50 group-open:text-blue-600 transition-all duration-300 shadow-sm border border-slate-100">
                                    <ChevronDown className="w-5 h-5" />
                                </div>
                            </summary>
                            <div
                                className="px-6 pb-6 text-slate-600 leading-relaxed prose prose-slate max-w-none prose-p:my-2 prose-strong:text-slate-800 prose-strong:font-bold"
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                        </details>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-400 italic">
                        * Esta información es orientativa y no sustituye el asesoramiento legal personalizado.
                    </p>
                </div>
            </div>
        </section>
    );
}
