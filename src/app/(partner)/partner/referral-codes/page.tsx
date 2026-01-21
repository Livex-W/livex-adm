'use client';

import { useEffect } from 'react';
import { Card, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { Link2, Copy, Tag, BarChart3, Calendar, Loader2 } from 'lucide-react';
import { usePartnerStore } from '@/lib/partner-store';
import { toast } from 'sonner';
import Link from 'next/link';
import { ROUTES } from '@/routes';

export default function PartnerReferralCodesPage() {
    const { referralCodes, referralCodesLoading, fetchReferralCodes } = usePartnerStore();

    useEffect(() => {
        fetchReferralCodes();
    }, [fetchReferralCodes]);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success('Código copiado al portapapeles');
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive
            ? <Badge variant="success">Activo</Badge>
            : <Badge variant="outline">Inactivo</Badge>;
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'discount':
                return <Badge variant="info">Descuento</Badge>;
            case 'commission':
                return <Badge variant="warning">Comisión</Badge>;
            case 'both':
                return <Badge variant="info">Desc + Com</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    const formatCommission = (type: string, value: number) => {
        if (type === 'percentage') {
            return `${(value / 100).toFixed(1)}%`;
        }
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value / 100);
    };

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Códigos de Referido
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Tus códigos promocionales asignados.
                    </p>
                </div>
            </div>

            {referralCodesLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            ) : referralCodes.length === 0 ? (
                <Card className="p-12 text-center">
                    <Link2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                        Sin códigos de referido
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                        Aún no tienes códigos de referido asignados.<br />
                        Contacta al administrador para obtener tus códigos.
                    </p>
                </Card>
            ) : (
                <>
                    {/* Desktop Table */}
                    <Card padding="none" className="hidden md:block overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow hoverable={false}>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Comisión</TableHead>
                                    <TableHead>Usos</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Expira</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {referralCodes.map((code) => (
                                    <TableRow key={code.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                    {code.code}
                                                </span>
                                                <button
                                                    onClick={() => copyCode(code.code)}
                                                    className="cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    <Copy className="h-3 w-3 text-slate-400" />
                                                </button>
                                            </div>
                                            {code.description && (
                                                <p className="text-xs text-slate-500 mt-0.5">{code.description}</p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getTypeBadge(code.codeType)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-green-600 dark:text-green-400">
                                                {formatCommission(code.agentCommissionType, code.agentCommissionCents)}
                                            </span>
                                            <span className="text-xs text-slate-400 ml-1">
                                                ({code.agentCommissionType === 'percentage' ? 'porcentual' : 'fijo'})
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
                                                <span>{code.usageCount}</span>
                                                {code.usageLimit && (
                                                    <span className="text-slate-400">/ {code.usageLimit}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(code.isActive)}
                                        </TableCell>
                                        <TableCell>
                                            {code.expiresAt ? (
                                                <div className="flex items-center gap-1 text-slate-500">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {formatDate(code.expiresAt)}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">Sin expiración</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={ROUTES.PARTNER.REFERRAL_CODES.DETAIL(code.id)}>
                                                <button className="cursor-pointer text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 text-sm font-medium">
                                                    Ver estadísticas
                                                </button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {referralCodes.map((code) => (
                            <Card key={code.id} className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">
                                            {code.code}
                                        </span>
                                        <button
                                            onClick={() => copyCode(code.code)}
                                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <Copy className="h-4 w-4 text-slate-500" />
                                        </button>
                                    </div>
                                    {getStatusBadge(code.isActive)}
                                </div>

                                {code.description && (
                                    <p className="text-sm text-slate-500 mb-3">{code.description}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    <span className="flex items-center gap-1">
                                        <Tag className="h-4 w-4 text-indigo-500" />
                                        {getTypeBadge(code.codeType)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BarChart3 className="h-4 w-4 text-indigo-500" />
                                        {code.usageCount} usos
                                        {code.usageLimit && ` / ${code.usageLimit}`}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <span className="text-xs text-slate-500">Tu comisión</span>
                                        <p className="font-bold text-green-600 dark:text-green-400">
                                            {formatCommission(code.agentCommissionType, code.agentCommissionCents)}
                                        </p>
                                    </div>
                                    <Link href={ROUTES.PARTNER.REFERRAL_CODES.DETAIL(code.id)}>
                                        <button className="cursor-pointer text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 text-sm font-medium">
                                            Ver estadísticas →
                                        </button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
