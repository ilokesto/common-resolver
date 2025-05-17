import { isZodSchema, isYupSchema, isSuperstructSchema } from "./typeGuards";
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
    const formatZodErrorMessage = (obj) => {
        const result = {};
        const o = obj;
        if (Array.isArray(o._errors)) {
            result.root = o._errors.length > 0 ? o._errors[0] : undefined;
        }
        for (const key in o) {
            if (key === "_errors" || key === "_error")
                continue;
            const sub = o[key];
            if (typeof sub === "object" && sub !== null) {
                if (Array.isArray(sub._errors) &&
                    sub._errors.length > 0 &&
                    Object.keys(sub).length === 1) {
                    result[key] = sub._errors[0];
                }
                else if (Array.isArray(sub._errors) &&
                    sub._errors.length === 0 &&
                    Object.keys(sub).length === 1) {
                    result[key] = undefined;
                }
                else {
                    const nested = formatZodErrorMessage(sub);
                    if (Object.keys(nested).length > 0)
                        result[key] = nested;
                }
            }
        }
        return result;
    };
    return {
        validate: (state, name) => {
            const result = schema.safeParse(state);
            if (result.success) {
                return {
                    valid: true,
                    error: null,
                };
            }
            else {
                const formatted = result.error.format();
                return {
                    valid: false,
                    error: name ? formatZodErrorMessage(formatted)[name] : formatZodErrorMessage(formatted),
                };
            }
        }
    };
}
export function yupResolver(schema) {
    const formatYupErrorMessage = (e) => {
        return e.inner.map((err) => ({ [err.path || "root"]: err.message })).reduce((acc, cur) => {
            const entry = Object.entries(cur)[0];
            if (!entry)
                return acc;
            const [key, value] = entry;
            const keys = key.split(".");
            let temp = acc;
            keys.forEach((k, i) => {
                if (i === keys.length - 1) {
                    temp[k] = value;
                }
                else {
                    if (!temp[k] || typeof temp[k] !== "object")
                        temp[k] = {};
                    temp = temp[k];
                }
            });
            return acc;
        }, {});
    };
    return {
        validate: (state, name) => {
            if (name) {
                try {
                    schema.validateSyncAt(name, state, { abortEarly: false });
                    return {
                        valid: true,
                        error: null,
                    };
                }
                catch (e) {
                    return {
                        valid: false,
                        error: e.errors[0],
                    };
                }
            }
            else {
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
                        error: formatYupErrorMessage(e),
                    };
                }
            }
        }
    };
}
export function superstructResolver(schema) {
    const { validate } = require("superstruct");
    function formatSuperstructError(error) {
        const result = {};
        if (!error)
            return result;
        for (const failure of error.failures()) {
            const path = failure.path.length > 0 ? failure.path : ["root"];
            let temp = result;
            path.forEach((key, idx) => {
                if (idx === path.length - 1) {
                    if (temp[key] === undefined)
                        temp[key] = failure.message;
                }
                else {
                    if (!temp[key] || typeof temp[key] !== "object")
                        temp[key] = {};
                    temp = temp[key];
                }
            });
        }
        return result;
    }
    return {
        validate: (state, name) => {
            const [error] = validate(state, schema);
            if (!error) {
                return {
                    valid: true,
                    error: null,
                };
            }
            const formatted = formatSuperstructError(error);
            if (name) {
                const keys = name.split(".");
                let temp = formatted;
                for (const key of keys) {
                    if (temp && typeof temp === "object")
                        temp = temp[key];
                    else
                        return {
                            valid: false,
                            error: {}
                        };
                }
                return {
                    valid: false,
                    error: temp
                };
            }
            return {
                valid: false,
                error: formatted,
            };
        }
    };
}
