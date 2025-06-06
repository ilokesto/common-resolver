import { ValidateSchema } from "../type";
export declare function yupParser<T>(data: T, schema: ValidateSchema<T>["yup"], options?: {
    throwError: boolean;
}): T;
