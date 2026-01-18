'use client';

import { useState, useEffect } from 'react';
import { Sidebar, Header } from '@/components/dashboard';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/ui';
import { ROUTES } from '@/routes';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, isLoading, refreshUser } = useAuthStore();
    const router = useRouter();


    useEffect(() => {
        // Hydrate user on mount if needed, handled by persist middleware mostly but refresh confirms validity
        refreshUser().catch(() => { });
    }, [refreshUser]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(ROUTES.AUTH.LOGIN);
        }
    }, [isLoading, user, router]);

    // Prevent flash of unauthorized content while checking auth
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;
    }

    // If no user after loading, show loader while redirecting
    if (!user) {
        return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;
    }

    return (
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 h-full">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
