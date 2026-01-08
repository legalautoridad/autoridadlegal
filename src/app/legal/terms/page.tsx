export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">Términos y Condiciones de Contratación</h1>
            <div className="prose prose-slate">
                <p className="text-slate-600">[TEXTO LEGAL PENDIENTE: Aquí se detallarán las condiciones de uso de la plataforma, la relación entre el usuario (cliente) y el abogado (proveedor), y el rol de Autoridad Legal como intermediario tecnológico.]</p>
                <p className="text-slate-600 mt-4">Última actualización: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
