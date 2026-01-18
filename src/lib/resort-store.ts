import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResortProfile, ResortDocument } from '@/types';
import apiClient from './api-client';
import { STORAGE_KEYS } from './constants';
import { security } from '@/utils/security';

type ResortDocType = 'camara_comercio' | 'rut_nit' | 'rnt' | 'other';

interface UpdateResortGeneralData {
    name?: string;
    description?: string;
    website?: string;
    contact_email?: string;
    contact_phone?: string;
    nit?: string;
    rnt?: string;
}

interface UpdateResortLocationData {
    address_line?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}


interface ResortState {
    resort: ResortProfile | null;
    isLoading: boolean;
    isSubmitting: boolean;
    isSaving: boolean;
    isUploading: boolean;
    error: string | null;
    setResort: (resort: ResortProfile | null) => void;
    clearResort: () => void;
    fetchMyResort: () => Promise<void>;
    submitForReview: () => Promise<void>;
    updateResortGeneral: (data: UpdateResortGeneralData) => Promise<void>;
    updateResortLocation: (data: UpdateResortLocationData) => Promise<void>;
    uploadDocument: (docType: ResortDocType, file: File) => Promise<ResortDocument>;
    deleteDocument: (docId: string) => Promise<void>;
}

export const useResortStore = create<ResortState>()(
    persist(
        (set, get) => ({
            resort: null,
            isLoading: false,
            isSubmitting: false,
            isSaving: false,
            isUploading: false,
            error: null,
            setResort: (resort) => set({ resort }),
            clearResort: () => set({ resort: null, error: null }),

            fetchMyResort: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await apiClient.get<ResortProfile>('/api/v1/resorts/my-resort');
                    set({ resort: response.data, isLoading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al cargar el resort';
                    set({ error: errorMessage, isLoading: false });
                    console.log('No resort found for user (this is normal for new users):', errorMessage);
                }
            },

            submitForReview: async () => {
                const { resort } = get();
                if (!resort?.id) {
                    set({ error: 'No hay resort para enviar' });
                    return;
                }

                set({ isSubmitting: true, error: null });
                try {
                    await apiClient.post(`/api/v1/resorts/${resort.id}/submit`);
                    const response = await apiClient.get<ResortProfile>('/api/v1/resorts/my-resort');
                    set({ resort: response.data, isSubmitting: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al enviar a revisión';
                    set({ error: errorMessage, isSubmitting: false });
                    throw error;
                }
            },

            updateResortGeneral: async (data: UpdateResortGeneralData) => {
                const { resort } = get();
                if (!resort?.id) {
                    set({ error: 'No hay resort para actualizar' });
                    return;
                }

                set({ isSaving: true, error: null });
                try {
                    await apiClient.patch(`/api/v1/resorts/${resort.id}`, data);
                    // Update local state
                    set({
                        resort: { ...resort, ...data },
                        isSaving: false
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al guardar';
                    set({ error: errorMessage, isSaving: false });
                    throw error;
                }
            },

            updateResortLocation: async (data: UpdateResortLocationData) => {
                const { resort } = get();
                if (!resort?.id) {
                    set({ error: 'No hay resort para actualizar' });
                    return;
                }

                set({ isSaving: true, error: null });
                try {
                    await apiClient.patch(`/api/v1/resorts/${resort.id}`, data);
                    set({
                        resort: { ...resort, ...data },
                        isSaving: false
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al guardar';
                    set({ error: errorMessage, isSaving: false });
                    throw error;
                }
            },

            uploadDocument: async (docType: ResortDocType, file: File) => {
                const { resort } = get();
                if (!resort?.id) {
                    throw new Error('No hay resort');
                }

                set({ isUploading: true, error: null });
                try {
                    // Upload directly to the backend using multipart form data
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('doc_type', docType);

                    const response = await apiClient.post<{ document: ResortDocument }>(
                        `/api/v1/resorts/${resort.id}/documents/upload`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    const newDocument = response.data.document;

                    // Update documents in local state
                    const existingDocs = resort.documents || [];
                    const filteredDocs = existingDocs.filter(d => d.doc_type !== docType);

                    set({
                        resort: {
                            ...resort,
                            documents: [...filteredDocs, newDocument]
                        },
                        isUploading: false
                    });

                    return newDocument;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al subir documento';
                    set({ error: errorMessage, isUploading: false });
                    throw error;
                }
            },

            deleteDocument: async (docId: string) => {
                const { resort } = get();
                if (!resort?.id) {
                    throw new Error('No hay resort');
                }

                set({ isSaving: true, error: null });
                try {
                    await apiClient.delete(`/api/v1/resorts/${resort.id}/documents/${docId}`);

                    // Remove from local state
                    const documents = resort.documents?.filter(d => d.id !== docId) || [];
                    set({
                        resort: { ...resort, documents },
                        isSaving: false
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al eliminar documento';
                    set({ error: errorMessage, isSaving: false });
                    throw error;
                }
            },
        }),
        {
            name: security.IllegibleName(STORAGE_KEYS.RESORT_STORAGE),
            partialize: (state) => security.AES.encrypt(({ resort: state.resort })),
        }
    )
);
