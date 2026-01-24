'use client';

import { useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Button,
    Card,
    Badge,
    StatusBadge,
    Modal,
    ModalFooter,
    Spinner,
} from '@/components/ui';
import { ArrowLeft, Edit, Trash2, ImageIcon, Clock, Users, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useExperience, useDeleteExperience } from '@/hooks/useExperience';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@/routes';
import { getCategoryName } from '@/lib/categories';

export default function ExperienceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const experienceId = params.id as string;

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data: experience, isLoading, isError } = useExperience(experienceId);
    const deleteExperience = useDeleteExperience();

    const mainImage = useMemo(() => {
        return experience?.images?.find(image => image.image_type === 'hero' || image.sort_order === 0);
    }, [experience]);

    const handleDelete = async () => {
        try {
            await deleteExperience.mutateAsync(experienceId);
            // Invalidate cache and redirect
            await queryClient.invalidateQueries({ queryKey: ['my-experiences'] });
            router.push(ROUTES.DASHBOARD.EXPERIENCES.LIST);
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError || !experience) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-red-500">
                <p>Error al cargar la experiencia.</p>
                <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => router.push(ROUTES.DASHBOARD.EXPERIENCES.LIST)}
                >
                    Volver al listado
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={ROUTES.DASHBOARD.EXPERIENCES.LIST}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {experience.title}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="capitalize">{getCategoryName(experience.category)}</Badge>
                            <StatusBadge status={experience.status || 'draft'} />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        leftIcon={<Edit className="h-4 w-4" />}
                        onClick={() => router.push(`${ROUTES.DASHBOARD.EXPERIENCES.LIST}/${experienceId}/edit`)}
                    >
                        Editar
                    </Button>
                    <Button
                        variant="danger"
                        leftIcon={<Trash2 className="h-4 w-4" />}
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Eliminar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image */}
                    <Card className="overflow-hidden">
                        <div className="h-64 md:h-80 bg-slate-100 dark:bg-slate-800 relative">
                            {mainImage ? (
                                <Image
                                    src={mainImage.url}
                                    alt={experience.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    <ImageIcon className="h-16 w-16" />
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Description */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                            Descripción
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                            {experience.description || 'Sin descripción'}
                        </p>
                    </Card>

                    {/* Includes/Excludes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-6">
                            <h3 className="text-md font-semibold text-green-700 dark:text-green-400 mb-3">
                                ✓ Incluye
                            </h3>
                            <ol>
                                {experience.includes?.split(',').map((include, index) => (
                                    <li key={index} className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap">
                                        • {include}
                                    </li>
                                ))}
                            </ol>
                        </Card>
                        <Card className="p-6">
                            <h3 className="text-md font-semibold text-red-700 dark:text-red-400 mb-3">
                                ✗ No Incluye
                            </h3>
                            <ol>
                                {experience.excludes?.split(',').map((exclude, index) => (
                                    <li key={index} className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap">
                                        • {exclude}
                                    </li>
                                ))}
                            </ol>
                        </Card>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Precios
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Adultos</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                    {experience.display_price_per_adult
                                        ? `${formatCurrency(experience.display_price_per_adult)} ${experience.display_currency || experience.currency}`
                                        : 'Sin precio'
                                    }
                                </span>
                            </div>
                            {experience.allows_children && (
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Niños</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        {experience.display_price_per_child
                                            ? `${formatCurrency(experience.display_price_per_child)} ${experience.display_currency || experience.currency}`
                                            : 'Sin precio'
                                        }
                                    </span>
                                </div>
                            )}
                            <hr className="border-slate-200 dark:border-slate-700" />
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Comisión adultos</span>
                                <span className="text-slate-600 dark:text-slate-400">
                                    {experience.display_commission_per_adult
                                        ? `${formatCurrency(experience.display_commission_per_adult)} ${experience.display_currency || experience.currency}`
                                        : 'Sin comisión'
                                    }
                                </span>
                            </div>
                            {experience.allows_children && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Comisión niños</span>
                                    <span className="text-slate-600 dark:text-slate-400">
                                        {experience.display_commission_per_child
                                            ? `${formatCurrency(experience.display_commission_per_child)} ${experience.display_currency || experience.currency}`
                                            : 'Sin comisión'
                                        }
                                    </span>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Details */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                            Detalles
                        </h2>
                        <div className="space-y-3">
                            {experience.duration_minutes && (
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-slate-400" />
                                    <span className="text-slate-600 dark:text-slate-400">
                                        {experience.duration_minutes} minutos
                                    </span>
                                </div>
                            )}
                            {experience.max_capacity && (
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-slate-400" />
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Capacidad: {experience.max_capacity} personas
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-slate-400" />
                                <span className="text-slate-600 dark:text-slate-400">
                                    {experience.allows_children
                                        ? `Niños: ${experience.child_min_age || 0}-${experience.child_max_age || 12} años`
                                        : 'Solo adultos'}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Ratings */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                            Calificaciones
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="text-3xl font-bold text-indigo-600">
                                {experience.rating_avg ? Number(experience.rating_avg).toFixed(1) : '-'}
                            </div>
                            <div className="text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                    {'★'.repeat(Math.round(Number(experience.rating_avg) || 0))}
                                    {'☆'.repeat(5 - Math.round(Number(experience.rating_avg) || 0))}
                                </div>
                                <div className="text-sm">
                                    {experience.rating_count || 0} reseñas
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Meta */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                            Información
                        </h2>
                        <div className="space-y-2 text-sm text-slate-500">
                            <div>
                                <span className="font-medium">ID:</span>{' '}
                                <span className="font-mono">{experience.id}</span>
                            </div>
                            <div>
                                <span className="font-medium">Slug:</span>{' '}
                                <span className="font-mono">{experience.slug}</span>
                            </div>
                            <div>
                                <span className="font-medium">Creado:</span>{' '}
                                {new Date(experience.created_at).toLocaleDateString('es-CO')}
                            </div>
                            <div>
                                <span className="font-medium">Actualizado:</span>{' '}
                                {new Date(experience.updated_at).toLocaleDateString('es-CO')}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Eliminar Experiencia"
                description="¿Estás seguro de que deseas eliminar esta experiencia? Esta acción no se puede deshacer."
                size="sm"
            >
                <div className="text-slate-600 dark:text-slate-400">
                    <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                        {experience.title}
                    </p>
                    <p className="text-sm">
                        La experiencia será desactivada y ya no aparecerá en los listados.
                    </p>
                </div>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={deleteExperience.isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        isLoading={deleteExperience.isPending}
                    >
                        Eliminar
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
