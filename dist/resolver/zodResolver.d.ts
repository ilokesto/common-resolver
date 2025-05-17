import { Resolver, ValidateSchema } from "../type";
export declare function zodResolver<T>(schema: ValidateSchema<T>["zod"]): Resolver<T>;
