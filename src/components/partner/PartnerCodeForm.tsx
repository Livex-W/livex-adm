'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { useCreatePartnerCode } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const createPartnerCodeSchema = z.object({
    code: z.string().min(3, 'El código debe tener al menos 3 caracteres'),
    // Commission
    commissionType: z.enum(['percentage', 'fixed']),
    commissionValue: z.string().refine(
        (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0;
        },
        { message: 'Debe ser un valor válido' }
    ),
    // Discount
    discountType: z.enum(['percentage', 'fixed', 'none']),
    discountValue: z.string().optional(),
    description: z.string().optional(),
}).refine((data) => {
    if (data.discountType !== 'none') {
        const val = parseFloat(data.discountValue || '0');
        if (isNaN(val) || val <= 0) return false;
    }
    return true;
}, {
    message: "Si eliges un tipo de descuento, debes ingresar un valor mayor a 0",
    path: ["discountValue"],
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
            discountType: 'none',
            discountValue: '',
            description: '',
        },
    });

    const commissionType = form.watch('commissionType');
    const discountType = form.watch('discountType');

    const onSubmit = (data: CreatePartnerCodeFormData) => {
        const commValue = parseFloat(data.commissionValue) || 0;
        const discValue = parseFloat(data.discountValue || '0');

        // Convert to internal format (basis points or cents)
        const convertedCommValue = Math.round(commValue * 100);
        const convertedDiscValue = data.discountType !== 'none' ? Math.round(discValue * 100) : 0;

        createCodeMutation.mutate({
            code: data.code.toUpperCase(),
            commissionType: data.commissionType,
            commissionValue: convertedCommValue,
            discountType: data.discountType === 'none' ? undefined : data.discountType,
            discountValue: data.discountType === 'none' ? undefined : convertedDiscValue,
            description: data.description || undefined,
        }, {
            onSuccess: () => {
                toast.success('Código creado exitosamente');
                form.reset({
                    code: '',
                    commissionType: 'percentage',
                    commissionValue: '',
                    discountType: 'none',
                    discountValue: '',
                    description: ''
                });
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
                <Input
                    label="Descripción (opcional)"
                    placeholder="Código de partner premium"
                    {...form.register('description')}
                    error={form.formState.errors.description?.message}
                />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Comisión del Partner</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                    <Input
                        label={commissionType === 'percentage' ? 'Valor Comisión (%)' : 'Valor Comisión (COP)'}
                        type="text"
                        inputMode="decimal"
                        placeholder={commissionType === 'percentage' ? '5' : '50000'}
                        {...form.register('commissionValue')}
                        error={form.formState.errors.commissionValue?.message}
                        helperText={commissionType === 'percentage' ? 'Ej: 5 = 5%' : 'Monto en pesos colombianos'}
                    />
                </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Descuento al Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Tipo de Descuento
                        </label>
                        <select
                            {...form.register('discountType')}
                            className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                            <option value="none">Sin Descuento</option>
                            <option value="percentage">Porcentual (%)</option>
                            <option value="fixed">Fijo (COP)</option>
                        </select>
                    </div>
                    {discountType !== 'none' && (
                        <Input
                            label={discountType === 'percentage' ? 'Valor Descuento (%)' : 'Valor Descuento (COP)'}
                            type="text"
                            inputMode="decimal"
                            placeholder={discountType === 'percentage' ? '10' : '20000'}
                            {...form.register('discountValue')}
                            error={form.formState.errors.discountValue?.message}
                            helperText={discountType === 'percentage' ? 'Ej: 10 = 10% OFF' : 'Monto a descontar en COP'}
                        />
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
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
