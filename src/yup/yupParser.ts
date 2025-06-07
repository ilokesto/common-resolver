import { commonParser } from "../utils/commonParser";
import { yupResolver } from "./yupResolver";

export function yupParser<T>(data: NoInfer<T>, schema: import("yup").Schema<T>, options?: { throwError: boolean }): T {
  return commonParser(data, schema, yupResolver, options);
}
