export default function LawyerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* 
        Ideally we would have a shared Sidebar or Nav here.
        For now we just wrap the content.
        Auth check is handled by Middleware + Server Actions.
      */}
            {children}
        </div>
    )
}
