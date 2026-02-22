'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminResorts, useDeactivateUser } from '@/hooks/useAdmin';
import { Card, CardContent, StatusBadge, Button, Input } from '@/components/ui';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { toast } from 'sonner';
import { Building2, Search, Loader2, ChevronLeft, ChevronRight, UserX } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type ResortStatus = 'all' | 'draft' | 'under_review' | 'approved' | 'rejected';

const STATUS_OPTIONS: { value: ResortStatus; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'draft', label: 'Borrador' },
    { value: 'under_review', label: 'En Revisión' },
    { value: 'approved', label: 'Aprobados' },
    { value: 'rejected', label: 'Rechazados' },
];

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

export default function ResortsPage() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<ResortStatus>('all');
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [userToDeactivate, setUserToDeactivate] = useState<{ id: string, name: string } | null>(null);

    // Debounce search input by 400ms
    const debouncedSearch = useDebounce(searchInput, 400);

    const deactivateUser = useDeactivateUser();

    // Use React Query with caching
    const { data, isLoading: resortsLoading } = useAdminResorts({
        page: currentPage,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: debouncedSearch || undefined,
    });

    const resorts = data?.data || [];
    const resortsPagination = data?.meta ? {
        total: data.meta.total,
        page: data.meta.page,
        limit: data.meta.limit,
        total_pages: (data.meta as { totalPages?: number }).totalPages || Math.ceil(data.meta.total / data.meta.limit),
    } : null;

    // Reset page when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter]);

    const handleRowClick = useCallback((resortId: string) => {
        router.push(`/resorts/${resortId}`);
    }, [router]);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'approved': 'approved',
            'under_review': 'under_review',
            'rejected': 'rejected',
            'draft': 'draft',
        };
        return <StatusBadge status={statusMap[status] || 'draft'} />;
    };

    const handleDeactivate = (e: React.MouseEvent, ownerId: string, name: string) => {
        e.stopPropagation();
        setUserToDeactivate({ id: ownerId, name });
    };

    const confirmDeactivate = () => {
        if (!userToDeactivate) return;

        deactivateUser.mutate(userToDeactivate.id, {
            onSuccess: () => {
                toast.success(`Resort (dueño ${userToDeactivate.name}) desactivado exitosamente.`);
                setUserToDeactivate(null);
            },
            onError: () => {
                toast.error(`Hubo un error al desactivar al resort.`);
                setUserToDeactivate(null);
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Resorts
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Gestiona todos los resorts registrados en la plataforma
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {resortsPagination && (
                        <span className="text-sm text-slate-500">
                            {resortsPagination.total} resorts
                        </span>
                    )}
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
                                    placeholder="Buscar por nombre, email o ciudad..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1 flex-wrap">
                                {STATUS_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setStatusFilter(option.value)}
                                        className={`cursor-pointer px-3 py-1.5 text-sm rounded-lg transition-colors ${statusFilter === option.value
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Resorts List */}
            <Card>
                <CardContent className="p-0">
                    {resortsLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : resorts.length === 0 ? (
                        <div className="text-center p-12">
                            <Building2 className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">
                                No se encontraron resorts
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Cards */}
                            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                                {resorts.map((resort) => (
                                    <div
                                        key={resort.id}
                                        onClick={() => handleRowClick(resort.id)}
                                        className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                {resort.name || 'Sin nombre'}
                                            </span>
                                            {getStatusBadge(resort.status)}
                                        </div>
                                        <div className="text-sm text-slate-500 space-y-1">
                                            <p>{resort.owner_email || 'Sin email'}</p>
                                            <p>{resort.city || 'Sin ciudad'}</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${resort.owner_is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {resort.owner_is_active !== false ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </div>
                                            <p className="text-xs">{formatDate(resort.created_at)}</p>
                                        </div>
                                        {resort.owner_is_active !== false && (
                                            <div className="mt-2 flex justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e: React.MouseEvent) => handleDeactivate(e, resort.owner_user_id, resort.name || 'Sin nombre')}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                                                    title="Desactivar resort"
                                                    disabled={deactivateUser.isPending}
                                                >
                                                    <UserX className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table - Clickable rows */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-medium text-slate-500">Resort</th>
                                            <th className="px-6 py-3 text-left font-medium text-slate-500">Email</th>
                                            <th className="px-6 py-3 text-left font-medium text-slate-500">Ciudad</th>
                                            <th className="px-6 py-3 text-left font-medium text-slate-500">Estado</th>
                                            <th className="px-6 py-3 text-left font-medium text-slate-500">Activo</th>
                                            <th className="px-6 py-3 text-left font-medium text-slate-500">Fecha</th>
                                            <th className="px-6 py-3 text-right font-medium text-slate-500">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {resorts.map((resort) => (
                                            <tr
                                                key={resort.id}
                                                onClick={() => handleRowClick(resort.id)}
                                                className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900 dark:text-slate-100">
                                                        {resort.name || 'Sin nombre'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {resort.owner_email || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {resort.city || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(resort.status)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${resort.owner_is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {resort.owner_is_active !== false ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {formatDate(resort.created_at)}
                                                </td>
                                                <td className="px-6 py-4 flex justify-end">
                                                    {resort.owner_is_active !== false && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e: React.MouseEvent) => handleDeactivate(e, resort.owner_user_id, resort.name || 'Sin nombre')}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                                                            title="Desactivar resort"
                                                            disabled={deactivateUser.isPending}
                                                        >
                                                            <UserX className="h-4 w-4" />
                                                        </Button>
                                                    )}
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

            {/* Pagination */}
            {resortsPagination && resortsPagination.total_pages > 1 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Mostrando {((currentPage - 1) * resortsPagination.limit) + 1} - {Math.min(currentPage * resortsPagination.limit, resortsPagination.total)} de {resortsPagination.total}
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
                                    {Array.from({ length: Math.min(5, resortsPagination.total_pages) }, (_, i) => {
                                        let pageNum;
                                        if (resortsPagination.total_pages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= resortsPagination.total_pages - 2) {
                                            pageNum = resortsPagination.total_pages - 4 + i;
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
                                    {currentPage} / {resortsPagination.total_pages}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(resortsPagination.total_pages, p + 1))}
                                    disabled={currentPage === resortsPagination.total_pages}
                                >
                                    <span className="hidden sm:inline mr-1">Siguiente</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Deactivation Modal */}
            <Modal
                isOpen={!!userToDeactivate}
                onClose={() => setUserToDeactivate(null)}
                title="Desactivar Resort"
                description={`¿Estás seguro que deseas desactivar el resort ${userToDeactivate?.name}?`}
            >
                <p className="text-slate-600 dark:text-slate-400">
                    Al desactivar a este resort (dueño), el usuario no podrá acceder a la plataforma. Podrás volver a habilitarlo en cualquier momento.
                </p>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setUserToDeactivate(null)} disabled={deactivateUser.isPending}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDeactivate} disabled={deactivateUser.isPending}>
                        {deactivateUser.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserX className="w-4 h-4 mr-2" />}
                        Desactivar
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
