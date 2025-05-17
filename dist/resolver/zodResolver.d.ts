import { Resolver, ValidateSchema } from "../types";
export declare function zodResolver<T>(schema: ValidateSchema<T>["zod"]): Resolver<T>;
