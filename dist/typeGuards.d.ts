export declare function isZodSchema<T>(validator: any): validator is import("zod").ZodSchema<T>;
export declare function isYupSchema<T>(validator: any): validator is import("yup").Schema<T>;
export declare function isSuperstructSchema<T>(validator: any): validator is import("superstruct").Struct<T, any>;
