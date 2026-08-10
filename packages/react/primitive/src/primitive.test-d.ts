import type * as React from 'react';
import type { PrimitivePropsWithRef } from './index';

type _PrimitiveA = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'a'>>;
type _PrimitiveButton = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'button'>>;
type _PrimitiveDiv = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'div'>>;
type _PrimitiveForm = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'form'>>;
type _PrimitiveH2 = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'h2'>>;
type _PrimitiveH3 = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'h3'>>;
type _PrimitiveImg = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'img'>>;
type _PrimitiveInput = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'input'>>;
type _PrimitiveLabel = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'label'>>;
type _PrimitiveLi = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'li'>>;
type _PrimitiveNav = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'nav'>>;
type _PrimitiveOl = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'ol'>>;
type _PrimitiveP = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'p'>>;
type _PrimitiveSelect = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'select'>>;
type _PrimitiveSpan = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'span'>>;
type _PrimitiveSvg = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'svg'>>;
type _PrimitiveUl = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<'ul'>>;

type CustomComponent = React.FC<{
  label?: string | undefined;
  onSelect?: (() => void) | undefined;
}>;
type _PrimitiveCustom = AssertOptionalPropsAcceptUndefined<PrimitivePropsWithRef<CustomComponent>>;
