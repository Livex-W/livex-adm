'use client';

import { ROUTES } from '@/routes';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Input, PasswordInput } from '@/components/ui';
import { AlertCircle } from 'lucide-react';
import { AuthError, getErrorMessage } from '@/types/errors';

// Password regex: 8+ chars, uppercase, lowercase, numbers
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const registerSchema = z.object({
    fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    nit: z.string().regex(/^\d{9}-\d$/, 'Formato: 800098813-6'),
    rnt: z.string().regex(/^\d{5}$/, 'Debe tener 5 dígitos'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(PASSWORD_REGEX, 'Debe incluir mayúsculas, minúsculas y números'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
        message: 'Debes aceptar los términos y condiciones',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser } = useAuthStore();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);
        setError(null);
        try {
            await registerUser({
                email: data.email,
                password: data.password,
                fullName: data.fullName,
                nit: data.nit,
                rnt: data.rnt,
            });
            router.push(ROUTES.DASHBOARD.HOME);
        } catch (err) {
            const authError = err as AuthError;
            setError(getErrorMessage(authError));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Crea tu cuenta</h2>
                <p className="text-sm text-muted-foreground">
                    Registra tu resort y comienza a gestionar tus experiencias
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <Input
                        label="Nombre del Resort / Empresa"
                        placeholder="Ej. Hotel Paradiso"
                        error={errors.fullName?.message}
                        {...register('fullName')}
                    />

                    <Input
                        label="Email Corporativo"
                        type="email"
                        placeholder="reservas@hotel.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="NIT"
                            placeholder="800098813-6"
                            error={errors.nit?.message}
                            {...register('nit')}
                        />
                        <Input
                            label="RNT"
                            placeholder="23412"
                            error={errors.rnt?.message}
                            {...register('rnt')}
                        />
                    </div>

                    <PasswordInput
                        label="Contraseña"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        helperText="Mínimo 8 caracteres, incluir mayúsculas, minúsculas y números"
                        {...register('password')}
                    />

                    <PasswordInput
                        label="Confirmar Contraseña"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />

                    <div className="flex items-start space-x-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 rounded border-slate-300 text-primary focus:ring-primary"
                            {...register('terms')}
                        />
                        <label htmlFor="terms" className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Acepto los <Link href="/terms" className="text-primary hover:underline">términos y condiciones</Link> y la <Link href="/privacy" className="text-primary hover:underline">política de privacidad</Link>.
                        </label>
                    </div>
                    {errors.terms && (
                        <p className="text-sm text-red-500">{errors.terms.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading} disabled={!isValid} size="lg">
                    Registrarse
                </Button>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
                    <Link
                        href={ROUTES.AUTH.LOGIN}
                        className="font-medium text-primary hover:text-primary-hover underline-offset-4 hover:underline"
                    >
                        Inicia sesión
                    </Link>
                </div>
            </form>
        </div>
    );
}
