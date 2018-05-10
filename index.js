#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const setConfig = require('./setConfig');
const cliFlags = require('gar')(process.argv.slice(2));

if (fs.existsSync(path.join(__dirname, 'config/credentials.json'))) {
  const Snooze = require('./snooze/snooze');
  new Snooze().init(cliFlags);
} else if (cliFlags.setConfig) {
  setConfig(cliFlags);
} else {
  console.log(
    'credentials not set, please run pd-snooze --help to get started'
  );
}
