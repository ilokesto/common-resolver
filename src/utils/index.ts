export function bracketIndexToDot(path: string): string {
  let newPath = path.replace(/\[(\d+)\]/g, '.$1');
  newPath = newPath.replace(/\.{2,}/g, '.');
  if (newPath.startsWith('.')) newPath = newPath.slice(1);
  return newPath;
}
export function errorPathObjectify(errors: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  
  // 키를 길이에 따라 정렬 (긴 것부터 처리)
  const sortedKeys = Object.keys(errors).sort((a, b) => b.split('.').length - a.split('.').length);

  for (const key of sortedKeys) {
    const value = errors[key];
    const path = key.split(".");
    let temp = result;

    path.forEach((segment, idx) => {
      if (idx === path.length - 1) {
        // segment가 "root"면 바로 메시지 할당, 아니면 { root: 메시지 }
        if (segment === "root") {
          temp[segment] = value;
        } else {
          // 이미 객체가 있고 중첩 구조라면 root 속성만 추가
          if (temp[segment] && typeof temp[segment] === "object") {
            temp[segment].root = value;
          } else {
            temp[segment] = { root: value };
          }
        }
      } else {
        if (!temp[segment] || typeof temp[segment] !== "object") {
          temp[segment] = {};
        }
        temp = temp[segment];
      }
    });
  }

  return result;
}

export function createErrorProxy(obj: any, isRoot = true): any {
  if (typeof obj !== "object" || obj === null) return obj;

  return new Proxy(obj, {
    get(target, prop, receiver) {
      // 전체 객체 자체에 접근할 때는 Proxy를 반환
      if (isRoot && (prop === Symbol.toStringTag || prop === Symbol.iterator || prop === "constructor")) {
        return Reflect.get(target, prop, receiver);
      }
      // 구조분해할당 등 Object.keys/Object.entries 지원
      if (prop === Symbol.iterator) {
        return undefined;
      }
      if (typeof prop === "string" && Object.prototype.hasOwnProperty.call(target, prop)) {
        const value = target[prop];
        if (typeof value === "object" && value !== null) {
          // root가 있으면 root 값 반환, 아니면 재귀 Proxy
          if ("root" in value) {
            return value.root;
          }
          return createErrorProxy(value, false);
        }
        return value;
      }
      // 기본 동작
      return Reflect.get(target, prop, receiver);
    },
    // set 트랩 추가 - 모든 수정 요청 거부
    set(target, prop, value, receiver) {
      console.warn(`오류 객체의 "${String(prop)}" 속성은 수정할 수 없습니다.`);
      return false; // false 반환하면 strict mode에서 TypeError 발생
    },
    // delete 연산자도 차단 (선택적)
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