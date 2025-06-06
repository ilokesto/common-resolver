import { ValidateSchema } from "../type";
export declare function zodParser<T>(data: T, schema: ValidateSchema<T>["zod"], options?: {
    throwError: boolean;
}): T;
