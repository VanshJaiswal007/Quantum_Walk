#!/usr/bin/env node

// Simple health check script to verify the app setup

const http = require('http');

console.log('\n🏥 Health Check - Quantum Budget Optimizer\n');
console.log('Checking application setup...\n');

// Check if key files exist
const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'server/index.ts',
  'client/src/main.tsx',
  'package.json',
  'tsconfig.json',
  'vite.config.js',
  'README.md',
];

let allGood = true;

console.log('📋 Checking required files:\n');
filesToCheck.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  const icon = exists ? '✅' : '❌';
  console.log(`  ${icon} ${file}`);
  if (!exists) allGood = false;
});

console.log('\n📦 Checking dependencies:\n');
const depsToCheck = [
  'react',
  'express',
  'typescript',
  'tailwindcss',
  'vite',
];

depsToCheck.forEach(dep => {
  try {
    require.resolve(dep);
    console.log(`  ✅ ${dep}`);
  } catch {
    console.log(`  ❌ ${dep}`);
    allGood = false;
  }
});

console.log('\n');

if (allGood) {
  console.log('✨ All checks passed! Application is ready to run.\n');
  console.log('📖 Next steps:');
  console.log('  1. npm run dev          (start both frontend & backend)');
  console.log('  2. Open http://localhost:5173 in your browser');
  console.log('  3. Start optimizing your shopping basket!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some checks failed. Please run: npm install\n');
  process.exit(1);
}
