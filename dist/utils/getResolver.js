import { isSuperstructSchema } from "../superstruct/isSuperstructSchema";
import { superstructResolver } from "../superstruct/superstructResolver";
import { isYupSchema } from "../yup/isYupSchema";
import { yupResolver } from "../yup/yupResolver";
import { isZodSchema } from "../zod/isZodSchema";
import { zodResolver } from "../zod/zodResolver";
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
