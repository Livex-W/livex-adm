import { z } from 'zod';

// Login schema
export const loginSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register schema
export const registerSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[a-z]/, 'Debe contener al menos una minúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número'),
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Reset password schema
export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[a-z]/, 'Debe contener al menos una minúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
