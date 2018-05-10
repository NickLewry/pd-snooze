const chalk = require('chalk');
const { email, apiKey, timeZone } = require('../config/credentials.json');

class Snooze {
  constructor(
    Utils = require('../utils/utils'),
    Services = require('../services/services'),
    Maintenance = require('../maintenance/maintenance'),
    log = require('../utils/log')
  ) {
    this.utils = new Utils({ email, apiKey, timeZone });
    this.Services = new Services(this.utils);
    this.Maintenance = new Maintenance(this.utils);
    this.log = log;
    this.handlers = {
      ls: this.Services.listServices,
      sm: this.Maintenance.startMaintenance,
      em: this.Maintenance.endMaintenance,
      lm: this.Maintenance.listMaintenanceWindows,
      help: Snooze.help,
    };
  }

  init(cliFlags) {
    if (Object.keys(cliFlags).length <= 1) {
      Snooze.help();
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

  static help() {
    console.log(`
Setup:
--setConfig --apiKey <apiKey> --email <email> --timeZone <timeZone>       Sets config to be able to access pager duty api.

Example Usage:
--setConfig --apiKey example-api-key --email email@company.org --timeZone Europe/London

Commands:
  --ls                          List all services that are registered with your apiKey on Pager Duty.
  --lm                          List all open maintenance windows.
  --sm                          Starts a maintenance window for all services.
  --sm <service_name>           Starts a maintenance window for the service name provided.
  --em                          Ends all open maintenance windows.
  --em <service_name>           Ends the maintenance window that contains the service name provided.

Additional Flags:
  -d <min>                      Sets the duration of the maintenance window in minutes, default is 30.
  
Example Usage:
  --sm config-service -d 45     Puts config-service into a maintenance window for 45min 
      `);
  }
}

module.exports = Snooze;
