# interop-ui

## Project structure conventions

Keeping the structure consistent across packages helps us simplify and speed up the build process. As such, please follow the conventions decscribed below when creating a new package.

- Each package lives in a sub-directory of the `packages` directory with the following structure.

  ```
  interop-ui
  -- packages
  ---- [package_type]
  ------ [package]
  -------- dist # compiled code
  -------- src  # source code
  ---------- index.ts # entry file
  ---------- package.json
  ```

  If this convention creates challenges in the future we can revisit it then.
