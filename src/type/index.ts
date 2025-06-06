import { z } from "zod";
import * as yup from "yup";
import { Struct } from "superstruct";

export type ValidateSchema<T> = {
  zod: z.ZodSchema<T>;
  yup: yup.Schema<T>;
  superstruct: Struct<T, any>;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? RecursivePartial<T[P]>
    : string;
};

type CRES<T> = RecursivePartial<T> & { "root"?: string };

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
}

export function isZodSchema<T>(validator: any): validator is import("zod").ZodSchema<T> {
  return validator && typeof validator.parse === 'function' && typeof validator.safeParse === 'function';
}

export function isYupSchema<T>(validator: any): validator is import("yup").Schema<T> {
  return validator instanceof (require("yup").Schema);
}

export function isSuperstructSchema<T>(validator: any): validator is import("superstruct").Struct<T, any> {
  return validator instanceof (require("superstruct").Struct);
}
