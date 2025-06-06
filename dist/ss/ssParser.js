import { commonParser } from "../utils/commonParser";
import { superstructResolver } from "./ssResolver";
export function superstructParser(data, schema, options) {
    return commonParser(data, schema, superstructResolver, options);
}
