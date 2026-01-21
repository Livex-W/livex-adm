'use client';

import { useState, useEffect } from 'react';
import { PartnerSidebar } from '@/components/partner';
import { Header } from '@/components/dashboard';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/ui';
import { ROUTES } from '@/routes';

export default function PartnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, isLoading, checkAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        checkAuth().catch(() => { });
    }, [checkAuth]);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push(ROUTES.AUTH.LOGIN);
            } else if (user.role !== 'partner') {
                // Redirect non-partners to their respective dashboards
                if (user.role === 'admin') {
                    router.push(ROUTES.DASHBOARD.HOME);
                } else {
                    router.push(ROUTES.AUTH.LOGIN);
                }
            }
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;
    }

    if (!user || user.role !== 'partner') {
        return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;
    }

    return (
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
            <PartnerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

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
