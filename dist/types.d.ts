import { z } from "zod";
import * as yup from "yup";
import { Struct } from "superstruct";
export type ValidateSchema<T> = {
    zod: z.ZodSchema<T>;
    yup: yup.Schema<T>;
    superstruct: Struct<T, any>;
};
export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
export type Resolver<T> = {
    validate: (state: T, name?: string) => {
        valid: true;
        error: null;
    } | {
        valid: false;
        error: RecursivePartial<T> & {
            "root"?: string;
        };
    };
};
