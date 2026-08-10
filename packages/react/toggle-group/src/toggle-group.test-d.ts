import type {
  ToggleGroupSingleProps,
  ToggleGroupMultipleProps,
  ToggleGroupItemProps,
} from './index';

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

type _ToggleGroup = AssertOptionalPropsAcceptUndefined<ToggleGroupProps>;
type _ToggleGroupSingle = AssertOptionalPropsAcceptUndefined<ToggleGroupSingleProps>;
type _ToggleGroupMultiple = AssertOptionalPropsAcceptUndefined<ToggleGroupMultipleProps>;
type _ToggleGroupItem = AssertOptionalPropsAcceptUndefined<ToggleGroupItemProps>;
