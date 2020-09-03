import React from 'react';
import styled from 'styled-components';
import ConditionalWrap from 'conditional-wrap';
import { Lock } from './Lock';

export default { title: 'Lock' };

export const Base = () => {
  const [isActive, setIsActive] = React.useState(false);
  const [elementToFocusOnActivation, setElementToFocusOnActivation] = React.useState<
    'ageInput' | undefined
  >(undefined);
  const [elementToFocusOnDeactivation, setElementToFocusOnDeactivation] = React.useState<
    'nextButton' | 'helloInput' | undefined
  >(undefined);
  const [shouldDeactivateOnEscape, setShouldDeactivateOnEscape] = React.useState(true);
  const [shouldDeactivateOnOutsideClick, setShouldDeactivateOnOutsideClick] = React.useState(true);
  const [shouldBlockOutsideClick, setShouldBlockOutsideClick] = React.useState(true);

  const ageInputRef = React.useRef<HTMLInputElement>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);
  const helloInputRef = React.useRef<HTMLInputElement>(null);

  const focusActivationControls = (
    <div>
      <p>
        <b>Element to focus on activation</b>
      </p>
      <div>
        <label>
          <input
            name="elementToFocusOnActivation"
            type="radio"
            checked={elementToFocusOnActivation === undefined}
            onChange={() => setElementToFocusOnActivation(undefined)}
          />{' '}
          Default
        </label>
      </div>
      <div>
        <label>
          <input
            name="elementToFocusOnActivation"
            type="radio"
            checked={elementToFocusOnActivation === 'ageInput'}
            onChange={() => setElementToFocusOnActivation('ageInput')}
          />{' '}
          Age input
        </label>
      </div>
    </div>
  );

  const focusDeactivationControls = (
    <div>
      <p>
        <b>Element to focus on deactivation</b>
      </p>
      <div>
        <label>
          <input
            name="elementToFocusOnDeactivation"
            type="radio"
            checked={elementToFocusOnDeactivation === undefined}
            onChange={() => setElementToFocusOnDeactivation(undefined)}
          />{' '}
          Default
        </label>
      </div>
      <div>
        <label>
          <input
            name="elementToFocusOnDeactivation"
            type="radio"
            checked={elementToFocusOnDeactivation === 'nextButton'}
            onChange={() => setElementToFocusOnDeactivation('nextButton')}
          />{' '}
          Next button
        </label>
      </div>
      <div>
        <label>
          <input
            name="elementToFocusOnDeactivation"
            type="radio"
            checked={elementToFocusOnDeactivation === 'helloInput'}
            onChange={() => setElementToFocusOnDeactivation('helloInput')}
          />{' '}
          Hello world input
        </label>
      </div>
    </div>
  );

  const otherControls = (
    <div>
      <p>
        <b>Other</b>
      </p>
      <div>
        <label>
          <input
            type="checkbox"
            checked={shouldDeactivateOnEscape}
            onChange={(event) => setShouldDeactivateOnEscape(event.target.checked)}
          />{' '}
          Deactivate on escape
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={shouldDeactivateOnOutsideClick}
            onChange={(event) => setShouldDeactivateOnOutsideClick(event.target.checked)}
          />{' '}
          Deactivate on outside click
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={shouldBlockOutsideClick}
            onChange={(event) => setShouldBlockOutsideClick(event.target.checked)}
          />{' '}
          Block outside click
        </label>
      </div>
    </div>
  );

  const options = (
    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.05' }}>
      <h2 style={{ margin: 0, padding: 10 }}>Lock options</h2>
      <Columns style={{ backgroundColor: 'rgba(0, 0, 0, 0.05', padding: 10 }}>
        {focusActivationControls}
        {focusDeactivationControls}
        {otherControls}
      </Columns>
    </div>
  );

  return (
    <FocusTracker>
      {options}
      <div style={{ padding: 50, textAlign: 'center' }}>
        <button type="button" onClick={() => setIsActive(true)}>
          Activate focus trap
        </button>

        <button
          ref={nextButtonRef}
          type="button"
          onMouseDown={() => console.log('next (mousedown)')}
          onClick={() => console.log('next (click)')}
          style={{ margin: 10 }}
        >
          Next
        </button>
        <input ref={helloInputRef} type="text" defaultValue="Hello world" />
      </div>

      <ConditionalWrap
        condition={isActive}
        wrap={(children) => (
          <Lock
            onDeactivate={() => setIsActive(false)}
            refToFocusOnActivation={
              elementToFocusOnActivation === 'ageInput' ? ageInputRef : undefined
            }
            refToFocusOnDeactivation={
              elementToFocusOnDeactivation === 'nextButton'
                ? nextButtonRef
                : elementToFocusOnDeactivation === 'helloInput'
                ? helloInputRef
                : undefined
            }
            shouldDeactivateOnEscape={shouldDeactivateOnEscape}
            shouldDeactivateOnOutsideClick={shouldDeactivateOnOutsideClick}
            shouldBlockOutsideClick={shouldBlockOutsideClick}
          >
            {children}
          </Lock>
        )}
      >
        <LockIndicatorBox isActive={isActive}>
          <form>
            <h2 style={{ marginTop: 0 }}>Form ({isActive ? 'in Lock' : 'no Lock'})</h2>
            <label htmlFor="name" style={{ display: 'block' }}>
              Name
            </label>
            <input type="text" id="name" name="name" defaultValue="John Doe" />
            <label htmlFor="age" style={{ display: 'block', marginTop: 10 }}>
              Age
            </label>
            <input
              ref={ageInputRef}
              type="number"
              id="age"
              name="age"
              defaultValue="38"
              min="0"
              max="120"
            />
            <div style={{ marginTop: 10 }}>
              <button type="button" onClick={() => setIsActive(false)}>
                Deactivate focus trap
              </button>
            </div>
            <details style={{ marginTop: 30 }}>
              <summary>Expand to change options from within the Lock</summary>
              {options}
            </details>
          </form>
        </LockIndicatorBox>
      </ConditionalWrap>
    </FocusTracker>
  );
};

export const Nested = () => {
  const [isActive, setIsActive] = React.useState(false);
  const [isActiveNested, setIsActiveNested] = React.useState(false);

  return (
    <FocusTracker>
      <div style={{ padding: 10 }}>
        <button type="button" onClick={() => setIsActive(true)}>
          Activate focus trap
        </button>

        {isActive && (
          <Lock
            onDeactivate={() => setIsActive(false)}
            shouldDeactivateOnEscape
            shouldDeactivateOnOutsideClick
            shouldBlockOutsideClick
          >
            <LockIndicatorBox isActive={isActive}>
              <button type="button" onClick={() => setIsActive(false)}>
                Deactivate focus trap
              </button>

              <button
                type="button"
                onClick={() => setIsActiveNested(true)}
                style={{ marginLeft: 10 }}
              >
                Activate nested focus trap
              </button>

              {isActiveNested && (
                <Lock
                  onDeactivate={() => setIsActiveNested(false)}
                  shouldDeactivateOnEscape
                  shouldDeactivateOnOutsideClick
                  shouldBlockOutsideClick
                >
                  <LockIndicatorBox isActive={isActiveNested}>
                    <button type="button" onClick={() => setIsActiveNested(false)}>
                      Deactivate nested focus trap
                    </button>
                  </LockIndicatorBox>
                </Lock>
              )}
            </LockIndicatorBox>
          </Lock>
        )}
      </div>
    </FocusTracker>
  );
};

export const ExoticFocusableTarget = () => {
  const [isActive, setIsActive] = React.useState(false);
  const fancyInputRef = React.useRef(null);

  return (
    <FocusTracker>
      <button type="button" onClick={() => setIsActive(true)}>
        Activate
      </button>
      <ConditionalWrap
        condition={isActive}
        wrap={(children) => (
          <Lock
            onDeactivate={() => setIsActive(false)}
            shouldDeactivateOnEscape
            shouldDeactivateOnOutsideClick={false}
            shouldBlockOutsideClick
            refToFocusOnDeactivation={fancyInputRef}
          >
            {children}
          </Lock>
        )}
      >
        <LockIndicatorBox isActive={isActive}>
          <button type="button" onClick={() => setIsActive(false)}>
            Deactivate
          </button>
        </LockIndicatorBox>
      </ConditionalWrap>
      <FancyInput ref={fancyInputRef} />
    </FocusTracker>
  );
};

const FancyInput = React.forwardRef((props, forwardedRef) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(forwardedRef, () => ({
    focus: () => {
      alert('FOCUS FANCY INPUT');
      inputRef.current?.focus();
    },
  }));
  return <input {...props} ref={inputRef} placeholder="fancy input" />;
});

const FocusTracker = styled('div')({
  '& *:focus': {
    boxShadow: '0 0 0 5px white, 0 0 0 10px black',
  },
});

const Columns = styled('div')({
  display: 'flex',
  '& > * + *': {
    marginLeft: 100,
  },
});

const LockIndicatorBox = styled('div')<{ isActive: boolean }>((props) => ({
  margin: '10px 0',
  padding: 20,
  borderRadius: 4,
  border: '10px solid rgba(0, 0, 0, 0.05)',
  backgroundColor: props.isActive ? 'rgba(255, 0, 0, 0.5)' : '#eee',
}));
