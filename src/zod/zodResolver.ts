import type { Resolver } from "../types";
import { createErrorProxy, errorPathObjectify } from "../utils";

export function zodResolver<T>(schema: import("zod").ZodSchema<T>): Resolver<T> {
  const formatter = (obj: Array<{message: string, path: Array<string | number>}>) => {
    return obj.reduce((acc, { message, path }) => {
      acc[path.join('.') || "root"] = message;
      return acc;
    }, {} as Record<string, string>);
  }

  return {
    validate: (state: T) => {
      const result = schema.safeParse(state);
      if (result.success) {
        return {
          valid: true,
          error: null,
          data: state
        };
      } else {
        return {
          valid: false,
          error: createErrorProxy(errorPathObjectify(formatter(result.error.issues))),
          data: null
        };
      }
    }
  }
}