'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Button,
    Card,
    CardContent,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    Input,
} from '@/components/ui';
import { Search, Users as UsersIcon, Loader2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAdminAgents } from '@/hooks/useAdmin';
import { formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/routes';

// Custom hook for debounced value
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function AgentsPage() {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search input by 400ms
    const debouncedSearch = useDebounce(searchInput, 400);

    // Use React Query with caching
    const { data, isLoading } = useAdminAgents({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || undefined,
    });

    const agents = data?.data || [];
    const pagination = data?.meta ? {
        total: data.meta.total,
        page: data.meta.page,
        limit: data.meta.limit,
        total_pages: (data.meta as { totalPages?: number }).totalPages || Math.ceil(data.meta.total / data.meta.limit),
    } : null;

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    const handleRowClick = useCallback((agentId: string) => {
        router.push(`/agents/${agentId}`);
    }, [router]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CO', {
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
                        Agentes
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Todos los agentes registrados en la plataforma
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {pagination && (
                        <span className="text-sm text-slate-500">
                            {pagination.total} agentes
                        </span>
                    )}
                    <Button onClick={() => router.push('/agents/new')}>
                        Nuevo Agente
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search with debounce */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Buscar por nombre, email o teléfono..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Agents List */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : agents.length === 0 ? (
                        <div className="text-center p-12">
                            <UsersIcon className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">
                                No se encontraron agentes
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Cards */}
                            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                                {agents.map((agent: any) => (
                                    <div
                                        key={agent.id}
                                        onClick={() => handleRowClick(agent.id)}
                                        className="block p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                {agent.full_name || 'Sin nombre'}
                                            </span>
                                            <span className="text-sm text-emerald-600 font-medium">
                                                {formatCurrency(agent.total_commission_cents || 0)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-500 space-y-1">
                                            <p>{agent.email}</p>
                                            <p>{agent.phone || 'Sin teléfono'}</p>
                                            <div className="flex gap-4">
                                                <span>{agent.resort_count || 0} resorts</span>
                                                <span>{agent.booking_count || 0} reservas</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table - Clickable rows */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Teléfono</TableHead>
                                            <TableHead>Resorts</TableHead>
                                            <TableHead>Reservas</TableHead>
                                            <TableHead>Comisiones</TableHead>
                                            <TableHead>Registro</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {agents.map((agent: any) => (
                                            <TableRow
                                                key={agent.id}
                                                onClick={() => handleRowClick(agent.id)}
                                                className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                            >
                                                <TableCell>
                                                    <div className="font-medium text-slate-900 dark:text-slate-100">
                                                        {agent.full_name || 'Sin nombre'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {agent.email}
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {agent.phone || '-'}
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {agent.resort_count || 0}
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {agent.booking_count || 0}
                                                </TableCell>
                                                <TableCell className="font-medium text-emerald-600">
                                                    {formatCurrency(agent.total_commission_cents || 0)}
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {formatDate(agent.created_at)}
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
            {pagination && pagination.total_pages > 1 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Mostrando {((currentPage - 1) * pagination.limit) + 1} - {Math.min(currentPage * pagination.limit, pagination.total)} de {pagination.total}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline ml-1">Anterior</span>
                                </Button>

                                {/* Page numbers */}
                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.total_pages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= pagination.total_pages - 2) {
                                            pageNum = pagination.total_pages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? 'primary' : 'outline'}
                                                size="sm"
                                                onClick={() => setCurrentPage(pageNum)}
                                                className="min-w-[36px]"
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <span className="sm:hidden text-sm text-slate-500">
                                    {currentPage} / {pagination.total_pages}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(pagination.total_pages, p + 1))}
                                    disabled={currentPage === pagination.total_pages}
                                >
                                    <span className="hidden sm:inline mr-1">Siguiente</span>
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
