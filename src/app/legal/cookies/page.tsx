export default function CookiesPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">Política de Cookies</h1>
            <div className="prose prose-slate">
                <p className="text-slate-600">[TEXTO LEGAL PENDIENTE: Información sobre el uso de cookies propias y de terceros en el sitio web.]</p>
                <p className="text-slate-600 mt-4">Última actualización: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
