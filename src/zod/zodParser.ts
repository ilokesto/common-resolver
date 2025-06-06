import { commonParser } from "../utils/commonParser";
import { zodResolver } from "./zodResolver";

export function zodParser<T>(data: T, schema: import("zod").ZodSchema<T>, options?: { throwError: boolean }): T {
  return commonParser(data, schema, zodResolver, options);
  }