import { commonParser } from "../utils/commonParser";
import { superstructResolver } from "./ssResolver";

export function superstructParser<T>(data: T, schema: import("superstruct").Struct<T, any>, options?: { throwError: boolean }): T {
  return commonParser(data, schema, superstructResolver, options);
}