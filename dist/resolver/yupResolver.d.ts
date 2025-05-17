import { ValidateSchema, Resolver } from "../types";
export declare function yupResolver<T>(schema: ValidateSchema<T>["yup"]): Resolver<T>;
