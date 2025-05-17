import { Resolver, ValidateSchema } from "../type";
export declare function superstructResolver<T>(schema: ValidateSchema<T>["superstruct"]): Resolver<T>;
