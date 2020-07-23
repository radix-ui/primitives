import tsTypes from 'typescript';

export let tsModule: typeof tsTypes;

export function setTypescriptModule(override: typeof tsTypes) {
  tsModule = override;
}
