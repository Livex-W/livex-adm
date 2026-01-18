'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Button, Card } from '@/components/ui';

interface SlotData {
    id: string;
    start_time: string;
    end_time: string;
    capacity: number;
    remaining: number;
    price_per_adult_cents?: number;
    price_per_child_cents?: number;
}

interface AgentSlotSelectorProps {
    experience: { id: string; title: string };
    onSelect: (slot: SlotData, date: string) => void;
    onBack: () => void;
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function AgentSlotSelectorComponent({ experience, onSelect, onBack }: AgentSlotSelectorProps) {
    const [currentMonth, setCurrentMonth] = useState(() => new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [slots, setSlots] = useState<SlotData[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);

    // Availability for the entire month (to show dots)
    const [monthAvailability, setMonthAvailability] = useState<Set<string>>(new Set());
    const [isLoadingMonth, setIsLoadingMonth] = useState(false);

    // Memoize today string to avoid recalculating
    const todayStr = useMemo(() => new Date().toDateString(), []);
    const todayForComparison = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t.getTime();
    }, []);
    const selectedDateStr = useMemo(() => selectedDate?.toDateString() || '', [selectedDate]);

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const days: (Date | null)[] = [];

        // Empty slots before first day
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Days of month
        for (let d = 1; d <= daysInMonth; d++) {
            days.push(new Date(year, month, d));
        }

        // Fill remaining to complete 6 weeks (42 cells)
        while (days.length < 42) {
            days.push(null);
        }

        return days;
    }, [currentMonth]);

    // Fetch month availability when month changes
    useEffect(() => {
        const fetchMonthAvailability = async () => {
            setIsLoadingMonth(true);

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
                }>(
                    `/api/v1/experiences/${experience.id}/availability?from=${startDate}&to=${endDate}`
                );

                const datesWithSlots = new Set<string>();
                if (response.data.availability) {
                    response.data.availability.forEach(day => {
                        // Only mark if there are slots with remaining capacity
                        const hasAvailable = day.slots.some(slot => slot.remaining > 0);
                        if (hasAvailable) {
                            datesWithSlots.add(day.date);
                        }
                    });
                }
                setMonthAvailability(datesWithSlots);
            } catch (error) {
                console.error('Error fetching month availability', error);
                setMonthAvailability(new Set());
            } finally {
                setIsLoadingMonth(false);
            }
        };

        fetchMonthAvailability();
    }, [currentMonth, experience.id]);

    // Fetch slots when date is selected
    useEffect(() => {
        if (!selectedDate) {
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
                }>(
                    `/api/v1/experiences/${experience.id}/availability?from=${dateStr}&to=${dateStr}`
                );

                if (response.data.availability && response.data.availability.length > 0) {
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
    }, [selectedDate, experience.id]);

    const goToPreviousMonth = useCallback(() => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }, []);

    const goToNextMonth = useCallback(() => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }, []);

    const handleDateClick = useCallback((date: Date) => {
        const dateTime = new Date(date);
        dateTime.setHours(0, 0, 0, 0);
        if (dateTime.getTime() < todayForComparison) return;
        setSelectedDate(date);
    }, [todayForComparison]);

    const handleSlotClick = useCallback((slot: SlotData) => {
        if (slot.remaining === 0) return;
        setSelectedSlot(slot);
    }, []);

    const handleConfirm = useCallback(() => {
        if (selectedSlot && selectedDate) {
            const dateStr = selectedDate.toISOString().split('T')[0];
            onSelect(selectedSlot, dateStr);
        }
    }, [selectedSlot, selectedDate, onSelect]);

    const formatTime = useCallback((timeStr: string) => {
        if (timeStr.includes('T')) {
            return timeStr.substring(11, 16);
        }
        return timeStr.substring(0, 5);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={onBack} className="shrink-0">
                    <ChevronLeft size={18} />
                    Volver
                </Button>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">Selecciona fecha y hora</h2>
                    <p className="text-sm text-gray-500">{experience.title}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <Card className="p-4">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={goToPreviousMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h3>
                            {isLoadingMonth && (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent" />
                            )}
                        </div>
                        <button
                            onClick={goToNextMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {WEEKDAYS.map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, index) => {
                            if (!date) {
                                return <div key={`empty-${index}`} className="aspect-square" />;
                            }

                            const dateTime = new Date(date);
                            dateTime.setHours(0, 0, 0, 0);
                            const past = dateTime.getTime() < todayForComparison;
                            const today = date.toDateString() === todayStr;
                            const selected = date.toDateString() === selectedDateStr;
                            const dateStr = date.toISOString().split('T')[0];
                            const hasAvailability = monthAvailability.has(dateStr);

                            return (
                                <button
                                    key={date.toISOString()}
                                    onClick={() => handleDateClick(date)}
                                    disabled={past}
                                    className={`
                                        aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium
                                        transition-all duration-200 relative
                                        ${past
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'hover:bg-blue-50 cursor-pointer'
                                        }
                                        ${selected
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : ''
                                        }
                                        ${today && !selected
                                            ? 'bg-indigo-100 text-indigo-700 font-bold'
                                            : ''
                                        }
                                        ${!past && !selected && !today
                                            ? 'border border-gray-200 text-gray-700'
                                            : ''
                                        }
                                    `}
                                >
                                    <span>{date.getDate()}</span>
                                    {/* Availability dot indicator */}
                                    {hasAvailability && !past && (
                                        <span className={`
                                            absolute bottom-1 w-1.5 h-1.5 rounded-full
                                            ${selected ? 'bg-white' : 'bg-indigo-500'}
                                        `} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Selected Date Display */}
                    {selectedDate && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
                            <span className="text-sm text-blue-700 font-medium">
                                📅 {selectedDate.toLocaleDateString('es-CO', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })}
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
                            <div className="text-5xl mb-4">📅</div>
                            <p className="text-center">Selecciona una fecha en el calendario para ver los horarios disponibles</p>
                        </div>
                    )}

                    {selectedDate && isLoadingSlots && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
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
                                        onClick={() => handleSlotClick(slot)}
                                        disabled={isSoldOut}
                                        className={`
                                            w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                                            ${isSoldOut
                                                ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                                : isSlotSelected
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className={`
                                                    w-10 h-10 rounded-full flex items-center justify-center
                                                    ${isSlotSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
                                                `}>
                                                    <Clock size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">
                                                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Users size={14} />
                                                        <span>
                                                            {isSoldOut
                                                                ? 'Agotado'
                                                                : `${slot.remaining} cupos disponibles`
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {isSlotSelected && (
                                                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                <Button variant="outline" onClick={onBack}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={!selectedSlot || !selectedDate}
                    className={!selectedSlot || !selectedDate ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    Confirmar horario →
                </Button>
            </div>
        </div>
    );
}

export const AgentSlotSelector = memo(AgentSlotSelectorComponent);
