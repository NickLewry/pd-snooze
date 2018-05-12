#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const help = require('./help');
const setConfig = require('./setConfig');
const cliFlags = require('gar')(process.argv.slice(2));

if (fs.existsSync(path.join(__dirname, 'config/credentials.json'))) {
  const Snooze = require('./snooze/snooze');
  new Snooze().init(cliFlags);
} else if (cliFlags.setConfig) {
  setConfig(cliFlags);
} else {
  help();
}
