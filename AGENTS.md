# Radix Primitives

Radix Primitives is for building high-quality, accessible design systems and web apps.

## Architecture

This project is a monorepo managed with [pnpm](https://pnpm.io/). It uses the following tools:

- [vitest](https://vitest.dev/) for unit testing
- [storybook](https://storybook.js.org/) for component documentation
- [playwright](https://playwright.dev/) for end-to-end testing
- [changesets](https://github.com/changesets/changesets) for versioning and publishing
- [oxlint](https://github.com/oxlint-dev/oxlint) for linting
- [oxfmt](https://github.com/oxlint-dev/oxfmt) for formatting

## Tech Constraints

- **pnpm** only
- **TypeScript** only (local scripts can use JavaScript with `// @ts-check` and type annotations)

## Commands

```bash
pnpm lint         # Lint the project
pnpm format       # Format the project
pnpm types:check  # Type check the project
pnpm test         # Run tests
pnpm build        # Build the project
```

## Adding a new package

Most packages are React-specific and live in a directory that matches the convention `packages/react/{package-id}`. For example, `@radix-ui/react-accordion` lives in `packages/react/accordion`.

New packages should follow the same general folder structure as existing packages:

```
packages/react/
  - {package-id}/
    - src/
      - {package-id}.tsx
      - index.ts
    - CHANGELOG.md
    - package.json
    - README.md
    - tsconfig.json
```

Reference other packages and copy their `package.json`, `README.md`, and `tsconfig.json` structure for new packages. devDependencies and peerDependencies should use consistent version ranges across the repo.

## Testing

- Prefer repetition over abstraction in tests

## Code conventions

- [ ] Prefer braces for control flow statements (if, for, while, etc.) over the `one-liner` syntax
- [ ] Prefer braces for switch cases
- [ ] Explicitly check `never` cases for more exhaustive type checking (eg. `value satisfies never`)
- [ ] Prefer clear variable/function names over abbreviations (long descriptive names are good if they clarify the intent)

## Pre-commit checklist

- [ ] Run `pnpm lint --fix` to handle auto-fixable linting errors, then fix any remaining linting errors
- [ ] Run `pnpm format`

## PR checklist

- [ ] `pnpm format:check` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] `pnpm types:check` passes
- [ ] Follows commit message conventions:
  - [ ] Commit message is succinct and prefixed with the affected package name. Exceptions to the prefix rule:
    - If changes are wide-ranging and affect multiple packages, omit the package name if it makes a succinct headline commit is too long
    - No packages are affected (cosmetic )
  - [ ] Avoid Conventional Commit message format (`feat:`, `fix:`, `feat!:` for breaking)
  - [ ] Avoid including too many implementation details in the commit message; prefer concise descriptions
- [ ] PR title follows same conventions as commit messages
- [ ] PR description is concise and includes a summary of the changes. Again, avoid including too many implementation details; prefer concise descriptions.
- [ ] Include a link to the relevant issue in the PR description (if applicable)
