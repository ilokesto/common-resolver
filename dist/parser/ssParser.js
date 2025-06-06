import { superstructResolver } from "../resolver/ssResolver";
import { commonParser } from "./commonParser";
export function superstructParser(data, schema, options) {
    return commonParser(data, schema, superstructResolver, options);
}
