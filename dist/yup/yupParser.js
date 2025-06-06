import { commonParser } from "../utils/commonParser";
import { yupResolver } from "./yupResolver";
export function yupParser(data, schema, options) {
    return commonParser(data, schema, yupResolver, options);
}
