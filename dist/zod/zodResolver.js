import { createErrorProxy, errorPathObjectify } from "../utils";
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
                    data: state
                };
            }
            else {
                return {
                    valid: false,
                    error: createErrorProxy(errorPathObjectify(formatter(result.error.issues))),
                    data: null
                };
            }
        }
    };
}
