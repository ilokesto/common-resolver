import { zodResolver } from "../resolver/zodResolver";
import { ValidateSchema } from "../type";
import { commonParser } from "./commonParser";

export function zodParser<T>(data: T, schema: ValidateSchema<T>["zod"], options?: { throwError: boolean }): T {
  return commonParser(data, schema, zodResolver, options);
  }