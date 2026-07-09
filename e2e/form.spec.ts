import { expect, test, type Locator } from '@playwright/test';
import { visitStory } from './helpers';

test.describe('Form', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'form--cypress');
    await page.getByText('reset', { exact: true }).click();
  });

  async function checkControlMessageAssociation(control: Locator, message: Locator) {
    await expect(control).toHaveAttribute('aria-describedby', /.+/);
    const describedBy = await control.getAttribute('aria-describedby');
    await expect(message).toHaveAttribute('id', describedBy ?? '');
  }

  test.describe('given a form', () => {
    test('should associate label and control', async ({ page }) => {
      await page.getByText(/email/i).click();
      await expect(page.getByLabel(/email/i)).toBeFocused();
    });

    test('allows custom label and control association', async ({ page }) => {
      await page.getByText(/country/i).click();
      await expect(page.getByLabel(/country/i)).toBeFocused();
    });
  });

  test.describe('given a form with client-side validation', () => {
    test('should prevent submitting when there are errors', async ({ page }) => {
      await page.getByText('submit', { exact: true }).click();
      await expect(page.getByText(/data/i)).toContainText('{}');
    });

    test('should focus the first control with an error', async ({ page }) => {
      await page.getByText('submit', { exact: true }).click();
      await expect(page.getByLabel(/name/i)).toBeFocused();
    });

    test('should handle `valueMissing` validity', async ({ page }) => {
      const control = page.getByLabel(/name/i);
      await page.getByText('submit', { exact: true }).click();
      const message = page.getByText(/missing/);
      await checkControlMessageAssociation(control, message);

      await control.focus();
      await control.pressSequentially('John');
      await page.keyboard.press('Tab');
      await expect(page.getByText(/missing/)).toHaveCount(0);
    });

    test('should handle `valid` validity', async ({ page }) => {
      const control = page.getByLabel(/name/i);
      await control.focus();
      await control.pressSequentially('John');
      await page.keyboard.press('Tab');
      const message = page.getByText('valid!', { exact: true });
      await checkControlMessageAssociation(control, message);

      await page.getByText('submit', { exact: true }).click();
      await expect(page.getByText(/data/i)).toContainText('"name": "John"');
    });

    test('should handle `rangeOverflow` validity', async ({ page }) => {
      const control = page.getByLabel(/age/i);
      await control.focus();
      await control.pressSequentially('200');
      await page.keyboard.press('Tab');
      const message = page.getByText(/too large/);
      await checkControlMessageAssociation(control, message);

      await control.focus();
      await control.clear();
      await control.pressSequentially('50');
      await page.keyboard.press('Tab');
      await expect(page.getByText(/does not match the required step/)).toHaveCount(0);
    });

    test('should handle `rangeUnderflow` validity', async ({ page }) => {
      const control = page.getByLabel(/age/i);
      await control.focus();
      await control.pressSequentially('-50');
      await page.keyboard.press('Tab');
      const message = page.getByText(/too small/);
      await checkControlMessageAssociation(control, message);

      await control.focus();
      await control.clear();
      await control.pressSequentially('50');
      await page.keyboard.press('Tab');
      await expect(page.getByText(/does not match the required step/)).toHaveCount(0);
    });

    test('should handle `stepMismatch` validity', async ({ page }) => {
      const control = page.getByLabel(/age/i);
      await control.focus();
      await control.pressSequentially('10.5');
      await page.keyboard.press('Tab');
      const message = page.getByText(/does not match the required step/);
      await checkControlMessageAssociation(control, message);

      await control.focus();
      await control.clear();
      await control.pressSequentially('50');
      await page.keyboard.press('Tab');
      await expect(page.getByText(/does not match the required step/)).toHaveCount(0);
    });

    test('should handle `typeMismatch` validity', async ({ page }) => {
      const control = page.getByLabel(/email/i);
      await control.focus();
      await control.pressSequentially('john.doe');
      await page.keyboard.press('Tab');
      const message = page.getByText(/does not match the required type/);
      await checkControlMessageAssociation(control, message);

      await control.focus();
      await control.pressSequentially('@gmail.com');
      await page.keyboard.press('Tab');
      await expect(page.getByText(/does not match the required type/)).toHaveCount(0);
    });

    test('should handle `tooShort` validity', async ({ page }) => {
      const control = page.getByLabel(/password/i);
      await control.focus();
      await control.pressSequentially('pass');
      await page.keyboard.press('Tab');
      const message = page.getByText(/too short/);
      await checkControlMessageAssociation(control, message);

      await control.focus();
      await control.clear();
      await control.pressSequentially('password');
      await page.keyboard.press('Tab');
      await expect(page.getByText(/too short/)).toHaveCount(0);
    });

    // the browser makes it impossible to type too long
    test.skip('should handle `tooLong` validity', async ({ page }) => {
      const control = page.getByLabel(/password/i);
      await control.focus();
      await control.pressSequentially('password is way too long');
      await page.keyboard.press('Tab');
      const message = page.getByText(/too long/);
      await checkControlMessageAssociation(control, message);
    });

    test('should handle `patternMismatch` validity', async ({ page }) => {
      const control = page.getByLabel(/pin/i);
      await control.focus();
      await control.pressSequentially('pin');
      await page.keyboard.press('Tab');
      const message = page.getByText(/does not match the required pattern/);
      await checkControlMessageAssociation(control, message);

      await control.focus();
      await control.clear();
      await control.pressSequentially('1234');
      await page.keyboard.press('Tab');
      await expect(page.getByText(/does not match the required pattern/)).toHaveCount(0);
    });

    test('should handle custom validity (sync custom validator)', async ({ page }) => {
      const control = page.getByLabel(/secret 1/i);
      await control.focus();
      await control.pressSequentially('secret');
      await page.keyboard.press('Tab');
      const message = page.getByText(/not valid/);
      await checkControlMessageAssociation(control, message);

      await control.focus();
      await control.clear();
      await control.pressSequentially('shush');
      await page.keyboard.press('Tab');
      await expect(page.getByText(/not valid/)).toHaveCount(0);
    });

    test('should handle custom validity (async custom validator)', async ({ page }) => {
      const control = page.getByLabel(/secret 2/i);
      await control.focus();
      await control.pressSequentially('secret');
      await page.keyboard.press('Tab');
      const message = page.getByText(/not valid/);
      await checkControlMessageAssociation(control, message);

      await control.focus();
      await control.clear();
      await control.pressSequentially('shush');
      await page.keyboard.press('Tab');
      await expect(page.getByText(/not valid/)).toHaveCount(0);
    });

    test('should allow custom error messages', async ({ page }) => {
      const control = page.getByLabel(/country/i);
      await control.focus();
      await control.pressSequentially('Portugal');
      await page.keyboard.press('Tab');
      const message = page.getByText(/country should be "france" or "spain"/i);
      await checkControlMessageAssociation(control, message);
    });
  });

  test.describe('given a form with server-side validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByLabel(/simulate server errors/i).click();
      await page.getByLabel(/name/i).focus();
      await page.getByLabel(/name/i).pressSequentially('John');
      await page.getByText(/submit/i).click();
    });

    test('should focus the first control with a server error', async ({ page }) => {
      await expect(page.getByLabel(/email/i)).toBeFocused();
    });

    test('allows showing custom server error messages per-field', async ({ page }) => {
      const control = page.getByLabel(/email/i);
      const message = page.getByText(/email is actually required server side/i);
      await checkControlMessageAssociation(control, message);
    });

    test('allows re-using client-side matchers for server errors', async ({ page }) => {
      const control = page.getByLabel(/pin/i);
      const message = page.getByText(/does not match the required pattern/);
      await checkControlMessageAssociation(control, message);
    });

    test('allows re-submitting the form with server errors', async ({ page }) => {
      await page.getByLabel(/email/i).focus();
      await page.getByLabel(/email/i).pressSequentially('john.doe@gmail.com');
      await page.getByLabel(/email/i).press('Enter');
      await expect(page.getByLabel(/email/i)).toBeFocused();
    });
  });
});
