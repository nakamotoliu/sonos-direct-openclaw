#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

console.log('--- Sonos Skill Self-Check ---');

// 1. Check Node version
console.log(`[1] Node version: ${process.version}`);

// 2. Check dependencies
try {
  if (fs.existsSync('./node_modules')) {
    console.log('[2] node_modules found.');
  } else {
    console.warn('[2] WARNING: node_modules missing. Please run "npm install".');
  }
} catch (e) {}

// 3. Check Sonos CLI
try {
  const sonosVer = execSync('sonos --version').toString().trim();
  console.log(`[3] Sonos CLI: OK (${sonosVer})`);
} catch (e) {
  console.error('[3] ERROR: Sonos CLI (brew install sonos) not found.');
}

// 4. Check Git repo
try {
  const remote = execSync('git remote -v').toString();
  console.log(`[4] Git Remotes:\n${remote}`);
} catch (e) {}

console.log('--- Check Complete ---');
