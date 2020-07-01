export function importWarning(pkg: string, mod: string) {
  if (__DEV__) {
    console.warn(
      `You are trying to import the ${pkg} package without specifying a specific build. Please import the build directly depending on your needs:
      
      - import { ${mod} } from @interop-ui/${pkg}/react
      - import { ${mod} } from @interop-ui/${pkg}/vanilla
      - import { ${mod} } from @interop-ui/${pkg}/vue`
    );
  }
  return {};
}
