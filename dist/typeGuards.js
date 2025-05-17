export function isZodSchema(validator) {
    return validator && typeof validator.parse === 'function' && typeof validator.safeParse === 'function';
}
export function isYupSchema(validator) {
    return validator instanceof (require("yup").Schema);
}
export function isSuperstructSchema(validator) {
    return validator instanceof (require("superstruct").Struct);
}
