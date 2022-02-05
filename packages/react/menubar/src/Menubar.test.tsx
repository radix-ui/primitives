import * as React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import * as Menubar from '.';
import userEvent from '@testing-library/user-event';

const FIRST_MENU_TRIGGER = 'FIRST_MENU_TRIGGER';
const FIRST_MENU_FIRST_ITEM = 'FIRST_MENU_FIRST_ITEM';
const FIRST_MENU_MIDDLE_ITEM = 'FIRST_MENU_MIDDLE_ITEM';
const FIRST_MENU_NESTED_TRIGGER = 'FIRST_MENU_NESTED_TRIGGER';
const FIRST_MENU_NESTED_ITEM = 'FIRST_MENU_NESTED_ITEM';
const FIRST_MENU_LAST_ITEM = 'FIRST_MENU_LAST_ITEM';

const MIDDLE_MENU_TRIGGER = 'MIDDLE_MENU_TRIGGER';
const MIDDLE_MENU_FIRST_ITEM = 'MIDDLE_MENU_FIRST_ITEM';

const LAST_MENU_TRIGGER = 'LAST_MENU_TRIGGER';
const LAST_MENU_FIRST_ITEM = 'LAST_MENU_FIRST_ITEM';

const FIRST_LETTER = 'W';

const MenubarFixture = () => {
  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>{FIRST_MENU_TRIGGER}</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>{FIRST_MENU_FIRST_ITEM}</Menubar.Item>
          <Menubar.Menu>
            <Menubar.Trigger>
              {FIRST_MENU_MIDDLE_ITEM} {FIRST_MENU_NESTED_TRIGGER}
            </Menubar.Trigger>
            <Menubar.Content>
              <Menubar.Item>{FIRST_MENU_NESTED_ITEM}</Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>
          <Menubar.Item>{FIRST_MENU_LAST_ITEM}</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>
          {FIRST_LETTER} {MIDDLE_MENU_TRIGGER}
        </Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>{MIDDLE_MENU_FIRST_ITEM}</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>{LAST_MENU_TRIGGER}</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>{LAST_MENU_FIRST_ITEM}</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  );
};

describe('given a default Menubar component', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<MenubarFixture />);
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when menu trigger hover', () => {
    it('should open the menu', () => {
      userEvent.hover(screen.getByText(FIRST_MENU_TRIGGER));
      expect(screen.getByText(FIRST_MENU_FIRST_ITEM)).toBeVisible();
    });
  });

  describe('when menubar has focus', () => {
    beforeEach(() => {
      screen.getByText(FIRST_MENU_TRIGGER).focus();
    });

    describe('when arrow right press', () => {
      it('should focus the next menu trigger', () => {
        userEvent.keyboard('{arrowright}');
        expect(screen.getByText(MIDDLE_MENU_TRIGGER)).toHaveFocus();
      });
    });

    describe('when arrow left press', () => {
      it('should focus the last menu trigger', () => {
        userEvent.keyboard('{arrowleft}');
        expect(screen.getByText(LAST_MENU_TRIGGER)).toHaveFocus();
      });
    });

    describe('when home press', () => {
      it('should focus first menu trigger', () => {
        screen.getByText(MIDDLE_MENU_TRIGGER).focus();
        userEvent.keyboard('{home}');
        expect(screen.getByText(FIRST_MENU_TRIGGER)).toHaveFocus();
      });
    });

    describe('when end press', () => {
      it('should focus the last menu trigger', () => {
        userEvent.keyboard('{end}');
        expect(screen.getByText(LAST_MENU_TRIGGER)).toHaveFocus();
      });
    });

    describe('when arrow down press', () => {
      it('should focus first menu item', () => {
        userEvent.keyboard('{arrowdown}');
        expect(screen.getByText(FIRST_MENU_FIRST_ITEM)).toHaveFocus();
      });
    });

    describe('when arrow up press', () => {
      it('should focus first menu item', () => {
        userEvent.keyboard('{arrowup}');
        expect(screen.getByText(FIRST_MENU_LAST_ITEM)).toHaveFocus();
      });
    });

    describe('when enter press', () => {
      beforeEach(() => {
        userEvent.keyboard('{enter}');
      });

      it('should have no accessibility violations', async () => {
        expect(await axe(rendered.container)).toHaveNoViolations();
      });
      it('should focus the first menu item', () => {
        expect(screen.getByText(FIRST_MENU_FIRST_ITEM)).toHaveFocus();
      });

      // TODO check item activation on space and enter press

      describe('when arrow down press', () => {
        beforeEach(() => userEvent.keyboard('{arrowdown}'));

        it('should focus the next Menubar item', () => {
          expect(screen.getByText(FIRST_MENU_MIDDLE_ITEM)).toHaveFocus();
        });

        describe('when current focus is in the last item', () => {
          beforeAll(() => screen.getByText(FIRST_MENU_LAST_ITEM).focus());

          it('should focus the first item', () => {
            expect(screen.getByText(FIRST_MENU_FIRST_ITEM)).toHaveFocus();
          });
        });
      });

      describe('when arrow up press', () => {
        beforeEach(() => {
          screen.getByText(FIRST_MENU_MIDDLE_ITEM).focus();
          userEvent.keyboard('{arrowup}');
        });

        it('should focus the next Menubar item', () => {
          expect(screen.getByText(FIRST_MENU_TRIGGER)).toHaveFocus();
        });

        describe('when current focus is in the last item', () => {
          beforeAll(() => screen.getByText(FIRST_MENU_FIRST_ITEM).focus());

          it('should focus the last item', () => {
            expect(screen.getByText(FIRST_MENU_LAST_ITEM)).toHaveFocus();
          });
        });
      });

      describe('when arrow right press', () => {
        beforeEach(() => userEvent.keyboard('{arrowright}'));

        describe('when focused item is not a submenu', () => {
          /**
           * When moving to next menu with arrow navigation, trigger is focused and next
           * menu is opened. First item is not focused.
           *
           * See: https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html
           */
          it('should move focus to next menu', () => {
            expect(screen.getByText(MIDDLE_MENU_TRIGGER)).toHaveFocus();
          });
          it('should open next menu', () => {
            expect(screen.getByText(MIDDLE_MENU_FIRST_ITEM)).toBeVisible();
          });
          it('should have no accessibility violations', async () => {
            expect(await axe(rendered.container)).toHaveNoViolations();
          });

          describe('when currently focused menu is the last menu', () => {
            beforeAll(() => {
              screen.getByText(MIDDLE_MENU_TRIGGER).focus();
              userEvent.keyboard('{enter}');
            });

            it('should move focus to first menu', () => {
              expect(screen.getByText(FIRST_MENU_FIRST_ITEM)).toHaveFocus();
            });
            it('should open first menu', () => {
              expect(screen.getByText(FIRST_MENU_FIRST_ITEM)).toBeVisible();
            });
          });
        });

        describe('when focused item is a submenu', () => {
          it('should open the submenu', () => {
            expect(screen.getByText(FIRST_MENU_NESTED_ITEM)).toHaveFocus();
          });
        });
      });
    });

    describe('when space press', () => {
      it('should open the menu', () => {
        userEvent.keyboard('{space}');
        expect(screen.getByText(FIRST_MENU_FIRST_ITEM)).toHaveFocus();
      });
    });

    describe('when type first letter of a trigger', () => {
      it('should focus the trigger', () => {
        userEvent.keyboard(FIRST_LETTER);
        expect(screen.getByText(FIRST_LETTER)).toHaveFocus();
      });
    });
  });
});
