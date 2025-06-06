import { yupResolver } from "../resolver/yupResolver";
import { commonParser } from "./commonParser";
export function yupParser(data, schema, options) {
    return commonParser(data, schema, yupResolver, options);
}
