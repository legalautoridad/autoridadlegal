export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">Política de Privacidad</h1>
            <div className="prose prose-slate">
                <p className="text-slate-600">[TEXTO LEGAL PENDIENTE: Aquí se explicará cómo Autoridad Legal recopila, procesa y protege los datos personales de los usuarios conforme al RGPD, incluyendo el uso de datos para la generación de leads cualificados.]</p>
                <p className="text-slate-600 mt-4">Última actualización: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
