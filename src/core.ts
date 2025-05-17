import { isZodSchema, isYupSchema, isSuperstructSchema } from "./typeGuards"
import { Resolver, ValidateSchema } from "./types";
import { validate } from "superstruct";
import { bracketIndexToDot, createErrorProxy, errorPathObjectify } from "./utils";

export function getResolver<T>(validator: ValidateSchema<T>[keyof ValidateSchema<T>]): Resolver<T> {
  if (isZodSchema<T>(validator)) {
    return zodResolver(validator);
  } else if (isYupSchema<T>(validator)) {
    return yupResolver(validator);
  } else if (isSuperstructSchema<T>(validator)) {
    return superstructResolver(validator);
  } else {
    throw new Error("Unsupported validation library");  
  }
}

export function zodResolver<T>(schema: ValidateSchema<T>["zod"]): Resolver<T> {
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
        };
      } else {
        return {
          valid: false,
          error: createErrorProxy(errorPathObjectify(formatter(result.error.issues))),
        };
      }
    }
  }
}

export function yupResolver<T>(schema: ValidateSchema<T>["yup"]): Resolver<T> {
  const formatter = (e: Array<{ errors: Array<string>, path: string }>) => {
    return e.reduce((acc, err) => {
      acc[bracketIndexToDot(err.path) || "root"] = err.errors[0];
      return acc;
    }, {} as Record<string, string>);
  }

  return {
    validate: (state: T) => {
        try {
          schema.validateSync(state, { abortEarly: false });
          return {
            valid: true,
            error: null,
          }
        } catch (e: any) {
          return {
            valid: false,
            error: createErrorProxy(errorPathObjectify(formatter(e.inner)))
          }
        }
      }
    }
}

export function superstructResolver<T>(schema: ValidateSchema<T>["superstruct"]): Resolver<T> {
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