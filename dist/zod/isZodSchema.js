export function isZodSchema(validator) {
    return validator && typeof validator.parse === 'function' && typeof validator.safeParse === 'function';
}
