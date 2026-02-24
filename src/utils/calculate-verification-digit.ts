export function calculateVerificationDigit(nitBase: string): number {
    const NIT_WEIGHTS = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];

    let total = 0;
    const digits = nitBase.split('').reverse().map(Number);

    for (let i = 0; i < digits.length; i++) {
        total += digits[i] * NIT_WEIGHTS[i];
    }

    const residue = total % 11;

    if (residue === 0) return 0;
    if (residue === 1) return 1;
    return 11 - residue;
}