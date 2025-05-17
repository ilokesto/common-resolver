import { isZodSchema, isYupSchema, isSuperstructSchema } from "./typeGuards";
import { validate } from "superstruct";
import { bracketIndexToDot, createErrorProxy, errorPathObjectify } from "./utils";
export function getResolver(validator) {
    if (isZodSchema(validator)) {
        return zodResolver(validator);
    }
    else if (isYupSchema(validator)) {
        return yupResolver(validator);
    }
    else if (isSuperstructSchema(validator)) {
        return superstructResolver(validator);
    }
    else {
        throw new Error("Unsupported validation library");
    }
}
export function zodResolver(schema) {
    const formatter = (obj) => {
        return obj.reduce((acc, { message, path }) => {
            acc[path.join('.') || "root"] = message;
            return acc;
        }, {});
    };
    return {
        validate: (state) => {
            const result = schema.safeParse(state);
            if (result.success) {
                return {
                    valid: true,
                    error: null,
                };
            }
            else {
                return {
                    valid: false,
                    error: createErrorProxy(errorPathObjectify(formatter(result.error.issues))),
                };
            }
        }
    };
}
export function yupResolver(schema) {
    const formatter = (e) => {
        return e.reduce((acc, err) => {
            acc[bracketIndexToDot(err.path) || "root"] = err.errors[0];
            return acc;
        }, {});
    };
    return {
        validate: (state) => {
            try {
                schema.validateSync(state, { abortEarly: false });
                return {
                    valid: true,
                    error: null,
                };
            }
            catch (e) {
                return {
                    valid: false,
                    error: createErrorProxy(errorPathObjectify(formatter(e.inner)))
                };
            }
        }
    };
}
export function superstructResolver(schema) {
    const formatter = (obj) => {
        return obj.reduce((acc, { message, path }) => {
            acc[path.join('.') || "root"] = message;
            return acc;
        }, {});
    };
    return {
        validate: (state) => {
            const [error] = validate(state, schema);
            if (!error) {
                return {
                    valid: true,
                    error: null,
                };
            }
            else {
                return {
                    valid: false,
                    error: createErrorProxy(errorPathObjectify(formatter(error.failures()))),
                };
            }
        }
    };
}
