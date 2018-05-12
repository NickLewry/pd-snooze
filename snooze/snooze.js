const chalk = require('chalk');
const { email, apiKey, timeZone } = require('../config/credentials.json');

class Snooze {
  constructor(
    Utils = require('../utils/utils'),
    Services = require('../services/services'),
    Maintenance = require('../maintenance/maintenance'),
    log = require('../utils/log'),
    help = require('../help')
  ) {
    this.utils = new Utils({ email, apiKey, timeZone });
    this.Services = new Services(this.utils);
    this.Maintenance = new Maintenance(this.utils);
    this.log = log;
    this.help = help;
    this.handlers = {
      ls: this.Services.listServices,
      sm: this.Maintenance.startMaintenance,
      em: this.Maintenance.endMaintenance,
      lm: this.Maintenance.listMaintenanceWindows,
      help: this.help,
    };
  }

  init(cliFlags) {
    if (Object.keys(cliFlags).length <= 1) {
      this.help();
      return;
    }

    if (!email || !apiKey || !timeZone) {
      this.log(
        chalk.red(
          'config not set: please run eg. `node setConfig email ${you@email.com} apiKey ${APIKEY} timeZone ${Europe/London}`'
        )
      );
      return;
    }

    for (const flag in cliFlags) {
      if (cliFlags[flag] && this.handlers[flag]) {
        this.handlers[flag](cliFlags);
      }
    }
  }
}

module.exports = Snooze;
