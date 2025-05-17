import { isZodSchema, isYupSchema, isSuperstructSchema } from "../type";
import { superstructResolver } from "./ssResolver";
import { yupResolver } from "./yupResolver";
import { zodResolver } from "./zodResolver";
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
