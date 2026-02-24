import { calculateVerificationDigit } from "@/utils/calculate-verification-digit";
import z from "zod";

export const nitSchema = z.string()
    .transform((val) => val.replace(/\s/g, ''))
    .refine((val) => {
        const regex = /^[0-9]+-[0-9]{1,2}$/;
        if (!regex.test(val)) return false;

        const [nitBase, dvInput] = val.split('-');

        if (nitBase.length < 4 || nitBase.length > 15) return false;

        const calculatedDV = calculateVerificationDigit(nitBase);

        const inputDV = parseInt(dvInput[0], 10);

        return inputDV === calculatedDV;

    }, {
        message: "El NIT no es válido o el dígito de verificación no coincide."
    });