export declare function zodParser<T>(data: NoInfer<T>, schema: import("zod").ZodSchema<T>, options?: {
    throwError: boolean;
}): T;
