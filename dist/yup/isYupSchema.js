export function isYupSchema(validator) {
    return validator instanceof (require("yup").Schema);
}
