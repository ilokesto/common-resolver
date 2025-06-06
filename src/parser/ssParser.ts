import { superstructResolver } from "../resolver/ssResolver";
import { ValidateSchema } from "../type";
import { commonParser } from "./commonParser";

export function superstructParser<T>(data: T, schema: ValidateSchema<T>["superstruct"], options?: { throwError: boolean }): T {
  return commonParser(data, schema, superstructResolver, options);
}