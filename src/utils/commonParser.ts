export function commonParser<T>(data: T, schema: any, resolver: any, options?: { throwError: boolean }): T {
  const result = resolver(schema).validate(data);

  if (!result.valid) {
    if (options?.throwError) {
      throw result.error;
    } else {
      return data;
    }
  }

  return data;
}