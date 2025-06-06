import { bracketIndexToDot, createErrorProxy, errorPathObjectify } from "../utils";
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
                    data: state
                };
            }
            catch (e) {
                return {
                    valid: false,
                    error: createErrorProxy(errorPathObjectify(formatter(e.inner))),
                    data: null
                };
            }
        }
    };
}
