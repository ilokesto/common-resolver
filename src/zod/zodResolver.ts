import type { Resolver } from "../types";
import { createErrorProxy, errorPathObjectify } from "../utils";

export function zodResolver<T>(schema: import("zod").ZodSchema<T>): Resolver<T> {
  const formatter = (obj: Array<{message: string, path: Array<PropertyKey>}>) => {
    return obj.reduce((acc, { message, path }) => {
      // Filter out symbols from path to ensure compatibility with both v3 and v4
      const stringPath = path.filter((p): p is string | number => typeof p !== 'symbol');
      acc[stringPath.join('.') || "root"] = message;
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