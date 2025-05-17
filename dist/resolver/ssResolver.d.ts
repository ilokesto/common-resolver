import { Resolver, ValidateSchema } from "../types";
export declare function superstructResolver<T>(schema: ValidateSchema<T>["superstruct"]): Resolver<T>;
