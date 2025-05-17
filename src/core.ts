import { z } from "zod";
import { isZodSchema, isYupSchema, isSuperstructSchema } from "./typeGuards"
import { RecursivePartial, Resolver, ValidateSchema } from "./types";

// 수정된 함수
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
  const formatZodErrorMessage = (obj: z.ZodFormattedError<T, string>) => {
    const result: Record<string, any> = {};
    const o = obj as Record<string, any>; // 타입 단언 추가

    // 최상단 _errors → root
    if (Array.isArray(o._errors)) {
      result.root = o._errors.length > 0 ? o._errors[0] : undefined;
    }

    for (const key in o) {
      if (key === "_errors" || key === "_error") continue;
      const sub = o[key];
      if (typeof sub === "object" && sub !== null) {
        if (
          Array.isArray(sub._errors) &&
          sub._errors.length > 0 &&
          Object.keys(sub).length === 1
        ) {
          result[key] = sub._errors[0];
        } else if (
          Array.isArray(sub._errors) &&
          sub._errors.length === 0 &&
          Object.keys(sub).length === 1
        ) {
          result[key] = undefined;
        } else {
          const nested = formatZodErrorMessage(sub);
          if (Object.keys(nested).length > 0) result[key] = nested;
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
      } else {
        const formatted = result.error.format();

        return {
          valid: false,
          error: name ? formatZodErrorMessage(formatted)[name] : formatZodErrorMessage(formatted),
        }
      }
    }
  }
}

// export function yupResolver<T>(schema: ValidateSchema<T>["yup"]): Resolver<T> {
//   const formatYupErrorMessage = (e: import("yup").ValidationError) => {
//     return (e as import("yup").ValidationError).inner.map((err) => ({[err.path || "root"]: err.message})).reduce((acc, cur) => {
//             const entry = Object.entries(cur)[0];
//             if (!entry) return acc;

//             const [key, value] = entry
//             // key가 'a.b.c'처럼 중첩된 경우 분리
//             const keys = key.split(".");
//             let temp = acc;
//             keys.forEach((k, i) => {
//               if (i === keys.length - 1) {
//                 temp[k] = value;
//               } else {
//                 if (!temp[k] || typeof temp[k] !== "object") temp[k] = {};
//                 temp = temp[k];
//               }
//             });

//             return acc;
//           }, {} as Record<string, any>) as RecursivePartial<T>
//   }

//   return {
//     validate: (state, name) => {
//       if (name) {
//         try {
//           schema.validateSyncAt(name, state, { abortEarly: false });
//           return {
//             valid: true,
//             error: null,
//           };
//         } catch (e: any) {
//           return {
  //             valid: false,
  //             error: e.errors[0],
//           };
//         }
//       } else {
//         try {
//           schema.validateSync(state, { abortEarly: false });
//           return {
//             valid: true,
//             error: null,
//           };
//         }
//         catch (e: any) {
//           return {
//             valid: false,
//             error: formatYupErrorMessage(e),
//           };
//         }
//       }
//     }
//   }
// }

export function yupResolver<T>(schema: ValidateSchema<T>["yup"]) {
  const formatter = (e: Array<{ errors: Array<string>, path: string }>) => {
    return e.reduce((acc, err) => {
      acc[err.path || "root"] = err.errors[0];
      return acc;
    }, {} as Record<string, any>);
  }

  return {
    validate: (state: T, ...name: Array<string | number>) => {
      if (name.length > 0) {
        const path = name.join(".");
        try {
          schema.validateSyncAt(path, state, { abortEarly: false });
          return {
            valid: true,
            error: null,
          };
        } catch (e: any) {
          return {
            valid: false,
            error: e.errors[0],
          };
        }
      } else {
        try {
          schema.validateSync(state, { abortEarly: false });
          return {
            valid: true,
            error: null,
          }
        } catch (e: any) {
          return {
            valid: false,
            error: formatter(e.inner)
          }
        }
      }
    }
  }
}




// superstruct 스키마 래퍼
export function superstructResolver<T>(schema: ValidateSchema<T>["superstruct"]): Resolver<T> {
  const { validate } = require("superstruct");

  function formatSuperstructError(error: any): Record<string, any> {
    const result: Record<string, any> = {};
    if (!error) return result;

    for (const failure of error.failures()) {
      const path = failure.path.length > 0 ? failure.path : ["root"];
      let temp = result;
      path.forEach((key: string, idx: number) => {
        if (idx === path.length - 1) {
          if (temp[key] === undefined) temp[key] = failure.message;
        } else {
          if (!temp[key] || typeof temp[key] !== "object") temp[key] = {};
          temp = temp[key];
        }
      });
    }
    return result;
  }

  return {
    validate: (state: T, name?: string) => {
      const [error] = validate(state, schema);
      if (!error) {
        return {
          valid: true,
          error: null,
        };
      }
      const formatted = formatSuperstructError(error);

      if (name) {
        // name이 'a.b.c' 형태일 수 있으므로 중첩 접근
        const keys = name.split(".");
        let temp: any = formatted;
        
        for (const key of keys) {
          if (temp && typeof temp === "object") temp = temp[key];
          else return {
            valid: false,
            error: {} as RecursivePartial<T>
          };
        }

        return {
          valid: false,
          error: temp as RecursivePartial<T>
        };
      }

      return {
        valid: false,
        error: formatted as RecursivePartial<T>,
      };
    }
  }
}