'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import apiClient from '@/lib/api-client';
import { Card, Input } from '@/components/ui';
import { MapPin, Users, Star, Search, X } from 'lucide-react';

interface ExperienceData {
    id: string;
    title: string;
    short_description?: string;
    description?: string;
    category: string;
    currency: string;
    display_price_per_adult?: number;
    display_price_per_child?: number;
    rating_avg?: number;
    rating_count?: number;
    main_image_url?: string;
    locations?: Array<{ name?: string }>;
    max_capacity?: number;
    duration_minutes?: number;
}

interface AgentExperienceSelectorProps {
    onSelect: (experience: ExperienceData) => void;
}

interface PaginatedResponse {
    data: ExperienceData[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export function AgentExperienceSelector({ onSelect }: AgentExperienceSelectorProps) {
    const [experiences, setExperiences] = useState<ExperienceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await apiClient.get<PaginatedResponse>('/api/v1/experiences/management');
                setExperiences(response.data.data || []);
            } catch (err) {
                console.error('Error fetching experiences', err);
                setError('Error al cargar experiencias');
                setExperiences([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    // Filter experiences based on search term
    const filteredExperiences = useMemo(() => {
        if (!searchTerm.trim()) return experiences;

        const term = searchTerm.toLowerCase();
        return experiences.filter(exp =>
            exp.title.toLowerCase().includes(term) ||
            exp.short_description?.toLowerCase().includes(term) ||
            exp.description?.toLowerCase().includes(term) ||
            exp.category.toLowerCase().includes(term)
        );
    }, [experiences, searchTerm]);

    const formatPrice = (cents?: number, currency = 'COP') => {
        if (!cents || isNaN(cents)) return 'Precio no disponible';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0
        }).format(cents / 100);
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'islands': '🏝️ Islas',
            'nautical': '⛵ Náutico',
            'city_tour': '🏙️ City Tour'
        };
        return labels[category] || category;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando experiencias...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <p className="text-red-500 font-medium">{error}</p>
            </div>
        );
    }

    if (experiences.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">🏖️</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay experiencias disponibles</h3>
                <p className="text-gray-500">Contacta a tu resort para agregar experiencias.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Selecciona una experiencia</h2>
                <span className="text-sm text-gray-500">{filteredExperiences.length} disponibles</span>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Input
                    placeholder="Buscar experiencia..."
                    leftIcon={<Search className="h-4 w-4" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-80"
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

            {/* No results message */}
            {filteredExperiences.length === 0 && searchTerm && (
                <div className="text-center py-12">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
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
                </div>
            )}

            {/* Grid of experiences */}
            {filteredExperiences.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredExperiences.map(exp => (
                        <div
                            key={exp.id}
                            onClick={() => onSelect(exp)}
                            className="cursor-pointer group"
                        >
                            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-400 h-full">
                                {/* Image Header */}
                                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                                    {exp.main_image_url ? (
                                        <Image
                                            src={exp.main_image_url}
                                            alt={exp.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white text-5xl">
                                            {exp.category === 'islands' && '🏝️'}
                                            {exp.category === 'nautical' && '⛵'}
                                            {exp.category === 'city_tour' && '🏙️'}
                                        </div>
                                    )}
                                    {/* Category Badge */}
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                                        {getCategoryLabel(exp.category)}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {exp.title}
                                    </h3>

                                    {(exp.short_description || exp.description) && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {exp.short_description || exp.description}
                                        </p>
                                    )}

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {exp.locations && exp.locations.length > 0 && exp.locations[0]?.name && (
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                <span className="line-clamp-1">{exp.locations[0].name}</span>
                                            </div>
                                        )}
                                        {exp.max_capacity && (
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                <span>{exp.max_capacity}</span>
                                            </div>
                                        )}
                                        {typeof exp.rating_avg === 'number' && exp.rating_avg > 0 && (
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star size={14} fill="currentColor" />
                                                <span>{exp.rating_avg.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-gray-500">Desde</span>
                                            <p className="text-lg font-bold text-blue-600">
                                                {formatPrice(exp.display_price_per_adult, exp.currency)}
                                            </p>
                                        </div>
                                        <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            Seleccionar →
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
