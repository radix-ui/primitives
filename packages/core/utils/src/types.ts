export enum PrimitivePartTypes {
  /**
   * The top-level root of a primitive component's tree.
   */
  Root = 'ROOT',
  /**
   * A part that keeps track of an indexed collection of sub-part.
   */
  IndexedCollection = 'INDEXED_COLLECTION',
  /**
   * A sub-part of an indexed collection part.
   */
  IndexedDescendant = 'INDEXED_DESCENDANT',
  /**
   * A part only responsible for cloning a component passed by a consumer, typically designed to
   * pass along data.
   */
  Cloner = 'CLONER',
}

export interface PartDefinition<Props> {
  type?: PrimitivePartTypes;
  displayName: string;
  defaultTagName: keyof ElementTagNameMap | null;
  defaultProps?: Partial<Props>;
  attrs?: {
    [key: string]: any;
  };
  events?: {
    [key: string]: any;
  };
}

/**
 * Type can be either a single `ValueType` or an array of `ValueType`
 */
export type SingleOrArray<ValueType> = ValueType[] | ValueType;

/**
 * The built-in utility type `Omit` does not distribute over unions. So if you
 * have:
 *
 *    type A = { a: 'whatever' }
 *
 * and you want to do a union with:
 *
 *    type B = A & { b: number } | { b: string; c: number }
 *
 * you might expect `Omit<B, 'a'>` to give you:
 *
 *    type B = | Omit<{ a: "whatever"; b: number }, "a"> | Omit<{ a: "whatever";
 *      b: string; c: number }, "a">;
 *
 * This is not the case, unfortunately, so we need to create our own version of
 * `Omit` that distributes over unions with a distributive conditional type. If
 * you have a generic type parameter `T`, then the construct `T extends any ?
 * F<T> : never` will end up distributing the `F<>` operation over `T` when `T`
 * is a union type.
 *
 * @link https://stackoverflow.com/a/59796484/1792019
 * @link http://www.typescriptlang.org/docs/handbook/advanced-types.html#distributive-conditional-types
 */
export type DistributiveOmit<BaseType, Key extends PropertyKey> = BaseType extends any
  ? Omit<BaseType, Key>
  : never;

/**
 * Returns the type inferred by a promise's return value.
 *
 * @example
 * async function getThing() {
 *   // return type is a number
 *   let result: number = await fetchValueSomewhere();
 *   return result;
 * }
 *
 * type Thing = ThenArg<ReturnType<typeof getThing>>; // number
 */
export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * This type is included in the DOM lib but is deprecated. It's still quite useful, so we want to
 * include it here and reference it when possible to avoid any issues when updating TS.
 */
export type ElementTagNameMap = HTMLElementTagNameMap &
  Pick<SVGElementTagNameMap, Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>>;
