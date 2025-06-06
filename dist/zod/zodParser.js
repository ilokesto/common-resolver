import { commonParser } from "../utils/commonParser";
import { zodResolver } from "./zodResolver";
export function zodParser(data, schema, options) {
    return commonParser(data, schema, zodResolver, options);
}
