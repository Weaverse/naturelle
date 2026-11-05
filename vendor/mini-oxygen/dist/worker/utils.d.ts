import { Request } from 'miniflare';

type OnlyServiceKeys<T> = Exclude<{
    [P in keyof T]: NonNullable<T[P]> extends {
        fetch: Function;
    } ? P : never;
}[keyof T], undefined>;
type OtherKeys<T> = Exclude<{
    [P in keyof T]: NonNullable<T[P]> extends Function | {
        eval: Function;
    } ? P : never;
}[keyof T], undefined>;
type OnlyServices<T> = Pick<{
    [key in keyof T]: string | ((request: Request) => Promise<any>);
}, OnlyServiceKeys<T>>;
type UnionUndefinedToNull<T> = T extends undefined ? null : T;
type OnlyBindings<T> = Omit<{
    [key in keyof T]: UnionUndefinedToNull<T[key]>;
}, OnlyServiceKeys<T> | OtherKeys<T>>;

export type { OnlyBindings, OnlyServices };
