export function isZodSchema<T>(validator: any): validator is import("zod").ZodSchema<T> {
  return validator && typeof validator.parse === 'function' && typeof validator.safeParse === 'function';
}

export function isYupSchema<T>(validator: any): validator is import("yup").Schema<T> {
  return validator instanceof (require("yup").Schema);
}

export function isSuperstructSchema<T>(validator: any): validator is import("superstruct").Struct<T, any> {
  return validator instanceof (require("superstruct").Struct);
}
