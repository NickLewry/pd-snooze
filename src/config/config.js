const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const homedir = require('os').homedir();

const log = require('../utils/log');

class Config {
  setConfig({ email, apikey, timezone }) {
    const data = {
      email,
      apiKey: apikey,
      timeZone: timezone,
    };

    this.writeCredentials(data);
  }

  async updateConfig({ email, apikey, timezone }) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(homedir, '.pd-snooze'), 'utf8', (err, data) => {
        if (err) {
          log('Config not set, run --help to get started');
          reject(err);
        }
        const mappedConfig = {
          email,
          apiKey: apikey,
          timeZone: timezone,
        };
        const config = JSON.parse(data);

        Object.keys(mappedConfig).forEach(option => {
          if (mappedConfig[option] && config[option]) {
            config[option] = mappedConfig[option];
          }
        });

        this.writeCredentials(config)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  async getConfig() {
    return new Promise(resolve => {
      fs.readFile(path.join(homedir, '.pd-snooze'), 'utf8', (err, data) => {
        if (err) {
          log('Config not set, run --help to get started');
        }

        resolve(data);
      });
    });
  }

  writeCredentials(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(homedir, '.pd-snooze'),
        JSON.stringify(data, null, 2),
        err => {
          if (err) {
            reject(err);
            throw err;
          }
          log(chalk.green('Config set successfully.'));
          resolve(data);
        }
      );
    });
  }
}

module.exports = Config;
