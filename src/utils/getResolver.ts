import { isSuperstructSchema } from "../ss/isSuperstructSchema";
import { superstructResolver } from "../ss/ssResolver";
import { Resolver } from "../types";
import { isYupSchema } from "../yup/isYupSchema";
import { yupResolver } from "../yup/yupResolver";
import { isZodSchema } from "../zod/isZodSchema";
import { zodResolver } from "../zod/zodResolver";

export type ValidateSchema<T> = {
  zod: import("zod").ZodSchema<T>;
  yup: import("yup").Schema<T>;
  superstruct: import("superstruct").Struct<T, any>;
}

export function getResolver<T>(validator: ValidateSchema<T>[keyof ValidateSchema<T>]): Resolver<T> {
  if (isZodSchema<T>(validator)) {
    return zodResolver(validator);
  } else if (isYupSchema<T>(validator)) {
    return yupResolver(validator);
  } else if (isSuperstructSchema<T>(validator)) {
    return superstructResolver(validator);
  } else {
    throw new Error("Unsupported validation library");  
  }
}