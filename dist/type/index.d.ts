export type ValidateSchema<T> = {
    zod: import("zod").ZodSchema<T>;
    yup: import("yup").Schema<T>;
    superstruct: import("superstruct").Struct<T, any>;
};
export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : string;
};
type CRES<T> = RecursivePartial<T> & {
    "root"?: string;
};
export type Resolver<T> = {
    validate: (state: T, name?: string) => {
        valid: true;
        error: null;
        data: T;
    } | {
        valid: false;
        error: CRES<T>;
        data: null;
    };
};
export declare function isZodSchema<T>(validator: any): validator is import("zod").ZodSchema<T>;
export declare function isYupSchema<T>(validator: any): validator is import("yup").Schema<T>;
export declare function isSuperstructSchema<T>(validator: any): validator is import("superstruct").Struct<T, any>;
export {};
