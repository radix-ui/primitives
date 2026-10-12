import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { hasUseClientDirective } from './rsc-client-boundary-stub.mts';

/**
 * Guards against RSC regressions where module-scope client-only references
 * throw when imported into a React Server Component.
 *
 * This suite runs under React's `react-server` build (see the `rsc` project in
 * `vitest.config.mts`) where client-only APIs are `undefined`. Modules that
 * declare `"use client"` are treated as client boundaries and stubbed out,
 * mirroring how an RSC bundler behaves.
 *
 * Every publishable package must be usable from a Server Component. Either it
 * is server-safe to import, or it explicitly declares `"use client"` so
 * bundlers create a client boundary for it.
 *
 * This catches client-only usage at module scope. Client APIs only invoked
 * during render are not detectable at import time.
 */

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE_GROUPS = ['core', 'react'];

interface PackageEntry {
  name: string;
  entryPath: string;
  isClient: boolean;
}

function collectPackages(): PackageEntry[] {
  const packages: PackageEntry[] = [];
  for (const group of PACKAGE_GROUPS) {
    const groupDir = path.join(rootDir, 'packages', group);
    if (!fs.existsSync(groupDir)) {
      continue;
    }
    for (const dirName of fs.readdirSync(groupDir)) {
      const packageDir = path.join(groupDir, dirName);
      const packageJsonPath = path.join(packageDir, 'package.json');
      const entryPath = path.join(packageDir, 'src', 'index.ts');
      if (!fs.existsSync(packageJsonPath) || !fs.existsSync(entryPath)) {
        continue;
      }
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.private) {
        continue;
      }
      const source = fs.readFileSync(entryPath, 'utf8');
      packages.push({
        name: packageJson.name,
        entryPath,
        isClient: hasUseClientDirective(source),
      });
    }
  }
  return packages.sort((a, b) => a.name.localeCompare(b.name));
}

const packages = collectPackages();

describe('React Server Components compatibility', () => {
  it('runs under the `react-server` condition', async () => {
    const React = await import('react');
    // If this fails, the `rsc` vitest project is not resolving React's server build,
    // which would make the rest of this suite pass for the wrong reasons.
    expect((React as typeof React & { createContext?: unknown }).createContext).toBeUndefined();
  });

  it('discovers the publishable packages', () => {
    expect(packages.length).toBeGreaterThan(20);
  });

  describe.each(packages)('$name', (packageEntry) => {
    if (packageEntry.isClient) {
      it('declares "use client" (client boundary, safe to import from a Server Component)', () => {
        expect(packageEntry.isClient).toBe(true);
      });
    } else {
      it('imports without throwing in a Server Component', async () => {
        await expect(import(/* @vite-ignore */ packageEntry.entryPath)).resolves.toBeDefined();
      });
    }
  });
});
