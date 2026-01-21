'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, Badge, Button } from '@/components/ui';
import { ArrowLeft, TrendingUp, Calendar, Users, DollarSign, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { usePartnerStore } from '@/lib/partner-store';
import Link from 'next/link';
import { ROUTES } from '@/routes';

export default function PartnerReferralCodeDetailPage() {
    const params = useParams();
    const codeId = params.id as string;
    const { selectedCodeStats, selectedCodeStatsLoading, fetchReferralCodeStats } = usePartnerStore();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (codeId) {
            fetchReferralCodeStats(codeId).catch((err) => {
                setError('No se pudo cargar las estadísticas del código.');
                console.error(err);
            });
        }
    }, [codeId, fetchReferralCodeStats]);

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(cents / 100);
    };

    const formatCommission = (type: string, value: number) => {
        if (type === 'percentage') {
            return `${(value / 100).toFixed(1)}%`;
        }
        return formatCurrency(value);
    };

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (selectedCodeStatsLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !selectedCodeStats) {
        return (
            <div className="space-y-6">
                <Link href={ROUTES.PARTNER.REFERRAL_CODES.LIST}>
                    <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                        Volver a Códigos
                    </Button>
                </Link>
                <Card className="p-8 text-center">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {error || 'Código no encontrado'}
                    </h3>
                </Card>
            </div>
        );
    }

    const stats = selectedCodeStats;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={ROUTES.PARTNER.REFERRAL_CODES.LIST}>
                    <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                        Volver
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
                        {stats.code.code}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {stats.code.description || 'Sin descripción'}
                    </p>
                </div>
                <Badge variant={stats.code.isActive ? 'success' : 'outline'}>
                    {stats.code.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Ingresos Generados
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {formatCurrency(stats.totalRevenue)}
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Comisión Ganada
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {formatCurrency(stats.totalCommissions)}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {formatCommission(stats.code.agentCommissionType, stats.code.agentCommissionCents)} por reserva
                            </p>
                        </div>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Usos Totales
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {stats.code.usageCount}
                                {stats.code.usageLimit && <span className="text-sm text-slate-400 font-normal"> / {stats.code.usageLimit}</span>}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Tasa de Conversión
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {stats.conversionRate}%
                            </p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Booking Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="text-sm text-slate-500">Reservas Confirmadas</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                {stats.confirmedBookings}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-amber-500" />
                        <div>
                            <p className="text-sm text-slate-500">Reservas Pendientes</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                {stats.pendingBookings}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <div>
                            <p className="text-sm text-slate-500">Reservas Canceladas</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                {stats.cancelledBookings}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Code Details */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Detalles del Código
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-slate-500">Tipo de Comisión</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                            {stats.code.agentCommissionType === 'percentage' ? 'Porcentual' : 'Fija'}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500">Primer Uso</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                            {formatDate(stats.firstUse)}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500">Último Uso</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                            {formatDate(stats.lastUse)}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500">Fecha de Expiración</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                            {stats.code.expiresAt ? formatDate(stats.code.expiresAt) : 'Sin expiración'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
