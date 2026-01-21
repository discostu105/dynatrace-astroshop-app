#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'app.config.local.json');

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (config.environmentUrl) {
    process.stdout.write(config.environmentUrl);
  } else {
    console.error('Error: environmentUrl not found in app.config.local.json');
    process.exit(1);
  }
} catch (error) {
  console.error('Error: Could not read app.config.local.json. Please create it from app.config.local.template.json');
  process.exit(1);
}
