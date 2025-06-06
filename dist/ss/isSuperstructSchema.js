export function isSuperstructSchema(validator) {
    return validator instanceof (require("superstruct").Struct);
}
