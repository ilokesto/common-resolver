import { ValidateSchema, Resolver } from "../type";
export declare function getResolver<T>(validator: ValidateSchema<T>[keyof ValidateSchema<T>]): Resolver<T>;
