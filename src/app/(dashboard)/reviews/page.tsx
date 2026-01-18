'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, Input, Button } from '@/components/ui';
import { Star, TrendingUp, MessageSquare, Search, X, Calendar, ChevronDown } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useResortStore } from '@/lib/resort-store';
import { useReviewsStore } from '@/lib/reviews-store';

export default function ReviewsPage() {
    const { resort, fetchMyResort, isLoading: resortLoading } = useResortStore();
    const { reviews, stats, isLoading: reviewsLoading, fetchReviews } = useReviewsStore();

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
    const [experienceFilter, setExperienceFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

    // Fetch resort data on mount
    useEffect(() => {
        if (!resort) {
            fetchMyResort();
        }
    }, [resort, fetchMyResort]);

    // Fetch reviews when resort is available
    useEffect(() => {
        if (resort?.id) {
            fetchReviews(resort.id);
        }
    }, [resort?.id, fetchReviews]);

    // Get unique experiences from reviews
    const uniqueExperiences = useMemo(() => {
        const experiences = new Map<string, string>();
        reviews.forEach(review => {
            if (!experiences.has(review.experience_id)) {
                experiences.set(review.experience_id, review.experience_title);
            }
        });
        return Array.from(experiences.entries());
    }, [reviews]);

    // Filter and sort reviews
    const filteredReviews = useMemo(() => {
        let result = [...reviews];

        // Search filter (name or comment)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(review =>
                review.user_full_name?.toLowerCase().includes(term) ||
                review.comment?.toLowerCase().includes(term) ||
                review.experience_title.toLowerCase().includes(term)
            );
        }

        // Rating filter
        if (ratingFilter !== 'all') {
            result = result.filter(review => review.rating === ratingFilter);
        }

        // Experience filter
        if (experienceFilter !== 'all') {
            result = result.filter(review => review.experience_id === experienceFilter);
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'oldest':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'highest':
                    return b.rating - a.rating;
                case 'lowest':
                    return a.rating - b.rating;
                default:
                    return 0;
            }
        });

        return result;
    }, [reviews, searchTerm, ratingFilter, experienceFilter, sortBy]);

    // Rating distribution
    const ratingDistribution = useMemo(() => {
        const distribution = [0, 0, 0, 0, 0]; // 1-5 stars
        reviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating - 1]++;
            }
        });
        return distribution;
    }, [reviews]);

    const clearFilters = () => {
        setSearchTerm('');
        setRatingFilter('all');
        setExperienceFilter('all');
        setSortBy('newest');
    };

    const hasActiveFilters = searchTerm || ratingFilter !== 'all' || experienceFilter !== 'all' || sortBy !== 'newest';

    const isLoading = resortLoading || reviewsLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const getInitial = (name: string | null) => {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    };

    const renderStars = (rating: number, interactive = false, onSelect?: (r: number) => void) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onSelect?.(star)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                    >
                        <Star
                            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Reseñas y Calificaciones
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Lo que dicen tus clientes sobre tus experiencias.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 items-stretch">
                <Card className="text-center p-6 flex flex-col justify-center">
                    <h3 className="text-sm font-medium text-slate-500">Calificación Promedio</h3>
                    <div className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
                        {stats?.average_rating?.toFixed(1) || '0.0'}
                        <Star className="h-6 w-6 text-yellow-400 fill-current" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        Basado en {stats?.total_reviews || 0} reseñas
                    </p>
                </Card>
                <Card className="text-center p-6 flex flex-col justify-center">
                    <h3 className="text-sm font-medium text-slate-500">Total Reseñas</h3>
                    <div className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
                        {stats?.total_reviews || 0}
                    </div>
                    {(stats?.reviews_this_month ?? 0) > 0 && (
                        <p className="text-xs text-emerald-600 mt-1 flex items-center justify-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +{stats?.reviews_this_month} este mes
                        </p>
                    )}
                </Card>
                <Card className="text-center p-6 flex flex-col justify-center">
                    <h3 className="text-sm font-medium text-slate-500">Experiencias Reseñadas</h3>
                    <div className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
                        {uniqueExperiences.length}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Con calificaciones</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-slate-500 mb-3 text-center">Distribución</h3>
                    <div className="space-y-1.5">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRatingFilter(ratingFilter === star ? 'all' : star)}
                                className={`w-full flex items-center gap-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 p-1 rounded transition-colors ${ratingFilter === star ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                            >
                                <span className="w-4 text-slate-600">{star}</span>
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 transition-all"
                                        style={{
                                            width: reviews.length > 0
                                                ? `${(ratingDistribution[star - 1] / reviews.length) * 100}%`
                                                : '0%'
                                        }}
                                    />
                                </div>
                                <span className="w-6 text-right text-slate-500">{ratingDistribution[star - 1]}</span>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Filters Bar */}
            <Card className="p-4">
                <div className="flex flex-col gap-4">
                    {/* Main filters row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Buscar por nombre, comentario o experiencia..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Experience Filter */}
                        <div className="relative min-w-[200px]">
                            <select
                                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer outline-none appearance-none"
                                value={experienceFilter}
                                onChange={(e) => setExperienceFilter(e.target.value)}
                            >
                                <option value="all">Todas las experiencias</option>
                                {uniqueExperiences.map(([id, title]) => (
                                    <option key={id} value={id}>{title}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Rating Filter */}
                        <div className="relative min-w-[160px]">
                            <select
                                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer outline-none appearance-none"
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                            >
                                <option value="all">Todas las estrellas</option>
                                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                <option value="4">⭐⭐⭐⭐ (4)</option>
                                <option value="3">⭐⭐⭐ (3)</option>
                                <option value="2">⭐⭐ (2)</option>
                                <option value="1">⭐ (1)</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Sort */}
                        <div className="relative min-w-[160px]">
                            <select
                                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer outline-none appearance-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            >
                                <option value="newest">Más recientes</option>
                                <option value="oldest">Más antiguas</option>
                                <option value="highest">Mayor calificación</option>
                                <option value="lowest">Menor calificación</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Active filters info */}
                    {hasActiveFilters && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">
                                Mostrando {filteredReviews.length} de {reviews.length} reseñas
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-indigo-600 hover:text-indigo-700"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Limpiar filtros
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
                <Card className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                        {reviews.length === 0 ? 'Sin reseñas aún' : 'No se encontraron reseñas'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                        {reviews.length === 0
                            ? 'Cuando tus clientes dejen reseñas sobre tus experiencias, aparecerán aquí.'
                            : 'Intenta cambiar los filtros de búsqueda.'}
                    </p>
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="mt-4"
                        >
                            Limpiar filtros
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredReviews.map((review) => (
                        <Card key={review.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg">
                                        {getInitial(review.user_full_name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                                {review.user_full_name || 'Usuario anónimo'}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(review.created_at)}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            {renderStars(review.rating)}
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">
                                                {review.experience_title}
                                            </span>
                                        </div>
                                        {review.comment && (
                                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                                &quot;{review.comment}&quot;
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
