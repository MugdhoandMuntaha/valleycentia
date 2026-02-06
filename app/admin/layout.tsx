import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    // Log for debugging
    console.log('[AdminLayout] User:', user?.id);
    console.log('[AdminLayout] Role:', user?.publicMetadata?.role);

    if (!user || user.publicMetadata.role !== 'admin') {
        redirect('/');
    }

    return (
        <div className="flex min-h-screen bg-black text-white">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
