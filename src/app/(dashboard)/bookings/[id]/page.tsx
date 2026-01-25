'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminBookingDetail } from '@/hooks/useAdmin';
import { Button, Card, StatusBadge } from '@/components/ui';
import { ROUTES } from '@/routes';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Mail,
    Phone,
    User,
    Loader2,
    ImageIcon,
    Receipt,
    CreditCard,
    Building2,
    Briefcase
} from 'lucide-react';

const paymentTypeLabels: Record<string, string> = {
    full_at_resort: 'Pago completo en Resort',
    deposit_to_agent: 'Abono al Agente',
    commission_to_agent: 'Comisión al Agente',
};

const statusConfig: Record<string, { label: string; variant: string }> = {
    pending: { label: 'Pendiente', variant: 'pending' },
    confirmed: { label: 'Confirmada', variant: 'confirmed' },
    completed: { label: 'Completada', variant: 'completed' },
    cancelled: { label: 'Cancelada', variant: 'cancelled' },
};

export default function ResortBookingDetailPage() {
    const { id } = useParams();
    const bookingId = typeof id === 'string' ? id : id?.[0] ?? '';

    const { data: booking, isLoading, error } = useAdminBookingDetail(bookingId);

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
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-500">Cargando reserva...</p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="text-center py-16">
                <p className="text-red-500 font-medium mb-4">{error?.message || 'Reserva no encontrada'}</p>
                <Link href={ROUTES.DASHBOARD.BOOKINGS}>
                    <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                        Volver a Reservas
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Back button */}
            <Link href={ROUTES.DASHBOARD.BOOKINGS}>
                <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} className="text-slate-600 hover:text-slate-900">
                    Volver a Reservas
                </Button>
            </Link>

            {/* Header Card */}
            <Card className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="h-48 md:h-auto md:w-64 bg-slate-100 flex-shrink-0 relative">
                        {booking.experience_image ? (
                            <Image
                                src={booking.experience_image}
                                alt={booking.experience_title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                <ImageIcon className="h-16 w-16" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {booking.experience_title}
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Código: {booking.code || booking.id}
                                </p>
                            </div>
                            <StatusBadge status={statusConfig[booking.status]?.variant || booking.status} />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-indigo-500" />
                                {formatDate(booking.slot_start_time)}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-indigo-500" />
                                {formatTime(booking.slot_start_time)}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Info */}
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Información del Cliente
                        </h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-700 dark:text-slate-300">
                                {booking.client_name || 'Sin nombre'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-700 dark:text-slate-300">
                                {booking.client_email || 'Sin email'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-700 dark:text-slate-300">
                                {booking.client_phone || 'Sin teléfono'}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Booking Source / Agent */}
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Fuente de Reserva
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {booking.agent_name ? (
                            <>
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                    <p className="text-xs text-indigo-600 mb-1 font-medium">REALIZADA POR AGENTE</p>
                                    <div className="font-medium text-slate-900 dark:text-slate-100">
                                        {booking.agent_name}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {booking.agent_email}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-600">Reserva Directa / Online</span>
                            </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Adultos</span>
                                <span className="font-medium">{booking.adults}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-slate-500">Niños</span>
                                <span className="font-medium">{booking.children}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Financial Breakdown */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Receipt className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Detalle Financiero
                    </h2>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Resort Income */}
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Building2 className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-700 dark:text-green-400">Neto para Resort</span>
                            </div>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                {formatCurrency(booking.resort_net_cents, booking.currency)}
                            </p>
                            <p className="text-xs text-green-600/80 mt-1">
                                Ingreso final después de comisiones
                            </p>
                        </div>

                        {/* Agent Commission (if any) */}
                        {booking.booking_source === 'bng' && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCard className="h-4 w-4 text-slate-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Comisión Agente</span>
                                </div>
                                <p className="text-xl font-bold text-slate-700 dark:text-slate-300">
                                    {formatCurrency(booking.agent_commission_cents, booking.currency)}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Valor Total Reserva</span>
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                {formatCurrency(booking.total_cents, booking.currency)}
                            </span>
                        </div>
                    </div>

                    {booking.booking_source === 'bng' && (
                        <div className={`p-4 rounded-lg text-sm border ${booking.agent_payment_type === 'full_at_resort'
                            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                            : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                            }`}>
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                {booking.agent_payment_type === 'full_at_resort' ? (
                                    <CreditCard className="h-4 w-4" />
                                ) : (
                                    <Receipt className="h-4 w-4" />
                                )}
                                Detalles de Pago ADM ({paymentTypeLabels[booking.agent_payment_type] || booking.agent_payment_type})
                            </h3>

                            <div className="space-y-2 mt-2">
                                {booking.agent_payment_type === 'full_at_resort' && (
                                    <p>
                                        El agente <strong>NO recibió dinero</strong>. El cliente debe pagar la totalidad en el resort.
                                        <br />
                                        El resort deberá pagar la comisión al agente posteriormente.
                                    </p>
                                )}
                                {booking.agent_payment_type === 'deposit_to_agent' && (
                                    <p>
                                        El agente cobró su comisión como <strong>anticipo</strong>.
                                        <br />
                                        El cliente solo debe pagar el excedente (Neto Resort) al llegar.
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-black/10 dark:border-white/10">
                                    <div>
                                        <span className="block text-xs opacity-70">Ya pagado al Agente</span>
                                        <span className="font-bold text-lg">
                                            {formatCurrency(booking.amount_paid_to_agent_cents, booking.currency)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-xs opacity-70">A COBRAR EN RESORT</span>
                                        <span className="font-bold text-lg">
                                            {formatCurrency(booking.amount_paid_to_resort_cents, booking.currency)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
