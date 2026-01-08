export default function VerticalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b border-gray-200 bg-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <span className="font-bold text-lg text-primary">AL Vertical</span>
                    <nav className="text-sm space-x-4">
                        <span className="text-accent font-medium">Urgency Mode</span>
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
