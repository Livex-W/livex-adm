'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import apiClient from '@/lib/api-client';
import { Button, Card, Input } from '@/components/ui';
import { Search, ArrowRight, ImageIcon, Loader2, ArrowLeft, MapPin, Users, Star, Clock, X } from 'lucide-react';
import { ROUTES } from '@/routes';
import { formatCurrency } from '@/lib/utils';

interface ExperienceSummary {
    id: string;
    title: string;
    short_description?: string;
    description: string;
    main_image_url: string;
    category: string;
    status: string;
    currency: string;
    display_price_per_adult?: number;
    display_price_per_child?: number;
    rating_avg?: number;
    rating_count?: number;
    max_capacity?: number;
    duration_minutes?: number;
    locations?: Array<{ name?: string }>;
}

const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
        'islands': '🏝️ Islas',
        'nautical': '⛵ Náutico',
        'city_tour': '🏙️ City Tour'
    };
    return labels[category] || category;
};

const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
};

export default function NewBookingPage() {
    const router = useRouter();
    const [experiences, setExperiences] = useState<ExperienceSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                // Fetch active experiences
                const response = await apiClient.get<{ data: ExperienceSummary[] }>('/api/v1/experiences/management');
                // API returns { data: [...], meta: {...} }, extract the array
                setExperiences(response.data?.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    const filtered = useMemo(() => {
        if (!searchTerm.trim()) return experiences;
        const term = searchTerm.toLowerCase();
        return experiences.filter(exp =>
            exp.title.toLowerCase().includes(term) ||
            exp.short_description?.toLowerCase().includes(term) ||
            exp.description?.toLowerCase().includes(term) ||
            exp.category.toLowerCase().includes(term)
        );
    }, [experiences, searchTerm]);

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nueva Reserva</h1>
                    <p className="text-slate-500">Selecciona una experiencia para crear una reserva manual</p>
                </div>
            </div>

            {/* Search Bar */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Input
                            placeholder="Buscar experiencia..."
                            leftIcon={<Search className="h-4 w-4" />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <span className="text-sm text-slate-500">{filtered.length} experiencias disponibles</span>
                </div>
            </Card>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                    {searchTerm ? (
                        <>
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No se encontraron experiencias
                            </h3>
                            <p className="text-gray-500 mb-4">
                                No hay resultados para &quot;{searchTerm}&quot;
                            </p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Limpiar búsqueda
                            </button>
                        </>
                    ) : (
                        <div className="text-slate-500">
                            No se encontraron experiencias disponibles.
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(exp => (
                        <div
                            key={exp.id}
                            onClick={() => router.push(`${ROUTES.DASHBOARD.BOOKINGS}/new/${exp.id}`)}
                            className="cursor-pointer group"
                        >
                            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-indigo-400 h-full">
                                {/* Image Header */}
                                <div className="h-44 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                                    {exp.main_image_url ? (
                                        <Image
                                            src={exp.main_image_url}
                                            alt={exp.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white">
                                            <ImageIcon className="h-12 w-12 opacity-50" />
                                        </div>
                                    )}
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    {/* Category Badge */}
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                                        {getCategoryLabel(exp.category)}
                                    </span>
                                    {/* Status Badge */}
                                    {exp.status === 'active' && (
                                        <span className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                                            Activa
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {exp.title}
                                    </h3>

                                    {(exp.short_description || exp.description) && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {exp.short_description || exp.description}
                                        </p>
                                    )}

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                        {exp.locations && exp.locations.length > 0 && exp.locations[0]?.name && (
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                <span className="line-clamp-1">{exp.locations[0].name}</span>
                                            </div>
                                        )}
                                        {exp.max_capacity && (
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                <span>Máx. {exp.max_capacity}</span>
                                            </div>
                                        )}
                                        {exp.duration_minutes && (
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                <span>{formatDuration(exp.duration_minutes)}</span>
                                            </div>
                                        )}
                                        {typeof exp.rating_avg === 'number' && exp.rating_avg > 0 && (
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star size={14} fill="currentColor" />
                                                <span>{exp.rating_avg.toFixed(1)}</span>
                                                {exp.rating_count && (
                                                    <span className="text-slate-400">({exp.rating_count})</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Price and Action */}
                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <div>
                                            {exp.display_price_per_adult ? (
                                                <>
                                                    <span className="text-xs text-slate-500">Desde</span>
                                                    <p className="text-lg font-bold text-indigo-600">
                                                        {formatCurrency(exp.display_price_per_adult)}
                                                    </p>
                                                    {exp.display_price_per_child && exp.display_price_per_child !== exp.display_price_per_adult && (
                                                        <span className="text-xs text-slate-500">
                                                            Niño: {formatCurrency(exp.display_price_per_child)}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-sm text-slate-400">Precio no disponible</span>
                                            )}
                                        </div>
                                        <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full font-medium group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center gap-1">
                                            Seleccionar <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
