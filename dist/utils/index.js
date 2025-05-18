export function bracketIndexToDot(path) {
    let newPath = path.replace(/\[(\d+)\]/g, '.$1');
    newPath = newPath.replace(/\.{2,}/g, '.');
    if (newPath.startsWith('.'))
        newPath = newPath.slice(1);
    return newPath;
}
export function errorPathObjectify(errors) {
    const result = {};
    const sortedKeys = Object.keys(errors).sort((a, b) => b.split('.').length - a.split('.').length);
    for (const key of sortedKeys) {
        const value = errors[key];
        const path = key.split(".");
        let temp = result;
        path.forEach((segment, idx) => {
            if (idx === path.length - 1) {
                if (segment === "root") {
                    temp[segment] = value;
                }
                else {
                    if (temp[segment] && typeof temp[segment] === "object") {
                        temp[segment].root = value;
                    }
                    else {
                        temp[segment] = { root: value };
                    }
                }
            }
            else {
                if (!temp[segment] || typeof temp[segment] !== "object") {
                    temp[segment] = {};
                }
                temp = temp[segment];
            }
        });
    }
    return result;
}
export function createErrorProxy(obj, isRoot = true) {
    if (typeof obj !== "object" || obj === null)
        return obj;
    return new Proxy(obj, {
        get(target, prop, receiver) {
            if (isRoot && (prop === Symbol.toStringTag || prop === Symbol.iterator || prop === "constructor")) {
                return Reflect.get(target, prop, receiver);
            }
            if (prop === Symbol.iterator) {
                return undefined;
            }
            if (typeof prop === "string" && Object.prototype.hasOwnProperty.call(target, prop)) {
                const value = target[prop];
                if (typeof value === "object" && value !== null) {
                    if ("root" in value) {
                        return value.root;
                    }
                    return createErrorProxy(value, false);
                }
                return value;
            }
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            console.warn(`오류 객체의 "${String(prop)}" 속성은 수정할 수 없습니다.`);
            return false;
        },
        deleteProperty(target, prop) {
            console.warn(`오류 객체의 "${String(prop)}" 속성은 삭제할 수 없습니다.`);
            return false;
        },
        ownKeys(target) {
            return Reflect.ownKeys(target);
        },
        getOwnPropertyDescriptor(target, prop) {
            return Object.getOwnPropertyDescriptor(target, prop);
        }
    });
}
