'use client';

import { useState, useEffect } from 'react';
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
import { Search, Loader2, CalendarDays, ChevronLeft, ChevronRight, Users, DollarSign } from 'lucide-react';
import { usePartnerStore } from '@/lib/partner-store';
import Link from 'next/link';
import { ROUTES } from '@/routes';

const statusConfig: Record<string, { label: string; variant: string }> = {
    pending: { label: 'Pendiente', variant: 'pending' },
    confirmed: { label: 'Confirmada', variant: 'confirmed' },
    completed: { label: 'Completada', variant: 'completed' },
    cancelled: { label: 'Cancelada', variant: 'cancelled' },
};

export default function PartnerBookingsPage() {
    const { bookings, bookingsLoading, fetchBookings, bookingsPagination, fetchReferralCodes } = usePartnerStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchBookings({ page: currentPage });
        fetchReferralCodes({ limit: 100 });
    }, [fetchBookings, fetchReferralCodes, currentPage]);

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

    const filteredBookings = bookings.filter(booking =>
        booking.experienceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.resortName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = bookingsPagination?.totalPages || 1;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Historial de Reservas
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Reservas realizadas con tus códigos de referido
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {bookingsPagination && (
                        <span className="text-sm text-slate-500">
                            {bookingsPagination.total} reservas
                        </span>
                    )}
                </div>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Buscar por experiencia, resort o código..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    {bookingsLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : filteredBookings.length === 0 ? (
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
                                {filteredBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                {booking.experienceTitle}
                                            </span>
                                            <StatusBadge status={statusConfig[booking.status]?.variant || booking.status} />
                                        </div>
                                        <div className="text-sm text-slate-500 space-y-1">
                                            <p>{booking.resortName}</p>
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {booking.adults + booking.children} personas
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    {formatCurrency(booking.totalCents)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Link href={ROUTES.PARTNER.REFERRAL_CODES.DETAIL(booking.referralCodeId)}>
                                                    <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">
                                                        {booking.referralCode}
                                                    </span>
                                                </Link>
                                                <span className="text-xs">{formatDate(booking.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Experiencia</TableHead>
                                            <TableHead>Resort</TableHead>
                                            <TableHead>Código</TableHead>
                                            <TableHead>Personas</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Fecha</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBookings.map((booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell>
                                                    <div className="font-medium text-slate-900 dark:text-slate-100">
                                                        {booking.experienceTitle}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {booking.resortName}
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={ROUTES.PARTNER.REFERRAL_CODES.DETAIL(booking.referralCodeId)}>
                                                        <span className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline">
                                                            {booking.referralCode}
                                                        </span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                                        <Users className="h-3.5 w-3.5" />
                                                        {booking.adults}
                                                        {booking.children > 0 && `+${booking.children}`}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={statusConfig[booking.status]?.variant || booking.status} />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(booking.totalCents)}
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {formatDate(booking.createdAt)}
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
            {totalPages > 1 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Página {currentPage} de {totalPages}
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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
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
