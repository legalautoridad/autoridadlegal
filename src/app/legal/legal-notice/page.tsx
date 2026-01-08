export default function LegalNoticePage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">Aviso Legal</h1>
            <div className="prose prose-slate">
                <p className="text-slate-600">[TEXTO LEGAL PENDIENTE: Información registral de la empresa propietaria de la web (LSSICE), datos de contacto y exención de responsabilidad sobre el asesoramiento legal automatizado.]</p>
                <p className="text-slate-600 mt-4">Última actualización: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
