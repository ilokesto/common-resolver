import { ValidateSchema, Resolver } from "../type";
export declare function yupResolver<T>(schema: ValidateSchema<T>["yup"]): Resolver<T>;
