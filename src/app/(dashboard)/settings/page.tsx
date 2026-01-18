'use client';

import { useResortStore } from '@/lib/resort-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input } from '@/components/ui';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Building2, FileText, Save, ExternalLink, CheckCircle, Clock, AlertCircle, Upload, Trash2 } from 'lucide-react';

// Document types
const DOC_TYPES = [
    { type: 'camara_comercio' as const, label: 'Cámara de Comercio' },
    { type: 'rut_nit' as const, label: 'RUT' },
    { type: 'rnt' as const, label: 'RNT' },
    { type: 'other' as const, label: 'Otro Documento' },
] as const;

type ResortDocType = typeof DOC_TYPES[number]['type'];

// Schemas
const generalSchema = z.object({
    name: z.string().min(3, 'El nombre es obligatorio'),
    description: z.string().optional(),
    contact_email: z.email().optional().or(z.literal('')),
    contact_phone: z.string().optional().or(z.literal('')),
    website: z.url().optional().or(z.literal('')),
    nit: z.string().regex(/^\d{9}-\d$/, 'Formato: 800098813-6').optional().or(z.literal('')),
    rnt: z.string().regex(/^\d{5}$/, 'Debe tener 5 dígitos').optional().or(z.literal('')),
});

const locationSchema = z.object({
    address_line: z.string().optional(),
    city: z.string().optional(),
    country: z.string().default('Colombia'),
});

type GeneralForm = z.infer<typeof generalSchema>;
type LocationForm = z.infer<typeof locationSchema>;

// Helper to get status badge
function getDocStatusBadge(status: string) {
    switch (status) {
        case 'approved':
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="h-3 w-3" /> Aprobado
                </span>
            );
        case 'under_review':
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <Clock className="h-3 w-3" /> En Revisión
                </span>
            );
        case 'rejected':
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" /> Rechazado
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    Subido
                </span>
            );
    }
}

export default function SettingsPage() {
    const {
        resort,
        fetchMyResort,
        isLoading: resortLoading,
        submitForReview,
        isSubmitting,
        updateResortGeneral,
        updateResortLocation,
        uploadDocument,
        deleteDocument,
        isSaving
    } = useResortStore();
    const [activeTab, setActiveTab] = useState('general');
    const [uploadingDocType, setUploadingDocType] = useState<ResortDocType | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmitForReview = async () => {
        try {
            await submitForReview();
            toast.success('Resort enviado a revisión exitosamente');
        } catch (error: any) {
            console.error('Error submitting for review:', error);
            const message = error.message || 'Error al enviar a revisión';
            toast.error(message);
        }
    };

    // Fetch resort data on mount
    useEffect(() => {
        if (!resort) {
            fetchMyResort();
        }
    }, [resort, fetchMyResort]);

    // General form
    const generalForm = useForm<GeneralForm>({
        resolver: zodResolver(generalSchema) as Resolver<GeneralForm>,
        defaultValues: {
            name: resort?.name || '',
            description: resort?.description || '',
            contact_email: resort?.contact_email || '',
            contact_phone: resort?.contact_phone || '',
            website: resort?.website || '',
            nit: resort?.nit || '',
            rnt: resort?.rnt || '',
        },
    });

    // Location form
    const locationForm = useForm<LocationForm>({
        resolver: zodResolver(locationSchema) as Resolver<LocationForm>,
        defaultValues: {
            address_line: resort?.address_line || '',
            city: resort?.city || '',
            country: resort?.country || 'Colombia',
        },
    });

    // Reset forms when resort data loads
    useEffect(() => {
        if (resort) {
            generalForm.reset({
                name: resort.name || '',
                description: resort.description || '',
                contact_email: resort.contact_email || '',
                contact_phone: resort.contact_phone || '',
                website: resort.website || '',
                nit: resort.nit || '',
                rnt: resort.rnt || '',
            });
            locationForm.reset({
                address_line: resort.address_line || '',
                city: resort.city || '',
                country: resort.country || 'Colombia',
            });
        }
    }, [resort, generalForm, locationForm]);

    const onSaveGeneral = async (data: GeneralForm) => {
        try {
            await updateResortGeneral(data);
            toast.success('Información general actualizada');
        } catch (error: any) {
            console.error('Error saving general:', error);
            const message = error.message || 'Error al guardar';

            if (message === 'Cannot update approved resort. Contact support for changes.') {
                toast.error('No se puede editar un resort aprobado. Contacte a soporte para realizar cambios.');
            } else {
                toast.error(message);
            }
        }
    };

    const onSaveLocation = async (data: LocationForm) => {
        try {
            await updateResortLocation(data);
            toast.success('Ubicación actualizada');
        } catch (error: any) {
            console.error('Error saving location:', error);
            const message = error.message || 'Error al guardar';

            if (message === 'Cannot update approved resort. Contact support for changes.') {
                toast.error('No se puede editar un resort aprobado. Contacte a soporte para realizar cambios.');
            } else {
                toast.error(message);
            }
        }
    };

    // Document upload handler - now just delegates to the store
    const handleDocumentUpload = async (docType: ResortDocType, file: File) => {
        setUploadingDocType(docType);
        try {
            await uploadDocument(docType, file);
        } catch (error) {
            console.error('Error uploading document:', error);
        } finally {
            setUploadingDocType(null);
        }
    };

    const handleFileSelect = (docType: ResortDocType) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.jpg,.jpeg,.png';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                handleDocumentUpload(docType, file);
            }
        };
        input.click();
    };

    const handleDeleteDocument = async (docId: string) => {
        if (confirm('¿Estás seguro de eliminar este documento?')) {
            try {
                await deleteDocument(docId);
            } catch (error) {
                console.error('Error deleting document:', error);
            }
        }
    };

    const getDocumentByType = (docType: ResortDocType) => {
        return resort?.documents?.find(d => d.doc_type === docType);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Building2 },
        { id: 'location', label: 'Ubicación', icon: MapPin },
        { id: 'documents', label: 'Documentos', icon: FileText },
    ];

    if (resortLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Configuración del Resort
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Gestiona la información de tu perfil, ubicación y documentos legales.
                    </p>
                </div>
                {(resort?.status === 'draft' || resort?.status === 'rejected') && (
                    <Button
                        onClick={handleSubmitForReview}
                        isLoading={isSubmitting}
                    >
                        {resort?.status === 'rejected' ? 'Reenviar a Revisión' : 'Enviar a Revisión'}
                    </Button>
                )}
            </div>

            <div className="grid md:grid-cols-[240px_1fr] gap-8 items-start">
                {/* Sidebar Nav */}
                <nav className="flex flex-col space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer
                                    ${activeTab === tab.id
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}
                `}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Content */}
                <div className="space-y-6">
                    {/* General Section */}
                    <div className={activeTab === 'general' ? 'block space-y-6' : 'hidden'}>
                        <form onSubmit={generalForm.handleSubmit(onSaveGeneral)}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Perfil Corporativo</CardTitle>
                                    <CardDescription>Información pública visible para los turistas</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Input label="Nombre del Resort" {...generalForm.register('name')} error={generalForm.formState.errors.name?.message} />
                                        <Input label="Sitio Web" placeholder="https://" {...generalForm.register('website')} error={generalForm.formState.errors.website?.message} />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Input label="Email de Contacto" type="email" {...generalForm.register('contact_email')} error={generalForm.formState.errors.contact_email?.message} />
                                        <Input label="Teléfono" {...generalForm.register('contact_phone')} error={generalForm.formState.errors.contact_phone?.message} />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Input label="NIT" placeholder="800098813-6" {...generalForm.register('nit')} error={generalForm.formState.errors.nit?.message} helperText="Formato: 9 dígitos, guión, 1 dígito" />
                                        <Input label="RNT" placeholder="23412" {...generalForm.register('rnt')} error={generalForm.formState.errors.rnt?.message} helperText="5 dígitos" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Descripción
                                        </label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            {...generalForm.register('description')}
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                                            Guardar General
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>

                    {/* Location Section */}
                    <div className={activeTab === 'location' ? 'block space-y-6' : 'hidden'}>
                        <form onSubmit={locationForm.handleSubmit(onSaveLocation)}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ubicación Geográfica</CardTitle>
                                    <CardDescription>Dirección física y coordenadas para el mapa</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Input label="Dirección Completa" {...locationForm.register('address_line')} error={locationForm.formState.errors.address_line?.message} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Ciudad" {...locationForm.register('city')} error={locationForm.formState.errors.city?.message} />
                                        <Input label="País" {...locationForm.register('country')} disabled />
                                    </div>

                                    {resort?.latitude && resort?.longitude && (
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                <strong>Coordenadas:</strong> {resort.latitude}, {resort.longitude}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                                            Guardar Ubicación
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>

                    {/* Documents Section */}
                    <div className={activeTab === 'documents' ? 'block space-y-6' : 'hidden'}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Documentos Legales</CardTitle>
                                <CardDescription>Documentos requeridos para operar en la plataforma</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {DOC_TYPES.map(({ type, label }) => {
                                        const doc = getDocumentByType(type);
                                        const isUploading = uploadingDocType === type;

                                        return (
                                            <div key={type} className="py-4 first:pt-0 last:pb-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                                                            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900 dark:text-slate-100">
                                                                {label}
                                                            </p>
                                                            {doc ? (
                                                                <p className="text-sm text-slate-500">
                                                                    Subido el {new Date(doc.uploaded_at).toLocaleDateString('es-CO')}
                                                                </p>
                                                            ) : (
                                                                <p className="text-sm text-slate-400">No subido</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {doc ? (
                                                            <>
                                                                {getDocStatusBadge(doc.status)}
                                                                <a
                                                                    href={doc.file_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                                >
                                                                    <ExternalLink className="h-4 w-4 text-slate-500" />
                                                                </a>
                                                                <button
                                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleFileSelect(type)}
                                                                isLoading={isUploading}
                                                                leftIcon={<Upload className="h-4 w-4" />}
                                                            >
                                                                Subir
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                {doc?.rejection_reason && (
                                                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-400">
                                                        <strong>Motivo de rechazo:</strong> {doc.rejection_reason}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" />
        </div>
    );
}
