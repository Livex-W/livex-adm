'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    DollarSign,
    Link2,
    BarChart3,
    Settings,
    LogOut,
    X,
    CalendarCheck,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui';
import { ROUTES, isRouteActive } from '@/routes';

interface AgentSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const AGENT_NAV_ITEMS: NavItem[] = [
    { label: 'Inicio', href: ROUTES.AGENT.HOME, icon: LayoutDashboard },
    { label: 'Mis Reservas', href: ROUTES.AGENT.BOOKINGS, icon: CalendarCheck },
    { label: 'Códigos de Referido', href: ROUTES.AGENT.REFERRAL_CODES, icon: Link2 },
    { label: 'Configuración', href: ROUTES.AGENT.SETTINGS, icon: Settings },
];

export function AgentSidebar({ isOpen, setIsOpen }: AgentSidebarProps) {
    const pathname = usePathname();
    const { logout, user } = useAuthStore();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    `
                    fixed top-0 left-0 z-40 h-screen w-64
                    bg-white dark:bg-slate-900
                    border-r border-slate-200 dark:border-slate-800
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static
                    flex flex-col
                    `,
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
                    <Link href={ROUTES.AGENT.HOME} className="flex items-center gap-2 font-bold text-xl text-primary">
                        <span>Livex BNG</span>
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-normal">Agente</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {AGENT_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = isRouteActive(pathname, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    `
                                    flex items-center gap-3 px-3 py-2 rounded-lg
                                    text-sm font-medium transition-colors
                                    `,
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                            {user?.fullName?.substring(0, 2).toUpperCase() || 'AG'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                {user?.fullName || 'Agent User'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                        onClick={logout}
                        leftIcon={<LogOut className="h-4 w-4" />}
                    >
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>
        </>
    );
}

