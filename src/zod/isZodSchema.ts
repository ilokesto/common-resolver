export function isZodSchema<T>(validator: any): validator is import("zod").ZodSchema<T> {
  return validator && typeof validator.parse === 'function' && typeof validator.safeParse === 'function';
}
