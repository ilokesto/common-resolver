import { Resolver } from "../types";

export function commonParser<T, K>(data: T, schema: K, resolver: (schema: K) => Resolver<T>, options?: { throwError: boolean }): T {
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