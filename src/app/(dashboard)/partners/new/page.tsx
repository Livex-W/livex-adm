'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, PasswordInput, PhoneInput } from '@/components/ui';
import { ArrowLeft, Save } from 'lucide-react';
import { ROUTES } from '@/routes';
import { useCreatePartner } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const createPartnerSchema = z.object({
    fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

type CreatePartnerFormData = z.infer<typeof createPartnerSchema>;

export default function NewPartnerPage() {
    const router = useRouter();
    const createPartnerMutation = useCreatePartner();

    const form = useForm<CreatePartnerFormData>({
        resolver: zodResolver(createPartnerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
        },
    });

    const onSubmit = (data: CreatePartnerFormData) => {
        createPartnerMutation.mutate(data, {
            onSuccess: () => {
                toast.success('Partner creado exitosamente');
                router.push(ROUTES.DASHBOARD.PARTNERS.LIST);
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || 'Error al crear el partner';
                toast.error(message);
            },
        });
    };

    const phoneValue = form.watch('phone');

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Nuevo Partner
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Registra un nuevo partner en la plataforma
                    </p>
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Partner</CardTitle>
                        <CardDescription>
                            Ingresa los datos del nuevo partner. Se creará con rol de partner.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            label="Nombre Completo"
                            placeholder="Juan Pérez"
                            {...form.register('fullName')}
                            error={form.formState.errors.fullName?.message}
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="partner@ejemplo.com"
                            {...form.register('email')}
                            error={form.formState.errors.email?.message}
                        />

                        <PhoneInput
                            label="Celular"
                            placeholder="+57 300 123 4567"
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
                                    placeholder="Mínimo 8 caracteres"
                                    {...field}
                                    error={form.formState.errors.password?.message}
                                />
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                isLoading={createPartnerMutation.isPending}
                                leftIcon={<Save className="h-4 w-4" />}
                            >
                                Crear Partner
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
