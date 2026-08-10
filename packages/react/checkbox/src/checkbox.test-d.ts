import type {
  CheckboxProps,
  unstable_CheckboxProviderProps,
  unstable_CheckboxTriggerProps,
  CheckboxIndicatorProps,
  unstable_CheckboxBubbleInputProps,
  CheckedState,
} from './index';

type _Checkbox = AssertOptionalPropsAcceptUndefined<CheckboxProps>;
type _CheckboxProvider = AssertOptionalPropsAcceptUndefined<
  unstable_CheckboxProviderProps<CheckedState>
>;
type _CheckboxTrigger = AssertOptionalPropsAcceptUndefined<unstable_CheckboxTriggerProps>;
type _CheckboxIndicator = AssertOptionalPropsAcceptUndefined<CheckboxIndicatorProps>;
type _CheckboxBubbleInput = AssertOptionalPropsAcceptUndefined<unstable_CheckboxBubbleInputProps>;
