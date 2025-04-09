#!/usr/bin/env node
// @ts-check
import path from 'node:path';
import { build } from './builder.js';

process.on('unhandledRejection', (err) => {
  throw err;
});
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

const args = process.argv.slice(2);
const relativePath = path.relative(process.cwd(), args[0] || '.');

await build(relativePath);
