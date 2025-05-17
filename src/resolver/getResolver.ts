import { isZodSchema, isYupSchema, isSuperstructSchema } from "../types";
import { ValidateSchema, Resolver } from "../types";
import { superstructResolver } from "./ssResolver";
import { yupResolver } from "./yupResolver";
import { zodResolver } from "./zodResolver";

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