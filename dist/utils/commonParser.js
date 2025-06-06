export function commonParser(data, schema, resolver, options) {
    const result = resolver(schema).validate(data);
    if (!result.valid) {
        if (options?.throwError) {
            throw result.error;
        }
        else {
            return data;
        }
    }
    return data;
}
