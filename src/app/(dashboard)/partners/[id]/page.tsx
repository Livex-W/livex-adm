'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@/components/ui';
import { ArrowLeft, Plus, Loader2, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';
import { usePartnerDetail } from '@/hooks/useAdmin';
import { PartnerCodeForm } from '@/components/partner/PartnerCodeForm';
import { PartnerCodeTable } from '@/components/partner/PartnerCodeTable';

export default function PartnerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const partnerId = params.id as string;
    const [showCreateCode, setShowCreateCode] = useState(false);

    const { data: partner, isLoading, error } = usePartnerDetail(partnerId);

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(cents / 100);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !partner) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Partner no encontrado</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {partner.full_name}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {partner.email}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Ingresos Totales</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {formatCurrency(partner.stats.total_revenue)}
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
                            <p className="text-sm font-medium text-slate-500">Reservas Totales</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {partner.stats.total_bookings}
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
                            <p className="text-sm font-medium text-slate-500">Reservas Confirmadas</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {partner.stats.confirmed_bookings}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Referral Codes */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Códigos de Referido</CardTitle>
                        <CardDescription>Códigos asignados a este partner</CardDescription>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => setShowCreateCode(true)}
                        leftIcon={<Plus className="h-4 w-4" />}
                    >
                        Nuevo Código
                    </Button>
                </CardHeader>
                <CardContent>
                    {showCreateCode && (
                        <PartnerCodeForm
                            partnerId={partnerId}
                            onSuccess={() => setShowCreateCode(false)}
                            onCancel={() => setShowCreateCode(false)}
                        />
                    )}
                    <PartnerCodeTable codes={partner.referralCodes} />
                </CardContent>
            </Card>
        </div>
    );
}
