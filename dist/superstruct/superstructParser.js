import { commonParser } from "../utils/commonParser";
import { superstructResolver } from "./superstructResolver";
export function superstructParser(data, schema, options) {
    return commonParser(data, schema, superstructResolver, options);
}
