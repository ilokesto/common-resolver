export function isSuperstructSchema<T>(validator: any): validator is import("superstruct").Struct<T, any> {
  return validator instanceof (require("superstruct").Struct);
}