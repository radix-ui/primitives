---
"@radix-ui/react-select": patch
---

fix(select): prevent spurious onValueChange calls with empty string in forms

When a controlled Select component inside a form receives an external value
update (e.g., from form.reset()), onValueChange was incorrectly being called
with an empty string, which would overwrite the valid controlled value.

This fix guards the internal onChange handler to skip empty value updates when
a valid controlled value already exists, ensuring onValueChange only fires for
genuine user interactions or form autofill scenarios.

Fixes #3135, #3249, #3693
