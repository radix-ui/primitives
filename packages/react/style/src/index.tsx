import React, { forwardRef } from 'react';
import * as CSS from 'csstype';
import hoist from 'hoist-non-react-statics';
import { css } from '@interop-ui/css';
import merge from 'lodash.merge';
import { ResponsiveContext, _matchValuesAgainstBreakPoints } from './InteropProvider';
import { themeValuesMiddleware } from './themeValuesMiddleware';

let currentCount = 0;

const requestElmId = () => {
  const elmId = `intrp_${currentCount}`;
  currentCount = currentCount + 1;
  return elmId;
};

/** utils: */
export const compose = function <T extends BaseInterop<JSXTags>>(
  part: T,
  variants: ExtractVariants<T>
) {
  // we dont want to expose _compose externally so we're casting
  // it when working with library internals
  const internallyTyped = (part as any) as T & {
    _compose: (variants: ExtractVariants<T>) => CSSDeclaration;
  };

  return internallyTyped._compose(variants);
};

type IVariantsAndValue = {
  [p: string]: string | undefined;
};

const cachedClasskey = Symbol('variant cached class property key');
type InternalVariants = {
  [p: string]: {
    [p: string]: CSSDeclaration & { [cachedClasskey]?: string };
  };
};

const useResolvePropsIntoVariantClasses = (
  props: any,
  internalVariants: InternalVariants,
  scope: string
) => {
  const variantKeys = Object.keys(internalVariants);
  const breakPointMatches = React.useContext(ResponsiveContext);
  const classes = [];
  // iterate over variant keys. ie: color, size, variant
  for (let i = 0; i < variantKeys.length; i++) {
    const variantKey = variantKeys[i];
    // match the variant key in the props
    if (props[variantKey]) {
      const variantValueInProps: string | string[] = props[variantKey];
      // match the value in props to media queries
      const resolvedResponsiveVariantsIntoOne = _matchValuesAgainstBreakPoints(
        variantValueInProps,
        breakPointMatches
      );

      // match in internal variants?
      const variantStyles = internalVariants[variantKey][resolvedResponsiveVariantsIntoOne];

      // does the resolved variant have a match inside our internal variants?
      if (variantStyles) {
        // did we parse this variant before?
        if (variantStyles[cachedClasskey]) {
          classes.push(variantStyles[cachedClasskey]);
        } else {
          // we've never seen this variant before
          const variantClass = css(variantStyles, scope, [themeValuesMiddleware]);
          classes.push(variantClass);
          variantStyles[cachedClasskey] = variantClass;
        }
        // empty the variant in the prop
        delete props[variantKey];
      }
    }
  }

  return classes.join(' ');
};

/** Main export */
export const styled = function <
  VariantsAndValues extends IVariantsAndValue,
  // TODO: find a way to make this optional without breaking things
  C extends JSXTags
>(tag: C) {
  const _styles = {};
  const _variants: InternalVariants = {};
  const elmId = requestElmId();
  let _styledClass: string | undefined = undefined;

  function InteropElm(
    props: React.ComponentPropsWithRef<C> & VariantsAndValues & { as?: never; className?: string },
    ref: any
  ): any;

  function InteropElm<AS extends keyof JSX.IntrinsicElements = C>(
    props: React.ComponentPropsWithRef<C> & VariantsAndValues & { as?: AS; className?: string },
    // TODO: type me
    ref: any
  ) {
    let styledClass = _styledClass;
    if (!styledClass) {
      styledClass = css(_styles);
      _styledClass = styledClass;
    }

    const mutableProps = { ...props };
    const variantClasses = useResolvePropsIntoVariantClasses(
      mutableProps,
      _variants,
      '.' + styledClass
    );

    return React.createElement(props.as || tag, {
      ...mutableProps,
      className: [props.className, elmId, styledClass, variantClasses].join(' ').trim(),
    });
  }

  /**
   * Style static method:
   */
  InteropElm.style = (styles: CSSDeclaration) => {
    merge(_styles, styles);
    return InteropElm;
  };

  /**
   * Variant static method:
   */
  InteropElm.variant = (name: string, styles: { [p: string]: CSSDeclaration }) => {
    _variants[name] = _variants[name] || {};
    const keys = Object.keys(styles);
    for (let index = 0; index < keys.length; index++) {
      const currentKey = keys[index];
      _variants[name][currentKey] = _variants[name][currentKey] || {};
      merge(_variants[name][currentKey], styles[currentKey]);
    }

    return InteropElm;
  };

  // id for referencing
  InteropElm.toString = () => '.' + elmId;

  // internal function used to handle composing this element's
  // styles into others
  // this is not typed externally on purpose as it's intended to be
  // used by the library internally
  InteropElm._compose = (variants: VariantsAndValues) => {
    const composedStyles = Object.assign({}, _styles);
    const variantKeys = Object.keys(variants);
    for (let i = 0; i < variantKeys.length; i++) {
      const variantKey = variantKeys[i];
      const variantValue = variants[variantKey];
      if (variantValue && _variants[variantKey] && _variants[variantKey][variantValue]) {
        merge(composedStyles, _variants[variantKey][variantValue]);
      }
    }
    return composedStyles;
  };

  // forcing the type because we're hoisting below
  const forwardedRef = (forwardRef(InteropElm) as any) as BaseInterop<C, VariantsAndValues>;

  // hoist our static properties to the top
  // we need to do this because we're forwarding refs above ^
  hoist(forwardedRef, InteropElm);

  return forwardedRef;
};

/**
 * types:
 */
type ExtractVariants<InteropElm> = InteropElm extends BaseInterop<infer A, infer B> ? B : {};

interface NestedCSSDeclarations {
  [name: string]: CSSDeclaration;
}

type CSSDeclaration = { [P in keyof CSS.Properties]?: CSS.Properties[P] } | NestedCSSDeclarations;

type JSXTags = keyof JSX.IntrinsicElements;

type ResponsiveVariants<VariantsAndValues extends IVariantsAndValue = {}> = {
  [p in keyof VariantsAndValues]: VariantsAndValues[p] | Exclude<VariantsAndValues[p], undefined>[];
};

interface BaseInterop<C extends JSXTags, VariantsAndValues extends IVariantsAndValue = {}> {
  (
    props: React.ComponentPropsWithRef<C> &
      ResponsiveVariants<VariantsAndValues> & {
        as?: never;
        className?: string;
      },
    ref: any
  ): any;
  <AS extends keyof JSX.IntrinsicElements = C>(
    props: React.ComponentPropsWithRef<AS> &
      ResponsiveVariants<VariantsAndValues> & { as?: AS; className?: string },
    ref: any
  ): any;
  styledClass: string;
  style: (styles: CSSDeclaration) => BaseInterop<C, VariantsAndValues>;
  variant: <V extends keyof VariantsAndValues>(
    name: V,
    styles: { [P in Exclude<VariantsAndValues[V], undefined>]: CSSDeclaration }
  ) => BaseInterop<C, VariantsAndValues>;
}

export default styled;
