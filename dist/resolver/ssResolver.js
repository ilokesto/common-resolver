import { createErrorProxy, errorPathObjectify } from "../utils";
export function superstructResolver(schema) {
    const { validate } = require("superstruct");
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
