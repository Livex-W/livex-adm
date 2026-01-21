'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui';
import { Link2, CalendarDays, DollarSign, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { usePartnerStore } from '@/lib/partner-store';
import Link from 'next/link';
import { ROUTES } from '@/routes';

export default function PartnerDashboardPage() {
    const { dashboard, dashboardLoading, fetchDashboard } = usePartnerStore();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(cents / 100);
    };

    const stats = [
        {
            label: 'Ingresos Generados',
            value: dashboard ? formatCurrency(dashboard.totalRevenue) : '$0',
            icon: DollarSign,
            color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
        },
        {
            label: 'Comisiones Ganadas',
            value: dashboard ? formatCurrency(dashboard.totalCommissions) : '$0',
            icon: TrendingUp,
            color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400',
        },
        {
            label: 'Códigos Activos',
            value: dashboard?.activeCodesCount ?? 0,
            icon: Link2,
            color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
        },
        {
            label: 'Usos Totales',
            value: dashboard?.totalUses ?? 0,
            icon: CalendarDays,
            color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400',
        },
        {
            label: 'Reservas Confirmadas',
            value: dashboard?.confirmedBookingsCount ?? 0,
            icon: CheckCircle2,
            color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
        },
        {
            label: 'Reservas Pendientes',
            value: dashboard?.pendingBookingsCount ?? 0,
            icon: Clock,
            color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Dashboard Partner
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Resumen de tus estadísticas y comisiones.
                </p>
            </div>

            {dashboardLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.label} className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {stat.label}
                                        </p>
                                        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${stat.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href={ROUTES.PARTNER.REFERRAL_CODES.LIST}>
                    <Card className="p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                <Link2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                    Ver Códigos de Referido
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Consulta tus códigos y estadísticas
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href={ROUTES.PARTNER.BOOKINGS}>
                    <Card className="p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                <CalendarDays className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                    Historial de Reservas
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Reservas realizadas con tus códigos
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
