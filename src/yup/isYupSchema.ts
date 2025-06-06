export function isYupSchema<T>(validator: any): validator is import("yup").Schema<T> {
  return validator instanceof (require("yup").Schema);
}