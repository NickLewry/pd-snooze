#!/usr/bin/env node

const Snooze = require('./snooze/snooze');
const cliFlags = require('gar')(process.argv.slice(2));

new Snooze().init(cliFlags);
