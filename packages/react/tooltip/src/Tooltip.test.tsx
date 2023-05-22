import * as React from 'react';
import { render, RenderResult, waitFor, fireEvent } from '@testing-library/react';
import { Provider, Trigger, Content, Root } from './Tooltip';

const TRIGGER_ID = 'trigger';
const CONTENT_ID = 'content';
const CLOSE_DELAY_DURATION = 800;

const TooltipTest = () => (
  <Provider closeDelayDuration={CLOSE_DELAY_DURATION} delayDuration={0}>
    <Root>
      <Trigger data-testid={TRIGGER_ID}>{TRIGGER_ID}</Trigger>
      <Content data-testid={CONTENT_ID}>{CONTENT_ID}</Content>
    </Root>
  </Provider>
);

describe('given a default Tooltip', () => {
  let rendered: RenderResult;
  let trigger: HTMLElement;
  let content: HTMLElement;

  beforeEach(async () => {
    rendered = render(<TooltipTest />);
    trigger = rendered.getByTestId(TRIGGER_ID);
    fireEvent.pointerMove(trigger);
    await waitFor(async () => {
      content = rendered.getByRole('tooltip');
    });
  });

  test('should show the tooltip after the mouse has left the trigger', async () => {
    fireEvent.pointerLeave(trigger);
    expect(content).toBeVisible();
  });

  test('should show the tooltip after the mouse has left the content', async () => {
    fireEvent.pointerLeave(content);
    fireEvent.pointerLeave(trigger);
    expect(content).toBeVisible();
  });
});
