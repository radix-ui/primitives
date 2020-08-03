import { assign, EventObject, StateMachine } from '@xstate/fsm';

/* ---------------------------------------------------------------------------------------------- */

enum ComboboxStates {
  /** Nothing going on, waiting for the user to type or use the arrow keys */
  Idle = 'IDLE',
  /** The component is suggesting options as the user types */
  Suggesting = 'SUGGESTING',
  /** User is using the keyboard to navigate the list, not typing */
  Navigating = 'NAVIGATING',
  /** User is interacting with arbitrary elements inside the popup that are not ComboboxInputs */
  Interacting = 'INTERACTING',
}

enum ComboboxEvents {
  /** User cleared the value */
  Clear = 'CLEAR',
  /** User is typing */
  Change = 'CHANGE',
  /** User is navigating with the keyboard */
  Navigate = 'NAVIGATE',
  /** User selects an option with the keyboard */
  SelectWithKeyboard = 'SELECT_WITH_KEYBOARD',
  /** User selects an option with a click */
  SelectWithClick = 'SELECT_WITH_CLICK',
  /** User can hit escape or blur to close the popover */
  Escape = 'ESCAPE',
  /** The listbox is blurred */
  Blur = 'BLUR',
  /** User left the input to interact with arbitrary elements inside the popover */
  Interact = 'INTERACT',
  /** The input receives focus */
  Focus = 'FOCUS',
  /** User clicks the combobox button */
  ClickButton = 'CLICK_BUTTON',
}

/* ---------------------------------------------------------------------------------------------- */

const shouldOpenOnFocus = (ctx: ComboboxStateData, event: ComboboxEvent) => {
  return event.type === ComboboxEvents.Focus && !!event.openOnFocus;
};

const clearHighlightedValue = assign<ComboboxStateData, ComboboxEvent>({
  highlightedValue: null,
});

const clearValue = assign<ComboboxStateData, ComboboxEvent>({
  value: '',
});

const setValue = assign<ComboboxStateData, ComboboxEvent>({
  value: (ctx, event) =>
    typeof (event as any).value === 'string' ? (event as any).value : ctx.value,
});

const setHighlightedValue = assign<ComboboxStateData, ComboboxEvent>({
  highlightedValue: (_, event) => {
    return (event as any).value || null;
  },
});

const setValueFromHighlightedValue = assign<ComboboxStateData, ComboboxEvent>({
  value: (ctx) => ctx.highlightedValue || '',
});

const setInitialHighlightedValue = assign<ComboboxStateData, ComboboxEvent>({
  highlightedValue: (ctx, event) => {
    if (event.type === ComboboxEvents.Navigate || event.type === ComboboxEvents.ClickButton) {
      return event.persistSelection ? ctx.value : null;
    }
    return null;
  },
});

function focusInput(ctx: any, event: any) {
  if (event.type !== ComboboxEvents.SelectWithClick) {
    event.refs.input?.focus();
  }
}

// TODO: Gross
function focusInputAfterRaf(ctx: any, event: any) {
  requestAnimationFrame(() => {
    focusInput(ctx, event);
  });
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Initializer for our state chart. Some data may be passed into the context object up-front if it
 * is derived from props, but everything else is and should be static.
 *
 * @param initial
 * @param props
 */
function createStateChart({
  value,
}: {
  value: string | null | undefined;
}): StateMachine.Config<ComboboxStateData, ComboboxEvent, ComboboxState> {
  return {
    id: 'combobox',
    initial: ComboboxStates.Idle,
    context: {
      /**
       * The value the user has typed. We derive this also when the developer is controlling the
       * value of ComboboxInput.
       */
      value: value || '',
      /** The value the user has navigated to with the keyboard */
      highlightedValue: null,
    },
    states: {
      [ComboboxStates.Idle]: {
        on: {
          [ComboboxEvents.Change]: [
            {
              target: ComboboxStates.Idle,
              actions: [clearHighlightedValue, setValue],
              cond: (_, event) =>
                /**
                 * Initial input value change handler for syncing user state with state machine
                 * prevents initial change from sending the user to the navigating state
                 * @see https://github.com/reach/reach-ui/issues/464
                 */
                event.value === event.initialControlledValue && !event.controlledValueChanged,
            },
            {
              target: ComboboxStates.Suggesting,
              actions: [clearHighlightedValue, setValue],
            },
          ],
          [ComboboxEvents.Blur]: {
            target: ComboboxStates.Idle,
            actions: [clearHighlightedValue],
          },
          [ComboboxEvents.Clear]: {
            target: ComboboxStates.Idle,
            actions: [clearHighlightedValue, clearValue],
          },
          [ComboboxEvents.Focus]: [
            {
              target: ComboboxStates.Suggesting,
              actions: [setHighlightedValue],
              cond: shouldOpenOnFocus,
            },
            {
              target: ComboboxStates.Idle,
            },
          ],
          [ComboboxEvents.Navigate]: {
            target: ComboboxStates.Navigating,
            actions: [setInitialHighlightedValue, focusInput],
          },
          [ComboboxEvents.ClickButton]: {
            target: ComboboxStates.Suggesting,
            actions: [setInitialHighlightedValue, focusInputAfterRaf],
          },
        },
      },
      [ComboboxStates.Suggesting]: {
        on: {
          [ComboboxEvents.Change]: {
            target: ComboboxStates.Suggesting,
            actions: [clearHighlightedValue, setValue],
          },
          [ComboboxEvents.Focus]: [
            {
              target: ComboboxStates.Suggesting,
              actions: [setHighlightedValue],
              cond: shouldOpenOnFocus,
            },
            {
              target: ComboboxStates.Suggesting,
            },
          ],
          [ComboboxEvents.Navigate]: {
            target: ComboboxStates.Navigating,
            actions: [setHighlightedValue, focusInput],
          },
          [ComboboxEvents.Clear]: {
            target: ComboboxStates.Idle,
            actions: [clearValue, clearHighlightedValue],
          },
          [ComboboxEvents.Escape]: {
            target: ComboboxStates.Idle,
            actions: [clearHighlightedValue, focusInput],
          },
          [ComboboxEvents.Blur]: {
            target: ComboboxStates.Idle,
            actions: [clearHighlightedValue],
          },
          [ComboboxEvents.SelectWithClick]: {
            target: ComboboxStates.Idle,
            actions: [setValue, clearHighlightedValue, focusInput],
          },
          [ComboboxEvents.Interact]: {
            target: ComboboxStates.Interacting,
          },
          [ComboboxEvents.ClickButton]: {
            target: ComboboxStates.Idle,
            actions: [clearHighlightedValue],
          },
        },
      },
      [ComboboxStates.Navigating]: {
        on: {
          [ComboboxEvents.Change]: {
            target: ComboboxStates.Suggesting,
            actions: [clearHighlightedValue, setValue],
          },
          [ComboboxEvents.Focus]: [
            {
              target: ComboboxStates.Suggesting,
              actions: [setHighlightedValue],
              cond: shouldOpenOnFocus,
            },
            {
              target: ComboboxStates.Navigating,
            },
          ],
          [ComboboxEvents.Clear]: {
            target: ComboboxStates.Idle,
            actions: [clearValue, clearHighlightedValue],
          },
          [ComboboxEvents.Blur]: {
            target: ComboboxStates.Idle,
            actions: [clearHighlightedValue],
          },
          [ComboboxEvents.Escape]: {
            target: ComboboxStates.Idle,
            actions: [clearHighlightedValue, focusInput],
          },
          [ComboboxEvents.Navigate]: {
            target: ComboboxStates.Navigating,
            actions: [setHighlightedValue, focusInput],
          },
          [ComboboxEvents.SelectWithClick]: {
            target: ComboboxStates.Idle,
            actions: [setValue, clearHighlightedValue, focusInput],
          },
          [ComboboxEvents.SelectWithKeyboard]: {
            target: ComboboxStates.Idle,
            actions: [
              function handleOptionValueSelectWithKeyboard(_, event) {
                if (event.type === ComboboxEvents.SelectWithKeyboard) {
                  // don't want to submit forms
                  event.event.preventDefault();
                  event.highlightedValue && event.onValueSelect(event.highlightedValue);
                }
              },
              setValueFromHighlightedValue,
              clearHighlightedValue,
            ],
            cond: (ctx) => ctx.highlightedValue !== null,
          },
          [ComboboxEvents.ClickButton]: {
            target: ComboboxStates.Idle,
            actions: [clearHighlightedValue],
          },
          [ComboboxEvents.Interact]: {
            target: ComboboxStates.Interacting,
          },
        },
      },
      [ComboboxStates.Interacting]: {
        on: {
          [ComboboxEvents.Change]: {
            target: ComboboxStates.Suggesting,
            actions: [clearHighlightedValue, setValue],
          },
          [ComboboxEvents.Clear]: {
            target: ComboboxStates.Idle,
            actions: [clearValue, clearHighlightedValue],
          },
          [ComboboxEvents.Focus]: [
            {
              target: ComboboxStates.Suggesting,
              actions: [setHighlightedValue],
              cond: shouldOpenOnFocus,
            },
            {
              target: ComboboxStates.Interacting,
            },
          ],
          [ComboboxEvents.Blur]: {
            target: ComboboxStates.Idle,
            actions: [clearHighlightedValue],
          },
          [ComboboxEvents.Escape]: {
            target: ComboboxStates.Idle,
            actions: [clearHighlightedValue, focusInput],
          },
          [ComboboxEvents.Navigate]: {
            target: ComboboxStates.Navigating,
            actions: [setHighlightedValue, focusInput],
          },
          [ComboboxEvents.ClickButton]: {
            target: ComboboxStates.Idle,
            actions: [clearHighlightedValue],
          },
          [ComboboxEvents.SelectWithClick]: {
            target: ComboboxStates.Idle,
            actions: [setValue, clearHighlightedValue, focusInput],
          },
        },
      },
    },
  };
}

export { createStateChart, ComboboxStates, ComboboxEvents };
export type {
  ComboboxState,
  ComboboxStateData,
  ComboboxEventBase,
  ComboboxEvent,
  ComboboxNodeRefs,
};

/* ---------------------------------------------------------------------------------------------- */

/**
 * State object for the state machine.
 */
type ComboboxState = {
  value: ComboboxStates;
  context: ComboboxStateData;
};

type ComboboxStateData = {
  highlightedValue?: string | null;
  value: string;
};

/**
 * Shared partial interface for all of our event objects.
 */
interface ComboboxEventBase extends EventObjectWithRefs {
  refs: ComboboxNodeRefs;
}

/**
 * DOM nodes for all of the refs used in the  state machine.
 */
type ComboboxNodeRefs = {
  input: HTMLInputElement | null;
};

type ComboboxEvent = ComboboxEventBase &
  (
    | { type: ComboboxEvents.Blur }
    | {
        type: ComboboxEvents.Change;
        value: string;
        controlledValueChanged: boolean;
        initialControlledValue?: string | undefined;
      }
    | { type: ComboboxEvents.Clear }
    | { type: ComboboxEvents.Escape }
    | { type: ComboboxEvents.Focus; openOnFocus?: boolean }
    | { type: ComboboxEvents.Interact }
    | {
        type: ComboboxEvents.Navigate;
        persistSelection?: boolean;
        value?: string | null;
      }
    | { type: ComboboxEvents.ClickButton; persistSelection?: boolean }
    | {
        type: ComboboxEvents.SelectWithClick;
        value: string;
      }
    | {
        type: ComboboxEvents.SelectWithKeyboard;
        event: KeyboardEvent;
        onValueSelect(value: string): any;
        highlightedValue: string | null | undefined;
      }
  );

// TODO: Move this eventually, if we still need it
interface EventObjectWithRefs extends EventObject {
  refs: {
    [key: string]: any;
  };
  lastEventType?: EventObjectWithRefs['type'];
}
