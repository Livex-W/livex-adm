'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import apiClient from '@/lib/api-client';
import { Button, Card } from '@/components/ui';
import { BookingStepIndicator } from '@/components/agent/BookingStepIndicator';
import { ROUTES } from '@/routes';
import {
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    ImageIcon,
    Loader2,
    Users
} from 'lucide-react';
import { Experience } from '@/types';

interface SlotData {
    id: string;
    start_time: string;
    end_time: string;
    capacity: number;
    remaining: number;
    price_per_adult_cents?: number;
    price_per_child_cents?: number;
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function NewResortBookingPage() {
    const { experienceId } = useParams();
    const router = useRouter();
    const [experience, setExperience] = useState<Experience | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calendar state
    const [currentMonth, setCurrentMonth] = useState(() => new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [slots, setSlots] = useState<SlotData[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);
    const [monthAvailability, setMonthAvailability] = useState<Set<string>>(new Set());

    // Memoized values for date comparisons
    const todayStr = useMemo(() => new Date().toDateString(), []);
    const todayTime = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t.getTime();
    }, []);
    const selectedDateStr = useMemo(() => selectedDate?.toDateString() || '', [selectedDate]);

    // Fetch experience
    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const response = await apiClient.get<Experience>(
                    `/api/v1/experiences/management/${experienceId}?include_images=true`
                );
                setExperience(response.data);
            } catch (err) {
                console.error('Error fetching experience', err);
                setError('Error al cargar la experiencia');
            } finally {
                setIsLoading(false);
            }
        };

        if (experienceId) {
            fetchExperience();
        }
    }, [experienceId]);

    // Fetch month availability
    useEffect(() => {
        if (!experienceId) return;

        const fetchMonthAvailability = async () => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const startDate = new Date(year, month, 1).toISOString().split('T')[0];
            const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

            try {
                const response = await apiClient.get<{
                    availability: Array<{
                        date: string;
                        slots: SlotData[];
                    }>;
                }>(`/api/v1/experiences/${experienceId}/availability?from=${startDate}&to=${endDate}`);

                const datesWithSlots = new Set<string>();
                if (response.data.availability) {
                    response.data.availability.forEach(day => {
                        const hasAvailable = day.slots.some(slot => slot.remaining > 0);
                        if (hasAvailable) {
                            datesWithSlots.add(day.date);
                        }
                    });
                }
                setMonthAvailability(datesWithSlots);
            } catch (error) {
                console.error('Error fetching month availability', error);
            }
        };

        fetchMonthAvailability();
    }, [currentMonth, experienceId]);

    // Fetch slots when date is selected
    useEffect(() => {
        if (!selectedDate || !experienceId) {
            setSlots([]);
            return;
        }

        const fetchSlots = async () => {
            setIsLoadingSlots(true);
            setSelectedSlot(null);
            const dateStr = selectedDate.toISOString().split('T')[0];

            try {
                const response = await apiClient.get<{
                    availability: Array<{
                        date: string;
                        slots: SlotData[];
                    }>;
                }>(`/api/v1/experiences/${experienceId}/availability?from=${dateStr}&to=${dateStr}`);

                if (response.data.availability?.length > 0) {
                    setSlots(response.data.availability[0].slots);
                } else {
                    setSlots([]);
                }
            } catch (error) {
                console.error('Error fetching slots', error);
                setSlots([]);
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [selectedDate, experienceId]);

    // MEMOIZED: Generate calendar days
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const days: (Date | null)[] = [];
        for (let i = 0; i < startDayOfWeek; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
        while (days.length < 42) days.push(null);

        return days;
    }, [currentMonth]);

    const formatTime = useCallback((timeStr: string) => {
        if (timeStr.includes('T')) return timeStr.substring(11, 16);
        return timeStr.substring(0, 5);
    }, []);

    const goToPrevMonth = useCallback(() => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }, []);

    const goToNextMonth = useCallback(() => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }, []);

    const handleDateSelect = useCallback((date: Date) => {
        setSelectedDate(date);
    }, []);

    const handleSlotSelect = useCallback((slot: SlotData) => {
        setSelectedSlot(slot);
    }, []);

    const handleContinue = useCallback(() => {
        if (!selectedSlot || !selectedDate || !experienceId) return;

        // Navigate to separate form page with all data in URL params
        const params = new URLSearchParams({
            experienceId: experienceId as string,
            slotId: selectedSlot.id,
            date: selectedDate.toISOString().split('T')[0],
            startTime: formatTime(selectedSlot.start_time),
            endTime: formatTime(selectedSlot.end_time),
            remaining: selectedSlot.remaining.toString(),
            ...(selectedSlot.price_per_adult_cents && { priceAdult: selectedSlot.price_per_adult_cents.toString() }),
            ...(selectedSlot.price_per_child_cents && { priceChild: selectedSlot.price_per_child_cents.toString() }),
        });

        router.push(`${ROUTES.DASHBOARD.BOOKINGS}/new/form?${params.toString()}`);
    }, [selectedSlot, selectedDate, experienceId, formatTime, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-500">Cargando experiencia...</p>
                </div>
            </div>
        );
    }

    if (error || !experience) {
        return (
            <div className="text-center py-16">
                <p className="text-red-500 font-medium mb-4">{error || 'Experiencia no encontrada'}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="h-10 w-10 p-0" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Nueva Reserva
                    </h1>
                    <p className="text-slate-500 mt-1">{experience.title}</p>
                </div>
            </div>

            {/* Step Indicator */}
            <BookingStepIndicator currentStep={2} />

            {/* Experience Header */}
            <Card className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="h-32 md:h-auto md:w-48 bg-slate-100 flex-shrink-0 relative">
                        {experience.main_image_url ? (
                            <Image
                                src={experience.main_image_url}
                                alt={experience.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                <ImageIcon className="h-12 w-12" />
                            </div>
                        )}
                    </div>
                    <div className="p-4 flex-1">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {experience.title}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">{experience.description}</p>
                    </div>
                </div>
            </Card>

            {/* Calendar and Slots Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={goToPrevMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h3 className="font-semibold text-lg">
                            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        <button
                            onClick={goToNextMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {WEEKDAYS.map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, index) => {
                            if (!date) return <div key={`empty-${index}`} className="aspect-square" />;

                            const dateTime = new Date(date);
                            dateTime.setHours(0, 0, 0, 0);
                            const past = dateTime.getTime() < todayTime;
                            const today = date.toDateString() === todayStr;
                            const selected = date.toDateString() === selectedDateStr;
                            const dateStr = date.toISOString().split('T')[0];
                            const hasAvailability = monthAvailability.has(dateStr);

                            return (
                                <button
                                    key={date.toISOString()}
                                    onClick={() => !past && handleDateSelect(date)}
                                    disabled={past}
                                    className={`
                                        aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium
                                        transition-all duration-200 relative
                                        ${past ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}
                                        ${selected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
                                        ${today && !selected ? 'bg-indigo-100 text-indigo-700 font-bold' : ''}
                                        ${!past && !selected && !today ? 'border border-gray-200 text-gray-700' : ''}
                                    `}
                                >
                                    <span>{date.getDate()}</span>
                                    {hasAvailability && !past && (
                                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${selected ? 'bg-white' : 'bg-indigo-500'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {selectedDate && (
                        <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-center">
                            <span className="text-sm text-indigo-700 font-medium flex items-center justify-center gap-2">
                                <Calendar size={16} />
                                {selectedDate.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                        </div>
                    )}
                </Card>

                {/* Time Slots */}
                <Card className="p-4">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Clock size={20} />
                        Horarios disponibles
                    </h3>

                    {!selectedDate && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <Calendar className="h-12 w-12 mb-4 text-gray-300" />
                            <p className="text-center">Selecciona una fecha para ver los horarios disponibles</p>
                        </div>
                    )}

                    {selectedDate && isLoadingSlots && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
                            <p className="text-gray-500">Buscando disponibilidad...</p>
                        </div>
                    )}

                    {selectedDate && !isLoadingSlots && slots.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <div className="text-5xl mb-4">😔</div>
                            <p className="text-center font-medium">No hay horarios disponibles</p>
                            <p className="text-sm text-center mt-1">Intenta seleccionar otra fecha</p>
                        </div>
                    )}

                    {selectedDate && !isLoadingSlots && slots.length > 0 && (
                        <div className="space-y-3">
                            {slots.map(slot => {
                                const isSlotSelected = selectedSlot?.id === slot.id;
                                const isSoldOut = slot.remaining === 0;

                                return (
                                    <button
                                        key={slot.id}
                                        onClick={() => !isSoldOut && handleSlotSelect(slot)}
                                        disabled={isSoldOut}
                                        className={`
                                            w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                                            ${isSoldOut
                                                ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                                : isSlotSelected
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSlotSelected ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                    <Clock size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">
                                                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Users size={14} />
                                                        <span>{isSoldOut ? 'Agotado' : `${slot.remaining} cupos disponibles`}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {isSlotSelected && (
                                                <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    ✓ Seleccionado
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => router.push(ROUTES.DASHBOARD.BOOKINGS + '/new')}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleContinue}
                    disabled={!selectedSlot || !selectedDate}
                    className={!selectedSlot || !selectedDate ? 'opacity-50' : ''}
                >
                    Continuar →
                </Button>
            </div>
        </div>
    );
}
