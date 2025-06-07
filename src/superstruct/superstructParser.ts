import { commonParser } from "../utils/commonParser";
import { superstructResolver } from "./superstructResolver";

export function superstructParser<T>(data: NoInfer<T>, schema: import("superstruct").Struct<T, any>, options?: { throwError: boolean }): T {
  return commonParser(data, schema, superstructResolver, options);
}