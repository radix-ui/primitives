import * as React from 'react';
import { arrayInsert, clamp } from '@interop-ui/utils';
import { composeEventHandlers } from './composeEventHandlers';
import { createContext } from './createContext';

type TabStop = {
  id: string;
  ref: React.RefObject<HTMLElement>;
};

type UseRovingTabIndexOptions<T> = {
  id: string;
  isSelected: boolean;
  elementRef: React.RefObject<T>;
  onFocus?: React.FocusEventHandler<T>;
  onKeyDown?: React.KeyboardEventHandler<T>;
};

function useRovingTabIndex<T extends HTMLElement>({
  id,
  isSelected,
  elementRef,
  onFocus: originalOnFocus,
  onKeyDown: originalOnKeyDown,
}: UseRovingTabIndexOptions<T>) {
  const { orientation, currentTabStopId } = useStateContext('useRovingTabIndex');
  const dispatch = useDispatchContext('useRovingTabIndex');

  const shouldBeFocused = currentTabStopId === id;
  const isTabbable = isSelected;

  /**
   * Handle registration/unregistration of tab stops
   */
  React.useEffect(() => {
    dispatch({ type: 'register', tabStop: { id, ref: elementRef } });
    return () => {
      dispatch({ type: 'unregister', id });
    };
  }, [dispatch, elementRef, id]);

  /**
   * Handle focusing the tab stop's element
   */
  React.useEffect(() => {
    if (shouldBeFocused) {
      elementRef.current?.focus();
    }
  }, [elementRef, shouldBeFocused]);

  const getDirection = React.useCallback(
    (event: React.KeyboardEvent<T>) => {
      const isHorizontal = orientation !== 'vertical';
      if (isHorizontal) {
        if (event.key === 'ArrowRight') return 'next';
        if (event.key === 'ArrowLeft') return 'previous';
      } else {
        if (event.key === 'ArrowDown') return 'next';
        if (event.key === 'ArrowUp') return 'previous';
      }
      return null;
    },
    [orientation]
  );

  const handleFocus = React.useCallback(
    (event: React.FocusEvent<T>) => dispatch({ type: 'moveFocus', id }),
    [dispatch, id]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<T>) => {
      const direction = getDirection(event);

      if (direction === 'next') {
        event.preventDefault();
        dispatch({ type: 'moveFocusToNext' });
      } else if (direction === 'previous') {
        event.preventDefault();
        dispatch({ type: 'moveFocusToPrevious' });
      } else if (event.key === 'Home') {
        event.preventDefault();
        dispatch({ type: 'moveFocusToFirst' });
      } else if (event.key === 'End') {
        event.preventDefault();
        dispatch({ type: 'moveFocusToLast' });
      }
    },
    [dispatch, getDirection]
  );

  return {
    onFocus: composeEventHandlers(originalOnFocus, handleFocus, {
      checkForDefaultPrevented: false,
    }),
    onKeyDown: composeEventHandlers(originalOnKeyDown, handleKeyDown),
    tabIndex: isTabbable ? 0 : -1,
  };
}

type RovingTabIndexProviderProps = {
  children: React.ReactNode;
  orientation: React.AriaAttributes['aria-orientation'];
  shouldLoop?: boolean;
};

function RovingTabIndexProvider({
  children,
  orientation,
  shouldLoop = true,
}: RovingTabIndexProviderProps) {
  const [state, dispatch] = React.useReducer(reducer, {
    orientation,
    shouldLoop,
    tabStops: [],
    currentTabStopId: null,
  });

  // Sync `orientation` changes
  React.useEffect(() => {
    dispatch({ type: 'updateOrientation', orientation });
  }, [orientation, dispatch]);

  // Sync `shouldLoop` changes
  React.useEffect(() => {
    dispatch({ type: 'updateShouldLoop', shouldLoop });
  }, [shouldLoop, dispatch]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

type State = {
  orientation: React.AriaAttributes['aria-orientation'];
  shouldLoop: boolean;
  tabStops: TabStop[];
  currentTabStopId: TabStop['id'] | null;
};

type Action =
  | { type: 'register'; tabStop: TabStop }
  | { type: 'unregister'; id: TabStop['id'] }
  | { type: 'moveFocus'; id: TabStop['id'] | null }
  | { type: 'moveFocusToNext' }
  | { type: 'moveFocusToPrevious' }
  | { type: 'moveFocusToFirst' }
  | { type: 'moveFocusToLast' }
  | { type: 'updateOrientation'; orientation: State['orientation'] }
  | { type: 'updateShouldLoop'; shouldLoop: State['shouldLoop'] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'register': {
      const newTabStop = action.tabStop;
      if (state.tabStops.length === 0) {
        return { ...state, tabStops: [newTabStop] };
      }

      const isAlreadyRegistered = state.tabStops
        .map((tabStop) => tabStop.id)
        .includes(newTabStop.id);

      if (isAlreadyRegistered) {
        console.warn(`${newTabStop.id} tab stop is already registered`);
        return state;
      }

      let indexToInsertAt = state.tabStops.findIndex((tabStop) => {
        if (!tabStop.ref.current || !newTabStop.ref.current) return false;
        // Return true if the new tab stop's element is located earlier in the DOM
        // than each tab stop's element, else false:
        return Boolean(
          // See: https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
          tabStop.ref.current.compareDocumentPosition(newTabStop.ref.current) &
            Node.DOCUMENT_POSITION_PRECEDING
        );
      });

      // findIndex returns -1 when `newTabStop` should be inserted at the end of tabStops
      // (the compareDocumentPosition test always returns false in that case).
      if (indexToInsertAt === -1) {
        indexToInsertAt = state.tabStops.length;
      }

      return { ...state, tabStops: arrayInsert(state.tabStops, newTabStop, indexToInsertAt) };
    }
    case 'unregister': {
      const { id: tabStopIdToRemove } = action;
      const filteredTabStops = state.tabStops.filter((tabStop) => tabStop.id !== tabStopIdToRemove);

      if (filteredTabStops.length === state.tabStops.length) {
        console.warn(`${tabStopIdToRemove} tab stop is already unregistered`);
        return state;
      }

      return { ...state, tabStops: filteredTabStops };
    }
    case 'moveFocus': {
      const { id: tabStopIdToFocus } = action;

      if (tabStopIdToFocus === null) {
        return { ...state, currentTabStopId: null };
      }

      const index = state.tabStops.findIndex((tabStop) => tabStop.id === tabStopIdToFocus);

      // The item doesn't exist, so we do nothing
      if (index === -1) {
        return state;
      }

      return { ...state, currentTabStopId: state.tabStops[index].id };
    }
    case 'moveFocusToNext': {
      if (state.currentTabStopId == null) {
        return reducer(state, { type: 'moveFocus', id: state.tabStops[0].id ?? null });
      }

      const index = state.tabStops.findIndex((tabStop) => tabStop.id === state.currentTabStopId);
      const tabStopCount = state.tabStops.length;
      const nextIndex = state.shouldLoop
        ? (index + 1) % tabStopCount
        : clamp(index + 1, [0, tabStopCount - 1]);

      return reducer(state, { type: 'moveFocus', id: state.tabStops[nextIndex].id ?? null });
    }
    case 'moveFocusToPrevious': {
      const stateWithReversedTabStops = { ...state, tabStops: state.tabStops.slice().reverse() };
      const { currentTabStopId } = reducer(stateWithReversedTabStops, { type: 'moveFocusToNext' });
      return { ...state, currentTabStopId };
    }
    case 'moveFocusToFirst': {
      const firstTabStop = state.tabStops[0];
      return reducer(state, { type: 'moveFocus', id: firstTabStop.id ?? null });
    }
    case 'moveFocusToLast': {
      const lastTabStop = state.tabStops[state.tabStops.length - 1];
      return reducer(state, { type: 'moveFocus', id: lastTabStop.id ?? null });
    }
    case 'updateOrientation': {
      return { ...state, orientation: action.orientation };
    }
    case 'updateShouldLoop': {
      return { ...state, shouldLoop: action.shouldLoop };
    }
    default:
      throw new Error();
  }
}

const [StateContext, useStateContext] = createContext<State>(
  'RovingTabIndexStateContext',
  'RovingTabIndexProvider'
);
const [DispatchContext, useDispatchContext] = createContext<React.Dispatch<Action>>(
  'RovingTabIndexStateContext',
  'RovingTabIndexProvider'
);

export { useRovingTabIndex, RovingTabIndexProvider };
