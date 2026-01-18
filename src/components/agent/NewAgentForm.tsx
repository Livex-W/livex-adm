'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Card, Input, PhoneInput, PasswordInput } from '@/components/ui';
import { Save } from 'lucide-react';
import { useResortStore } from '@/lib/resort-store';
import { useAgentsStore } from '@/lib/agents-store';
import { ROUTES } from '@/routes';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const DOCUMENT_TYPES = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'NIT', label: 'NIT' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'PASSPORT', label: 'Pasaporte' },
] as const;

const createAgentSchema = z.object({
    fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    documentType: z.enum(['CC', 'NIT', 'CE', 'PASSPORT'], {
        message: 'Selecciona el tipo de documento',
    }),
    documentNumber: z.string().min(5, 'El documento debe tener al menos 5 caracteres'),
    email: z.email('Email inválido'),
    phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    nit: z.string().optional()
        .refine(val => !val || /^\d{9}-\d$/.test(val), { message: 'El NIT debe tener el formato 123456789-0' }),
    rnt: z.string().optional()
        .refine(val => !val || /^\d{5}$/.test(val), { message: 'El RNT debe tener exactamente 5 dígitos' }),
    commissionAmount: z.string().refine(
        (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0;
        },
        { message: 'Debe ser un monto válido' }
    ),
});

type CreateAgentFormData = z.infer<typeof createAgentSchema>;

export default function NewAgentForm() {
    const router = useRouter();
    const { resort } = useResortStore();
    const { createAgent } = useAgentsStore();

    const form = useForm<CreateAgentFormData>({
        resolver: zodResolver(createAgentSchema),
        defaultValues: {
            fullName: '',
            documentType: 'CC',
            documentNumber: '',
            email: '',
            phone: '',
            password: '',
            nit: '',
            rnt: '',
            commissionAmount: '50000',
        },
    });

    const onSubmit = async (data: CreateAgentFormData) => {
        if (!resort?.id) {
            toast.error('No se encontró el resort asociado.');
            return;
        }

        try {
            const commissionFixedCents = Math.round(parseFloat(data.commissionAmount) * 100);

            await createAgent({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                phone: data.phone,
                documentType: data.documentType,
                documentNumber: data.documentNumber,
                nit: data.nit || undefined,
                rnt: data.rnt || undefined,
                commissionFixedCents,
                resortId: resort.id,
            });

            toast.success('Agente creado exitosamente');
            router.push(ROUTES.DASHBOARD.AGENTS.LIST);
        } catch (error: unknown) {
            console.error('Failed to create agent:', error);
            const message = error instanceof Error ? error.message : 'Error al crear el agente';
            toast.error(message);
        }
    };

    const phoneValue = form.watch('phone');

    return (
        <Card className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 border-b pb-2">
                        Información Personal
                    </h3>
                    <Input
                        label="Agencia o Nombre Completo"
                        placeholder="Ej. Natural Tours / Pedro Martinez"
                        {...form.register('fullName')}
                        error={form.formState.errors.fullName?.message}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Tipo de Documento
                            </label>
                            <select
                                {...form.register('documentType')}
                                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            >
                                {DOCUMENT_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            {form.formState.errors.documentType && (
                                <p className="mt-1 text-sm text-red-500">{form.formState.errors.documentType.message}</p>
                            )}
                        </div>

                        <Input
                            label="Número de Documento"
                            placeholder="1047494615"
                            {...form.register('documentNumber')}
                            error={form.formState.errors.documentNumber?.message}
                            helperText="Sin dígito de verificación"
                        />
                    </div>

                    <Input
                        label="Correo Electrónico"
                        type="email"
                        placeholder="agente@email.com"
                        {...form.register('email')}
                        error={form.formState.errors.email?.message}
                    />

                    <PhoneInput
                        label="Celular"
                        placeholder="+57 304 105 2777"
                        value={phoneValue || ''}
                        onChange={(phone) => form.setValue('phone', phone)}
                        defaultCountry="co"
                        error={form.formState.errors.phone?.message}
                    />

                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <PasswordInput
                                label="Contraseña"
                                placeholder="Mínimo 6 caracteres"
                                {...field}
                                error={form.formState.errors.password?.message}
                            />
                        )}
                    />

                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 border-b pb-2 pt-4">
                        Documentos de la Agencia (Opcional)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="NIT"
                            placeholder="800098813-6"
                            {...form.register('nit')}
                            error={form.formState.errors.nit?.message}
                            helperText="Incluyendo dígito de verificación"
                        />
                        <Input
                            label="RNT"
                            placeholder="12345"
                            {...form.register('rnt')}
                            error={form.formState.errors.rnt?.message}
                            helperText="Registro Nacional de Turismo"
                        />
                    </div>

                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 border-b pb-2 pt-4">
                        Configuración de Comisión
                    </h3>

                    <Input
                        label="Comisión por Venta (COP)"
                        type="number"
                        min="0"
                        step="1000"
                        {...form.register('commissionAmount')}
                        error={form.formState.errors.commissionAmount?.message}
                        helperText="Monto fijo en pesos por cada venta realizada por este agente"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        isLoading={form.formState.isSubmitting}
                        leftIcon={<Save className="h-4 w-4" />}
                        disabled={!resort?.id}
                    >
                        Crear Agente
                    </Button>
                </div>
            </form>
        </Card>
    );
}
