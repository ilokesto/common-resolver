type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? RecursivePartial<T[P]>
    : string;
};

type CRES<T> = RecursivePartial<T> & { "root"?: string };

export type Resolver<T> = {
  validate: (state: T, name?: string) => {
    valid: true;
    error: null;
    data: T;
  } | {
    valid: false;
    error: CRES<T>;
    data: null;
  };
}