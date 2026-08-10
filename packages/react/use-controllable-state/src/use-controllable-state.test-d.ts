import type { useControllableState } from './index';

type UseControllableStateParams = Parameters<typeof useControllableState<boolean>>[0];

type _UseControllableState = AssertOptionalPropsAcceptUndefined<UseControllableStateParams>;
