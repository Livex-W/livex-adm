'use client';

import { ROUTES } from '@/routes';
import { useAuthStore } from '@/lib/auth-store';
import { useAdminStats, useAdminResorts } from '@/hooks/useAdmin';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, StatusBadge, Button } from '@/components/ui';
import {
    Building2,
    Compass,
    CalendarCheck,
    Users,
    TrendingUp,
    ArrowUpRight,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
    const { user } = useAuthStore();
    const userName = user?.fullName?.split(' ')[0] || 'Admin';

    // Use React Query hooks with automatic caching
    const { data: stats, isLoading: statsLoading } = useAdminStats();
    const { data: pendingResortsData } = useAdminResorts({
        status: 'under_review',
        limit: 5
    });

    const resorts = pendingResortsData?.data || [];
    const isLoading = statsLoading;

    const kpis = [
        {
            title: 'Total Resorts',
            value: stats?.totalResorts.toString() || '-',
            subtitle: `${stats?.resortsApproved || 0} aprobados`,
            icon: Building2,
            color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
            loading: isLoading
        },
        {
            title: 'Experiencias',
            value: stats?.totalExperiences.toString() || '-',
            subtitle: 'En la plataforma',
            icon: Compass,
            color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
            loading: isLoading
        },
        {
            title: 'Pendientes',
            value: stats?.resortsUnderReview.toString() || '-',
            subtitle: 'Por revisar',
            icon: Clock,
            color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
            loading: isLoading
        },
        {
            title: 'Agentes',
            value: stats?.totalAgents.toString() || '-',
            subtitle: 'Registrados',
            icon: Users,
            color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
            loading: isLoading
        }
    ];

    const getStatusBadge = (status: string) => {
        // Map to StatusBadge expected statuses
        const statusMap: Record<string, string> = {
            'approved': 'completed',
            'under_review': 'under_review',
            'rejected': 'rejected',
            'draft': 'draft',
        };
        return <StatusBadge status={statusMap[status] || 'draft'} />;
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Hola, {userName} 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Panel de administración de Livex
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Admin Activo
                    </span>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={index} padding="none" className="overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between space-y-0 pb-2">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {kpi.title}
                                    </p>
                                    <div className={`p-2 rounded-lg ${kpi.color}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2 mt-2">
                                    {kpi.loading ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                    ) : (
                                        <>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                {kpi.value}
                                            </h3>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {kpi.subtitle}
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content Split */}
            <div className="grid gap-4 lg:grid-cols-7">
                {/* Pending Resorts */}
                <Card className="lg:col-span-4" padding="none">
                    <CardHeader className="px-4 sm:px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                Resorts Pendientes de Revisión
                            </CardTitle>
                            <Link href={ROUTES.DASHBOARD.RESORTS.LIST} className="text-sm font-medium text-primary hover:text-primary-hover">
                                Ver todos
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                            </div>
                        ) : resorts.length === 0 ? (
                            <div className="text-center p-8 text-slate-500">
                                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500 opacity-50" />
                                <p>No hay resorts pendientes de revisión</p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile Cards */}
                                <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                                    {resorts.slice(0, 5).map((resort) => (
                                        <Link
                                            key={resort.id}
                                            href={`/resorts/${resort.id}`}
                                            className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                                    {resort.name || 'Sin nombre'}
                                                </span>
                                                {getStatusBadge(resort.status)}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {resort.city || 'Sin ciudad'}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
                                            <tr>
                                                <th className="px-6 py-3">Resort</th>
                                                <th className="px-6 py-3">Ciudad</th>
                                                <th className="px-6 py-3">Estado</th>
                                                <th className="px-6 py-3">Fecha</th>
                                                <th className="px-6 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {resorts.slice(0, 5).map((resort) => (
                                                <tr
                                                    key={resort.id}
                                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                                                        {resort.name || 'Sin nombre'}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        {resort.city || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(resort.status)}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        {formatDate(resort.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link href={`/resorts/${resort.id}`}>
                                                            <Button variant="ghost" size="sm">
                                                                Revisar
                                                                <ArrowUpRight className="h-4 w-4 ml-1" />
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="lg:col-span-3 space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Acciones Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href={ROUTES.DASHBOARD.RESORTS.LIST} className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <Building2 className="h-4 w-4 mr-2" />
                                    Ver todos los resorts
                                </Button>
                            </Link>
                            <Link href={ROUTES.DASHBOARD.EXPERIENCES.LIST} className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <Compass className="h-4 w-4 mr-2" />
                                    Ver experiencias
                                </Button>
                            </Link>
                            <Link href={ROUTES.DASHBOARD.BOOKINGS} className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <CalendarCheck className="h-4 w-4 mr-2" />
                                    Ver reservas
                                </Button>
                            </Link>
                            <Link href={ROUTES.DASHBOARD.AGENTS.LIST} className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="h-4 w-4 mr-2" />
                                    Ver agentes
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* System Status */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                                Estado del Sistema
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Plataforma</span>
                                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                        Operativo
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">API Backend</span>
                                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                        Conectado
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
