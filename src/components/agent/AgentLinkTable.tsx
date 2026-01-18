'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Card, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { Search, Link as LinkIcon, X } from 'lucide-react';
import { useResortStore } from '@/lib/resort-store';
import { useAgentsStore } from '@/lib/agents-store';
import { toast } from 'sonner';

// --- Types & Schemas ---

interface SearchResultUser {
    id: string;
    full_name: string;
    email: string;
    avatar?: string;
}

const linkAgentSchema = z.object({
    commissionAmount: z.string().refine(
        (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0;
        },
        { message: 'Debe ser un monto válido' }
    ),
});

type LinkAgentFormData = z.infer<typeof linkAgentSchema>;

// --- Components ---

export default function AgentLinkTable() {
    const { resort } = useResortStore();
    const { searchUnassignedAgents, createAgreement } = useAgentsStore();
    const queryClient = useQueryClient();

    // Local State
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(''); // Could add actual debounce, but for now search on submit/enter
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<SearchResultUser | null>(null);

    // React Query for Data Fetching
    const { data, isLoading, isError } = useQuery({
        queryKey: ['unassigned-agents', resort?.id, page, debouncedSearch],
        queryFn: async () => {
            if (!resort?.id) return null;
            return await searchUnassignedAgents(resort.id, debouncedSearch, page, 5);
        },
        enabled: !!resort?.id,
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); // Reset to page 1 on new search
        setDebouncedSearch(searchQuery);
    };

    const handleLinkSuccess = () => {
        setSelectedUser(null);
        // Invalidates the query to refresh the list automatically
        queryClient.invalidateQueries({ queryKey: ['unassigned-agents'] });
    };

    const searchResults = data?.data || [];
    const pagination = data ? data.meta : { total: 0, total_pages: 0, page: 1, limit: 5 };

    return (
        <div className="space-y-4">
            <Card className="p-4">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <div className="flex-1">
                        <Input
                            placeholder="Buscar por nombre o correo electrónico..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        leftIcon={<Search className="h-4 w-4" />}
                    >
                        Buscar
                    </Button>
                </form>
            </Card>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Agente</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-red-500">
                                    Error al cargar agentes.
                                </TableCell>
                            </TableRow>
                        ) : searchResults.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                                    No se encontraron agentes disponibles.
                                </TableCell>
                            </TableRow>
                        ) : (
                            searchResults.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                                                {user.full_name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-slate-900 dark:text-slate-100">
                                                {user.full_name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500 dark:text-slate-400">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedUser(user)}
                                            leftIcon={<LinkIcon className="h-3 w-3" />}
                                        >
                                            Vincular
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="p-4 border-t flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        {pagination.total} resultados
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page <= 1 || isLoading}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page >= pagination.total_pages || isLoading}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Link Modal */}
            {selectedUser && (
                <LinkAgentModal
                    user={selectedUser}
                    resortId={resort?.id}
                    onClose={() => setSelectedUser(null)}
                    onSuccess={handleLinkSuccess}
                    createAgreement={createAgreement}
                />
            )}
        </div>
    );
}

// --- Sub-component: Link Modal ---

interface LinkAgentModalProps {
    user: SearchResultUser;
    resortId?: string;
    onClose: () => void;
    onSuccess: () => void;
    createAgreement: (resortId: string, userId: string, commissionBps: number, commissionFixedCents: number) => Promise<any>;
}

function LinkAgentModal({ user, resortId, onClose, onSuccess, createAgreement }: LinkAgentModalProps) {
    const form = useForm<LinkAgentFormData>({
        resolver: zodResolver(linkAgentSchema),
        defaultValues: {
            commissionAmount: '50000',
        },
    });

    const onSubmit = async (data: LinkAgentFormData) => {
        if (!resortId) return;

        try {
            const commissionFixedCents = Math.round(parseFloat(data.commissionAmount) * 100);

            await createAgreement(
                resortId,
                user.id,
                0,
                commissionFixedCents
            );

            toast.success(`Agente ${user.full_name} vinculado exitosamente`);
            onSuccess();
        } catch (error: unknown) {
            console.error('Failed to link agent:', error);
            const message = error instanceof Error ? error.message : 'Error al vincular el agente';
            toast.error(message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Vincular a {user.full_name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <p className="text-sm text-slate-500">
                    Define la comisión que recibirá este agente por cada venta de tus experiencias.
                </p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Comisión por Venta (COP)"
                        type="number"
                        min="0"
                        step="1000"
                        autoFocus
                        {...form.register('commissionAmount')}
                        error={form.formState.errors.commissionAmount?.message}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            isLoading={form.formState.isSubmitting}
                        >
                            Confirmar Vinculación
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
