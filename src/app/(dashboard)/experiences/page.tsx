'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    StatusBadge,
    Badge
} from '@/components/ui';
import { Search, ImageIcon, Loader2, Users, Baby, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { useAdminExperiences } from '@/hooks/useAdmin';
import { ROUTES } from '@/routes';
import { getCategoryName } from '@/lib/categories';

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

export default function ExperiencesPage() {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search input by 400ms
    const debouncedSearch = useDebounce(searchInput, 400);

    // Use React Query with caching
    const { data, isLoading, isError } = useAdminExperiences({
        search: debouncedSearch || undefined,
        limit: 10,
        page: currentPage
    });

    const experiences = data?.data || [];
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

    // Helper to format price or show fallback
    const formatPrice = (cents: number | null | undefined): string => {
        if (cents === null || cents === undefined || isNaN(cents)) {
            return 'Sin precio';
        }
        return formatCurrency(cents);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Experiencias
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
                        Todas las experiencias registradas en la plataforma
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {pagination && (
                        <span className="text-sm text-slate-500">
                            {pagination.total} experiencias
                        </span>
                    )}
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Buscar experiencia..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center p-12 text-red-500">
                            <p>Error al cargar las experiencias.</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2"
                                onClick={() => window.location.reload()}
                            >
                                Reintentar
                            </Button>
                        </div>
                    ) : experiences.length === 0 ? (
                        <div className="text-center p-12">
                            <Compass className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">
                                No se encontraron experiencias
                            </p>
                            {debouncedSearch && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setSearchInput('')}
                                    className="mt-2 text-indigo-500 hover:text-indigo-600"
                                >
                                    Limpiar búsqueda
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table - Hidden on mobile */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow hoverable={false}>
                                            <TableHead className="w-[80px]">Imagen</TableHead>
                                            <TableHead>Título</TableHead>
                                            <TableHead>Categoría</TableHead>
                                            <TableHead>Niños</TableHead>
                                            <TableHead>Precio Adulto (Neto)</TableHead>
                                            <TableHead>Precio Niño (Neto)</TableHead>
                                            <TableHead>Estado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {experiences.map((exp) => {
                                            const mainImage = exp.main_image_url;
                                            return (
                                                <TableRow
                                                    key={exp.id}
                                                    onClick={() => router.push(`${ROUTES.DASHBOARD.EXPERIENCES.LIST}/${exp.id}`)}
                                                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                                >
                                                    <TableCell>
                                                        <div className="h-12 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                                                            {mainImage ? (
                                                                <Image
                                                                    src={mainImage}
                                                                    alt={exp.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full text-slate-400">
                                                                    <ImageIcon className="h-5 w-5" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium text-slate-900 dark:text-slate-100 mb-0.5 line-clamp-1">
                                                            {exp.title}
                                                        </div>
                                                        <div className="text-xs text-slate-500 font-mono">ID: {exp.id.slice(0, 8)}...</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="capitalize">{getCategoryName(exp.category)}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {exp.allows_children ? (
                                                            <span className="flex items-center gap-1 text-green-600 dark:text-green-500 text-xs font-medium">
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                Sí
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-slate-400 text-xs">
                                                                <XCircle className="h-3.5 w-3.5" />
                                                                No
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-3.5 w-3.5 text-indigo-500" />
                                                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                                                {formatPrice(exp.display_price_per_adult)}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Baby className="h-3.5 w-3.5 text-pink-500" />
                                                            <span className="text-slate-600 dark:text-slate-400">
                                                                {exp.allows_children
                                                                    ? formatPrice(exp.display_price_per_child)
                                                                    : 'No aplica'
                                                                }
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={exp.status || 'draft'} />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Cards - Hidden on desktop */}
                            <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                                {experiences.map((exp) => {
                                    const mainImage = exp.main_image_url;
                                    return (
                                        <div
                                            key={exp.id}
                                            onClick={() => router.push(`${ROUTES.DASHBOARD.EXPERIENCES.LIST}/${exp.id}`)}
                                            className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <div className="flex gap-3">
                                                {/* Image */}
                                                <div className="h-20 w-24 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                                                    {mainImage ? (
                                                        <Image
                                                            src={mainImage}
                                                            alt={exp.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-slate-400">
                                                            <ImageIcon className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                                                            {exp.title}
                                                        </h3>
                                                        <StatusBadge status={exp.status || 'draft'} />
                                                    </div>

                                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                                        <Badge variant="outline" size="sm" className="capitalize text-xs">
                                                            {getCategoryName(exp.category)}
                                                        </Badge>
                                                        {exp.allows_children ? (
                                                            <Badge variant="outline" size="sm" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 text-[10px] px-1.5 h-5">
                                                                <Baby className="h-3 w-3 mr-1" />
                                                                Niños
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" size="sm" className="text-slate-500 border-slate-200 text-[10px] px-1.5 h-5">
                                                                Solo adultos
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Prices */}
                                                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-3.5 w-3.5 text-indigo-500" />
                                                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                                                {formatPrice(exp.display_price_per_adult)}
                                                            </span>
                                                        </div>
                                                        {exp.allows_children && (
                                                            <div className="flex items-center gap-1">
                                                                <Baby className="h-3.5 w-3.5 text-pink-500" />
                                                                <span className="text-slate-600 dark:text-slate-400">
                                                                    {formatPrice(exp.display_price_per_child)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
