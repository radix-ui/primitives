import type * as React from 'react';
import type { SlotProps } from './index';

type _SlotDefault = AssertOptionalPropsAcceptUndefined<SlotProps>;
type _SlotDiv = AssertOptionalPropsAcceptUndefined<
  SlotProps<HTMLDivElement, React.ComponentPropsWithRef<'div'>>
>;
type _SlotButton = AssertOptionalPropsAcceptUndefined<
  SlotProps<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
>;
type _SlotAnchor = AssertOptionalPropsAcceptUndefined<
  SlotProps<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>
>;
type _SlotInput = AssertOptionalPropsAcceptUndefined<
  SlotProps<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
>;
type _SlotSvg = AssertOptionalPropsAcceptUndefined<
  SlotProps<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>
>;
type _SlotCustomProps = AssertOptionalPropsAcceptUndefined<
  SlotProps<HTMLElement, { asChild?: boolean | undefined }>
>;
