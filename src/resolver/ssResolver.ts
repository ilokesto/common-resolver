import { Resolver, ValidateSchema } from "../type";
import { createErrorProxy, errorPathObjectify } from "../utils";

export function superstructResolver<T>(schema: ValidateSchema<T>["superstruct"]): Resolver<T> {
  const { validate } = require("superstruct");

  const formatter = (obj: Array<{message: string, path: Array<string | number>}>) => {
    return obj.reduce((acc, { message, path }) => {
      acc[path.join('.') || "root"] = message;
      return acc;
    }, {} as Record<string, string>);
  }

  return {
    validate: (state: T) => {
      const [error] = validate(state, schema);

      if (!error) {
        return {
          valid: true,
          error: null,
        };
      } else {
        return {
          valid: false,
          error: createErrorProxy(errorPathObjectify(formatter(error.failures()))),
        }
      }
    }
  }
}