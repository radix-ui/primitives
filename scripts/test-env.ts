const SUPPORTED_REACT_VERSIONS = new Set([17, 18, 19] as const);
const DEFAULT_REACT_VERSION = 19;
type SupportedReactVersion = SetValue<typeof SUPPORTED_REACT_VERSIONS>;
const reactVersion = sanitizeReactVersion(process.env.REACT_VERSION) ?? DEFAULT_REACT_VERSION;

export { reactVersion, DEFAULT_REACT_VERSION };

function sanitizeReactVersion(version: string | undefined) {
  version = version?.trim();
  if (!version) {
    return undefined;
  }

  const parsed = Number.parseInt(version, 10);
  if (!isSupportedReactVersion(parsed)) {
    throw new Error(`Invalid React version: ${version}`);
  }

  return parsed;
}

function isSupportedReactVersion(version: number): version is SupportedReactVersion {
  return SUPPORTED_REACT_VERSIONS.has(version as SupportedReactVersion);
}

type SetValue<T extends Set<any>> = T extends Set<infer U> ? U : never;
