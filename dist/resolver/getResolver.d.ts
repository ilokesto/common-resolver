import { ValidateSchema, Resolver } from "../types";
export declare function getResolver<T>(validator: ValidateSchema<T>[keyof ValidateSchema<T>]): Resolver<T>;
