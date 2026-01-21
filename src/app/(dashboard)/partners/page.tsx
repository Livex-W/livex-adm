'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Button,
    Card,
    CardContent,
    Input,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    Badge
} from '@/components/ui';
import { Search, Loader2, ChevronLeft, ChevronRight, Plus, UserPlus } from 'lucide-react';
import { ROUTES } from '@/routes';
import { useAdminPartners } from '@/hooks/useAdmin';
import { useDebounce } from '@/hooks/useDebounce';

export default function PartnersPage() {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedSearch = useDebounce(searchInput, 400);

    const { data, isLoading } = useAdminPartners({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || undefined,
    });

    const partners = data?.data || [];
    const pagination = data?.meta;

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(cents / 100);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Partners
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Gestiona los partners y sus códigos de referido
                    </p>
                </div>
                <Link href={ROUTES.DASHBOARD.PARTNERS.NEW}>
                    <Button leftIcon={<Plus className="h-4 w-4" />}>
                        Nuevo Partner
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar por nombre, email..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Partners List */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : partners.length === 0 ? (
                        <div className="text-center p-12">
                            <UserPlus className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">
                                No se encontraron partners
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Cards */}
                            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                                {partners.map((partner) => (
                                    <Link
                                        key={partner.id}
                                        href={ROUTES.DASHBOARD.PARTNERS.DETAIL(partner.id)}
                                        className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                {partner.full_name}
                                            </span>
                                            <Badge variant="info">{partner.codes_count} códigos</Badge>
                                        </div>
                                        <div className="text-sm text-slate-500 space-y-1">
                                            <p>{partner.email}</p>
                                            <p className="font-medium">{formatCurrency(partner.total_revenue_cents)}</p>
                                            <p className="text-xs">{formatDate(partner.created_at)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Partner</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Teléfono</TableHead>
                                            <TableHead>Códigos</TableHead>
                                            <TableHead>Ingresos</TableHead>
                                            <TableHead>Registrado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {partners.map((partner) => (
                                            <TableRow
                                                key={partner.id}
                                                onClick={() => router.push(ROUTES.DASHBOARD.PARTNERS.DETAIL(partner.id))}
                                                className="cursor-pointer"
                                            >
                                                <TableCell>
                                                    <div className="font-medium text-slate-900 dark:text-slate-100">
                                                        {partner.full_name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {partner.email}
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {partner.phone || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="info">{partner.codes_count}</Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(partner.total_revenue_cents)}
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {formatDate(partner.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Página {currentPage} de {pagination.totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={currentPage === pagination.totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
