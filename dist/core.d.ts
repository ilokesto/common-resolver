import { Resolver, ValidateSchema } from "./types";
export declare function getResolver<T>(validator: ValidateSchema<T>[keyof ValidateSchema<T>]): Resolver<T>;
export declare function zodResolver<T>(schema: ValidateSchema<T>["zod"]): Resolver<T>;
export declare function yupResolver<T>(schema: ValidateSchema<T>["yup"]): Resolver<T>;
export declare function superstructResolver<T>(schema: ValidateSchema<T>["superstruct"]): Resolver<T>;
