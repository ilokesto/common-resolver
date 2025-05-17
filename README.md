# common-resolver

common-resolver는 다양한 스키마 유효성 검증 라이브러리를 **일관된 인터페이스로 통합**하는 유틸리티 라이브러리입니다. Zod, Yup, Superstruct 등 인기 있는 유효성 검증 라이브러리를 위한 통합 리졸버를 제공합니다.

* 🔄 여러 유효성 검증 라이브러리를 위한 표준화된 인터페이스
* 🧩 라이브러리 간 쉬운 전환 가능
* 🛡️ 타입스크립트로 완전한 타입 안전성 제공
* 🪶 의존성 없이 가벼운 설계 (해당 라이브러리는 peer dependency로만 필요)
* 🔍 자동으로 스키마 타입 감지 및 적절한 리졸버 적용

# 설치 

```bash
npm i common-resolver@latest
pnpm add common-resolver@latest
yarn add common-resolver@latest
bun add common-resolver@latest
```

# resolver
common-resolver가 제공하는 resolver는 각 스키마 유효성 검증 라이브러리를 인자로 받아 Resolver 객체를 리턴합니다.

```ts
declare function zodResolver<T>(schema: ValidateSchema<T>["zod"]): Resolver<T>
declare function yupResolver<T>(schema: ValidateSchema<T>["yup"]): Resolver<T>
declare function superstructResolver<T>(schema: ValidateSchema<T>["superstruct"]): Resolver<T>
```
Resolver 객체에는 validate 메서드가 존재하며, 이 메서드를 호출하면 검증 결과에 따라 두 가지 상태 중 하나를 반환합니다. 검증이 성공하면 valid는 true, error는 null이 되며, 검증이 실패하면 valid는 false가 되고 error 객체에는 오류가 발생한 필드와 관련 정보가 제공됩니다. 이 error 객체는 원본 데이터 구조를 따라 중첩된 형태로 표현되어 특정 필드의 오류를 쉽게 찾을 수 있습니다. 이러한 일관된 인터페이스 덕분에 어떤 유효성 검증 라이브러리를 사용하더라도 동일한 방식으로 오류를 처리할 수 있어, 폼 검증이나 데이터 유효성 검사에 매우 효과적입니다.

```ts
export type Resolver<T> = {
  validate: (state: T, name?: string) => {
    valid: true;
    error: null;
  } | {
    valid: false;
    error: RecursivePartial<T> & { "root"?: string };
  };
}
```

error 객체는 `RecursivePartial<T> & { "root"?: string }` 타입을 갖습니다. 이는 원본 데이터 구조를 그대로 반영하되 모든 속성이 선택적이고, 각 속성은 문자열 형태의 오류 메시지를 담고 있습니다. 중첩된 객체의 경우에도 같은 구조를 재귀적으로 유지하므로, 복잡한 데이터 구조에서도 정확하게 어떤 필드에서 오류가 발생했는지 쉽게 파악할 수 있습니다.

```ts
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? RecursivePartial<T[P]>
    : string;
};
```

다음은 Zod 스키마를 사용하는 간단한 예제입니다. 여기서는 문자열 타입의 스키마를 정의하고 최소 길이가 1 이상이어야 한다는 제약을 설정했습니다. 빈 문자열("")을 validate 메서드에 전달하면 길이 조건을 충족하지 못해 유효성 검사에 실패합니다. 이때 반환되는 error 객체에는 "root" 속성에 오류 메시지("zSchema는 필수입니다")가 포함됩니다. 이 예제는 단일 값에 대한 검증이므로 특정 필드 대신 "root" 속성에 오류가 기록됩니다. 복잡한 객체 구조에서는 각 필드별로 오류 메시지가 해당 필드의 경로에 매핑되어 표시됩니다.

```ts
const zSchema = z.string({ message: "string이어야 합니다" }).min(1, "zSchema는 필수입니다");

zodResolver(zSchema).validate("").error // {root: "zSchema는 필수입니다"}
```

# 사용 예시

common-resolver는 아래와 같은 기능을 제공합니다. 각 스키마 유효성 검증 라이브러리에 대한 resolver와 함께, 스키마를 검증하는 타입 가드 함수를 제공합니다. getResolver 함수는 입력된 스키마의 타입을 자동으로 감지하여 적절한 resolver를 선택하므로, 코드를 전환할 때 최소한의 변경만으로 다른 유효성 검증 라이브러리로 쉽게 마이그레이션할 수 있습니다. 또한 ValidateSchema와 Resolver와 같은 타입 정의를 통해 타입스크립트 환경에서 완벽한 타입 안전성을 제공하므로, 코드 작성 시 자동 완성 및 타입 오류 감지의 이점을 누릴 수 있습니다. 이러한 기능들을 통해 개발자는 복잡한 스키마 검증 로직에 집중하지 않고 비즈니스 로직 구현에 더 집중할 수 있습니다.

```ts
import { zodResolver, isZodSchema } from "common-resolver/zod"
import { yupResolver, isYupSchema } from "common-resolver/yup"
import { superstructResolver, isSuperStructSchema } from "common-resolver/superstruct"
import { getResolver } from "common-resolver/getResolver"
import { ValidateSchema, Resolver } "common-resolver/types"
```

## 전역 상태 관리 라이브러리 Caro-Kann 에서의 common-resolver

아래의 코드는 Caro-Kann 상태 관리 라이브러리에서 유효성 검증을 위한 미들웨어를 구현한 것입니다. validate 함수는 초기 상태와 스키마 유효성 검사기를 인자로 받아 상태가 변경될 때마다 자동으로 검증을 수행합니다. getResolver 함수를 사용하여 스키마 유형에 관계없이 동일한 인터페이스로 검증을 처리하고, 상태 변경이 유효하지 않을 경우 오류를 기록하고 상태 업데이트를 차단합니다. 이 방식으로 애플리케이션의 상태가 항상 스키마를 준수하도록 보장합니다.

```ts
import { getResolver } from "common-resolver/getResolver";
import { ValidateSchema } from "common-resolver/types";

export const validate: Middleware["validate"] = <T>(initState: T | MiddlewareStore<T>, validator: ValidateSchema<T>["zod" | "yup" | "superstruct"]) => {
  const Store = getStoreFromInitState(initState);
  const validateScheme = getResolver(validator);

  const setStore = (nextState: T | ((prev: T) => T)) => {
    const newState = typeof nextState === "function" ? (nextState as (prev: T) => T)(Store.getStore()) : nextState;

    const { valid, error } = validateScheme.validate(newState);

    if (!valid) {
      console.error(`[Validation Error] Invalid state:`, error);
      return;
    }

    Store.setStore(newState);
  };

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: "validate"
  };
};
```

어떤 라이브러리를 사용하였는지와 상관 없이 스키마를 validate의 두 번째 아규먼트로 제공하게 되면 Caro-Kann이 common-resolver의 도움을 통해 적절한 resolver를 자동으로 감지하고 선택합니다. 이는 getResolver 함수가 내부적으로 주어진 스키마의 타입(Zod, Yup, Superstruct 등)을 분석하여 그에 맞는 리졸버를 반환하기 때문입니다. 덕분에 Caro-Kann을 사용하는 개발자들은 별도의 코드 수정 없이 스키마 객체만 교체할 수 있습니다. 이러한 유연성은 프로젝트 요구사항이 변경되거나 다양한 검증 라이브러리를 실험해보고 싶을 때 특히 유용합니다.

```tsx
import { create } from "caro-kann"
import { z } from "zod";

const zSchema = z.string({ message: "string이어야 합니다" });

const useNumber = create(validate("", zSchema))
```

## form 관리 라이브러리 Sicilian에서의 common-resolver

폼 관리 라이브러리 Sicilian의 핵심 유효성 검증 로직인 Validate 클래스는 상태 저장소, 오류 설정 함수, 그리고 common-resolver의 Resolver 객체를 받습니다. doValidate 메서드는 사용자 입력 이벤트에 반응하여 현재 폼 상태에 대한 유효성 검사를 실행하고, 오류가 발생하면 해당 필드에 대한 오류 메시지를 설정합니다. 이 구조는 각 입력 필드별로 즉각적인 피드백을 제공하면서도 전체 폼의 일관성을 유지합니다.

```ts
import type { Resolver } from "common-resolver/types";

export class Validate<T extends InitState> implements IValidate {
  constructor(
    private store: IStore<T>,
    private setError: (action: Partial<T>) => void,
    private resolver: Resolver<T> | undefined
  ) {}

  public doValidate = ({ target: { name } }: SicilianEvent) => {
    const store = this.store.getStore();

    if (this.resolver) {
      const { valid, error } = this.resolver.validate(store);

      if (!valid) {
        this.setError({ [name]: typeof error[name] === "string" ? error[name] : "" })
        return;
      }
    }
  }
}
```

Sicilian은 common-resolver의 기능을 자체 API로 재노출합니다. 이렇게 함으로써 사용자는 common-resolver 패키지에 대한 직접적인 의존성 없이 사용자 경험을 단순화하고 일관성을 유지합니다.

```ts
// sicilian/resolver
export { zodResolver } from "common-resolver/zod";
export { yupResolver } from "common-resolver/yup";
export { superstructResolver } from "common-resolver/superstruct";
```

아래 예시는 복잡한 회원가입 폼에 대한 유효성 검사를 Zod 스키마를 사용하여 구현한 것입니다. 이메일, 닉네임, 비밀번호, 비밀번호 확인, 이용약관 동의 등 다양한 필드에 대한 상세한 검증 규칙을 정의하고 있습니다. 특히 refine 메서드를 사용하여 비밀번호와 비밀번호 확인 필드의 일치 여부와 같은 필드 간 의존성 검증도 수행합니다. 이 스키마는 zodResolver를 통해 sicilian 폼 컨트롤러에 전달되어, 선언적으로 정의된 모든 규칙에 따라 사용자 입력의 유효성을 자동으로 검증합니다.

```tsx
import { CreateForm } from "sicilian"
import { zodResolver } from "sicilian/resolver"
import { z } from "zod";

const zSchema = z.object({
  email: z.string()
    .email('유효한 이메일 주소를 입력해 주세요')
    .min(1, '이메일은 필수 입력 항목입니다'),
  
  nickname: z.string()
    .min(2, '닉네임은 2글자 이상이어야 합니다')
    .max(20, '닉네임은 20글자 이하여야 합니다'),
  
  password: z.string()
    .max(100, '비밀번호는 100자 이하여야 합니다')
    .regex(/[a-z]/, '최소 하나의 소문자를 포함해야 합니다')
    .regex(/[0-9]/, '최소 하나의 숫자를 포함해야 합니다')
    .regex(/[^a-zA-Z0-9]/, '최소 하나의 특수문자를 포함해야 합니다')
    .min(8, '비밀번호는 8자 이상이어야 합니다'),
  
  passwordCheck: z.string()
    .min(1, '비밀번호 확인은 필수 입력 항목입니다'),
  
  agreeToTerms: z.boolean()
    .refine(val => val === true, {
      message: '이용약관에 동의해 주세요'
    })
}).refine(data => {
  return data.password === data.passwordCheck
}, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordCheck']
});

const signFormController = new CreateForm({
  initState: {
    email: "",
    nickname: "",
    password: "",
    passwordCheck: "",
    agreeToTerms: false,
  },
  resolver: zodResolver(zSchema)
})
```