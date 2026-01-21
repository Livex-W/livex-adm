'use client';

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from '@/components/ui';
import { Link2 } from 'lucide-react';

interface ReferralCode {
    id: string;
    code: string;
    code_type: string;
    agent_commission_type: string;
    agent_commission_cents: number;
    discount_type: string | null;
    discount_value: number;
    is_active: boolean;
    usage_count: number;
    usage_limit: number | null;
    expires_at: string | null;
    description: string | null;
    created_at: string;
    revenue_cents: number;
    bookings_count: number;
}

interface PartnerCodeTableProps {
    codes: ReferralCode[];
}

export function PartnerCodeTable({ codes }: PartnerCodeTableProps) {
    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(cents / 100);
    };

    const formatCommission = (type: string, value: number) => {
        if (type === 'percentage') {
            return `${(value / 100).toFixed(1)}%`;
        }
        return formatCurrency(value);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (codes.length === 0) {
        return (
            <div className="text-center py-8">
                <Link2 className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-500">Este partner no tiene códigos de referido</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Comisión</TableHead>
                        <TableHead>Usos</TableHead>
                        <TableHead>Ingresos</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Creado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {codes.map((code) => (
                        <TableRow key={code.id}>
                            <TableCell>
                                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                    {code.code}
                                </span>
                                {code.description && (
                                    <p className="text-xs text-slate-500">{code.description}</p>
                                )}
                            </TableCell>
                            <TableCell>
                                <span className="font-medium text-green-600">
                                    {formatCommission(code.agent_commission_type, code.agent_commission_cents)}
                                </span>
                                <span className="text-xs text-slate-400 ml-1">
                                    ({code.agent_commission_type === 'percentage' ? '%' : 'fijo'})
                                </span>
                            </TableCell>
                            <TableCell>
                                {code.usage_count}
                                {code.usage_limit && <span className="text-slate-400"> / {code.usage_limit}</span>}
                            </TableCell>
                            <TableCell className="font-medium">
                                {formatCurrency(code.revenue_cents)}
                            </TableCell>
                            <TableCell>
                                <Badge variant={code.is_active ? 'success' : 'outline'}>
                                    {code.is_active ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-slate-500">
                                {formatDate(code.created_at)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
