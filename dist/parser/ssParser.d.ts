import { ValidateSchema } from "../type";
export declare function superstructParser<T>(data: T, schema: ValidateSchema<T>["superstruct"], options?: {
    throwError: boolean;
}): T;
