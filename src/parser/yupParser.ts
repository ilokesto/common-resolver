import { yupResolver } from "../resolver/yupResolver";
import { ValidateSchema } from "../type";
import { commonParser } from "./commonParser";

export function yupParser<T>(data: T, schema: ValidateSchema<T>["yup"], options?: { throwError: boolean }): T {
  return commonParser(data, schema, yupResolver, options);
}
