import { Resolver, ValidateSchema } from "../type";
export declare function commonParser<T, K extends ValidateSchema<T>[keyof ValidateSchema<T>]>(data: T, schema: K, resolver: (schema: K) => Resolver<T>, options?: {
    throwError: boolean;
}): T;
