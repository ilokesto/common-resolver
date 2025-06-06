import { Resolver } from "../types";
export type ValidateSchema<T> = {
    zod: import("zod").ZodSchema<T>;
    yup: import("yup").Schema<T>;
    superstruct: import("superstruct").Struct<T, any>;
};
export declare function getResolver<T>(validator: ValidateSchema<T>[keyof ValidateSchema<T>]): Resolver<T>;
