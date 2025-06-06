import type { Resolver } from "../types";
export declare function zodResolver<T>(schema: import("zod").ZodSchema<T>): Resolver<T>;
