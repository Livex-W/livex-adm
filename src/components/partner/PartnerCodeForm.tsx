'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { useCreatePartnerCode } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const createPartnerCodeSchema = z.object({
    code: z.string().min(3, 'El código debe tener al menos 3 caracteres'),
    commissionType: z.enum(['percentage', 'fixed'], {
        message: 'Selecciona el tipo de comisión',
    }),
    commissionValue: z.string().refine(
        (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
        },
        { message: 'Debe ser un valor mayor a 0' }
    ),
    description: z.string().optional(),
});

type CreatePartnerCodeFormData = z.infer<typeof createPartnerCodeSchema>;

interface PartnerCodeFormProps {
    partnerId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function PartnerCodeForm({ partnerId, onSuccess, onCancel }: PartnerCodeFormProps) {
    const createCodeMutation = useCreatePartnerCode(partnerId);

    const form = useForm<CreatePartnerCodeFormData>({
        resolver: zodResolver(createPartnerCodeSchema),
        defaultValues: {
            code: '',
            commissionType: 'percentage',
            commissionValue: '',
            description: '',
        },
    });

    const commissionType = form.watch('commissionType');

    const onSubmit = (data: CreatePartnerCodeFormData) => {
        const value = parseFloat(data.commissionValue);

        // Convert to internal format:
        // - Percentage: user enters 5 (meaning 5%), we send 500 (basis points)
        // - Fixed: user enters 50000 (COP), we send 5000000 (centavos)
        const convertedValue = Math.round(value * 100);

        createCodeMutation.mutate({
            code: data.code.toUpperCase(),
            commissionType: data.commissionType,
            commissionValue: convertedValue,
            description: data.description || undefined,
        }, {
            onSuccess: () => {
                toast.success('Código creado exitosamente');
                form.reset();
                onSuccess?.();
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || 'Error al crear el código';
                toast.error(message);
            },
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Código"
                    placeholder="EJ: PARTNER2024"
                    {...form.register('code', {
                        onChange: (e) => {
                            e.target.value = e.target.value.toUpperCase();
                        }
                    })}
                    error={form.formState.errors.code?.message}
                />
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Tipo de Comisión
                    </label>
                    <select
                        {...form.register('commissionType')}
                        className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                        <option value="percentage">Porcentual (%)</option>
                        <option value="fixed">Fijo (COP)</option>
                    </select>
                    {form.formState.errors.commissionType && (
                        <p className="mt-1 text-sm text-red-500">{form.formState.errors.commissionType.message}</p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={commissionType === 'percentage' ? 'Comisión (%)' : 'Comisión (COP)'}
                    type="text"
                    inputMode="decimal"
                    placeholder={commissionType === 'percentage' ? '5' : '50000'}
                    {...form.register('commissionValue')}
                    error={form.formState.errors.commissionValue?.message}
                    helperText={commissionType === 'percentage' ? 'Ej: 5 = 5%' : 'Monto en pesos colombianos'}
                />
                <Input
                    label="Descripción (opcional)"
                    placeholder="Código de partner premium"
                    {...form.register('description')}
                    error={form.formState.errors.description?.message}
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" isLoading={createCodeMutation.isPending}>
                    Crear Código
                </Button>
            </div>
        </form>
    );
}
