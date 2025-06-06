import { zodResolver } from "../resolver/zodResolver";
import { commonParser } from "./commonParser";
export function zodParser(data, schema, options) {
    return commonParser(data, schema, zodResolver, options);
}
