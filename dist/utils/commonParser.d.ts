import { Resolver } from "../types";
export declare function commonParser<T, K>(data: T, schema: K, resolver: (schema: K) => Resolver<T>, options?: {
    throwError: boolean;
}): T;
