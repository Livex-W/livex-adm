'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminBookings } from '@/hooks/useAdmin';
import {
    Button,
    Input,
    Card,
    CardContent,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    StatusBadge
} from '@/components/ui';
import { Search, Loader2, ImageIcon, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

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

const statusConfig: Record<string, { label: string; variant: string }> = {
    pending: { label: 'Pendiente', variant: 'pending' },
    confirmed: { label: 'Confirmada', variant: 'confirmed' },
    completed: { label: 'Completada', variant: 'completed' },
    cancelled: { label: 'Cancelada', variant: 'cancelled' },
};

export default function BookingsPage() {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search input by 400ms
    const debouncedSearch = useDebounce(searchInput, 400);

    // Use React Query with caching
    const { data, isLoading } = useAdminBookings({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || undefined,
    });

    const bookings = data?.data || [];
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

    const handleRowClick = useCallback((bookingId: string) => {
        router.push(`/bookings/${bookingId}`);
    }, [router]);

    const formatCurrency = (cents: number, currency = 'COP') => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        }).format(cents / 100);
    };

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
                        Reservas
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Todas las reservas de la plataforma
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {pagination && (
                        <span className="text-sm text-slate-500">
                            {pagination.total} reservas
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
                                    placeholder="Buscar por cliente, experiencia o resort..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings List */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center p-12">
                            <CalendarDays className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">
                                No se encontraron reservas
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Cards */}
                            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                                {bookings.map((booking: any) => (
                                    <div
                                        key={booking.id}
                                        onClick={() => handleRowClick(booking.id)}
                                        className="block p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                {booking.client_name || booking.client?.full_name || 'Sin nombre'}
                                            </span>
                                            <StatusBadge status={statusConfig[booking.status]?.variant || booking.status} />
                                        </div>
                                        <div className="text-sm text-slate-500 space-y-1">
                                            <p>{booking.experience_title || booking.experience?.title || 'Experiencia'}</p>
                                            <p>{booking.resort_name || 'Resort'}</p>
                                            <p className="font-medium">{formatCurrency(booking.total_cents || 0)}</p>
                                            <p className="text-xs">{formatDate(booking.created_at)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table - Clickable rows */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Experiencia</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Resort</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Fecha</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookings.map((booking: any) => (
                                            <TableRow
                                                key={booking.id}
                                                onClick={() => handleRowClick(booking.id)}
                                                className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                            {booking.experience_image || booking.experience?.main_image_url ? (
                                                                <Image
                                                                    src={booking.experience_image || booking.experience?.main_image_url}
                                                                    alt={booking.experience_title || booking.experience?.title || 'Experiencia'}
                                                                    width={48}
                                                                    height={48}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <ImageIcon className="h-5 w-5 text-slate-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900 dark:text-slate-100">
                                                                {booking.experience_title || booking.experience?.title || 'Experiencia'}
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                código: {booking.code || booking.id.slice(0, 8)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {booking.client_name || booking.client?.full_name || 'Sin nombre'}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {booking.client_email || booking.client?.email || ''}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {booking.resort_name || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={statusConfig[booking.status]?.variant || booking.status} />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(booking.total_cents || 0)}
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {formatDate(booking.created_at)}
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
