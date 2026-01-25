import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { CreateExperienceFormData, transformToApiPayload } from '@/schemas/experience.schema';
import { ImageFile } from '@/components/experiences';
import { AvailabilityBlock } from '@/lib/experience-form-store';

export type TImageType = 'hero' | 'gallery';

interface ExperienceImage {
    created_at: string;
    experience_id: string;
    id: string;
    image_type: TImageType;
    sort_order: number;
    url: string;
}

// Types - matches API response from /api/v1/experiences/management
interface ExperienceListItem {
    id: string;
    code?: string;
    resort_id: string;
    title: string;
    slug: string;
    description?: string;
    category: string;
    price_per_adult_cents: number;
    price_per_child_cents: number;
    commission_per_adult_cents: number;
    commission_per_child_cents: number;
    currency: string;
    allows_children: boolean;
    child_min_age?: number;
    child_max_age?: number;
    includes?: string;
    excludes?: string;
    main_image_url?: string | null;
    status: 'draft' | 'under_review' | 'approved' | 'rejected' | 'active' | 'inactive';
    rating_avg?: string;
    rating_count?: number;
    created_at: string;
    updated_at: string;
    // Display prices (converted to user's currency)
    display_price_per_adult?: number;
    display_price_per_child?: number;
    display_commission_per_adult?: number;
    display_commission_per_child?: number;
    display_currency?: string;
    // Slot info
    duration_minutes?: number;
    max_capacity?: number;
    images?: ExperienceImage[];
}

interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface CreateExperienceResponse {
    id: string;
    title: string;
}

interface UploadImageResponse {
    image_url: string;
}

interface BulkCreateSlotsResponse {
    created: number;
    skipped: number;
    errors: string[];
}

interface BulkCreateSlotsPayload {
    experienceId: string;
    start_date: string;
    end_date: string;
    capacity: number;
    slots: Array<{
        start_hour: number;
        start_minute: number;
        end_hour: number;
        end_minute: number;
        capacity?: number;
        days_of_week?: number[];
    }>;
}

// Multi-block types
interface BulkMultiBlockResponse {
    message: string;
    results: {
        total_created: number;
        total_skipped: number;
        blocks_processed: number;
        block_results: Array<{
            start_date: string;
            end_date: string;
            created_slots: number;
            skipped_slots: number;
            errors: string[];
        }>;
    };
    experience_id: string;
}

interface BulkMultiBlockPayload {
    experienceId: string;
    blocks: Array<{
        start_date: string;
        end_date: string;
        capacity: number;
        // Precios de temporada (opcionales)
        price_per_adult_cents?: number;
        price_per_child_cents?: number;
        commission_per_adult_cents?: number;
        commission_per_child_cents?: number;
        slots: Array<{
            start_hour: number;
            start_minute: number;
            end_hour: number;
            end_minute: number;
            capacity?: number;
            days_of_week?: number[];
        }>;
    }>;
}

// API functions
async function createExperience(data: CreateExperienceFormData, resortId: string): Promise<CreateExperienceResponse> {
    const payload = transformToApiPayload(data, resortId);
    const response = await apiClient.post<CreateExperienceResponse>('/api/v1/experiences', payload);
    return response.data;
}

async function uploadExperienceImage(
    experienceId: string,
    image: ImageFile,
    sortOrder: number
): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('file', image.file);
    formData.append('sort_order', sortOrder.toString());
    formData.append('image_type', sortOrder === 0 ? 'main' : 'gallery');

    const response = await apiClient.post<UploadImageResponse>(
        `/api/v1/experiences/${experienceId}/images/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
}

async function createAvailabilitySlots(payload: BulkCreateSlotsPayload): Promise<BulkCreateSlotsResponse> {
    const { experienceId, ...data } = payload;
    const response = await apiClient.post<BulkCreateSlotsResponse>(
        `/api/v1/experiences/${experienceId}/availability/bulk`,
        data
    );
    return response.data;
}

async function createMultiBlockAvailability(payload: BulkMultiBlockPayload): Promise<BulkMultiBlockResponse> {
    const { experienceId, blocks } = payload;
    const response = await apiClient.post<BulkMultiBlockResponse>(
        `/api/v1/experiences/${experienceId}/availability/bulk-multi`,
        { blocks }
    );
    return response.data;
}

// Transform AvailabilityBlock[] from store to API payload
export function transformBlocksToPayload(experienceId: string, blocks: AvailabilityBlock[]): BulkMultiBlockPayload {
    return {
        experienceId,
        blocks: blocks.map(block => ({
            start_date: block.startDate,
            end_date: block.endDate,
            capacity: block.defaultCapacity,
            slots: block.slots,
            // Precios de temporada (obligatorios - convertir a centavos)
            price_per_adult_cents: Math.round((block.pricePerAdult || 0) * 100),
            price_per_child_cents: Math.round((block.pricePerChild || 0) * 100),
            commission_per_adult_cents: Math.round((block.commissionPerAdult || 0) * 100),
            commission_per_child_cents: Math.round((block.commissionPerChild || 0) * 100),
        })),
    };
}


// Hooks
export function useCreateExperience() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, resortId }: { data: CreateExperienceFormData; resortId: string }) =>
            createExperience(data, resortId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
            queryClient.invalidateQueries({ queryKey: ['my-experiences'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'experiences'] });
        },
    });
}

export function useUploadExperienceImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ experienceId, image, sortOrder }: {
            experienceId: string;
            image: ImageFile;
            sortOrder: number;
        }) => uploadExperienceImage(experienceId, image, sortOrder),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['experience', variables.experienceId] });
        },
    });
}

export function useCreateAvailabilitySlots() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: BulkCreateSlotsPayload) => createAvailabilitySlots(payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['experience', variables.experienceId] });
        },
    });
}

export function useCreateMultiBlockAvailability() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: BulkMultiBlockPayload) => createMultiBlockAvailability(payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['experience', variables.experienceId] });
        },
    });
}

// Fetcher
async function getExperiences(params?: { search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<ExperienceListItem>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    // Public endpoint for tourists/general listing
    const response = await apiClient.get<PaginatedResponse<ExperienceListItem>>(`/api/v1/experiences?${searchParams.toString()}`);
    return response.data;
}

async function getMyExperiences(params?: { search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<ExperienceListItem>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    // Management endpoint for resorts/agents
    const response = await apiClient.get<PaginatedResponse<ExperienceListItem>>(`/api/v1/experiences/management?${searchParams.toString()}`);
    return response.data;
}

// Query Hook
export function useExperiences(params?: { search?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ['experiences', params],
        queryFn: () => getExperiences(params),
    });
}

export function useMyExperiences(params?: { search?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ['my-experiences', params],
        queryFn: () => getMyExperiences(params),
    });
}

// Batch upload helper
export function useUploadExperienceImages() {
    const uploadMutation = useUploadExperienceImage();

    const uploadAll = async (experienceId: string, images: ImageFile[]) => {
        const results: { success: number; failed: number } = { success: 0, failed: 0 };

        for (let i = 0; i < images.length; i++) {
            try {
                await uploadMutation.mutateAsync({
                    experienceId,
                    image: images[i],
                    sortOrder: i,
                });
                results.success++;
            } catch (error) {
                console.error(`Failed to upload image ${i}:`, error);
                results.failed++;
            }
        }

        return results;
    };

    return {
        uploadAll,
        isLoading: uploadMutation.isPending,
        error: uploadMutation.error,
    };
}

// Get single experience by ID
async function getExperienceById(id: string): Promise<ExperienceListItem> {
    // Use management endpoint to get detail without currency conversion (always COP)
    // and to allow viewing non-active experiences
    const response = await apiClient.get<ExperienceListItem>(`/api/v1/experiences/management/${id}?include_images=true`);
    return response.data;
}

// Delete experience (soft delete)
async function deleteExperience(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/experiences/${id}`);
}

// Hook for fetching single experience
export function useExperience(id: string) {
    return useQuery({
        queryKey: ['experience', id],
        queryFn: () => getExperienceById(id),
        enabled: !!id,
    });
}

// Hook for deleting experience
export function useDeleteExperience() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteExperience(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
            queryClient.invalidateQueries({ queryKey: ['my-experiences'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'experiences'] });
        },
    });
}

// Export type for use in other components
export type { ExperienceListItem, ExperienceImage };
