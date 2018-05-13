const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
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
      fs.readFile(
        path.join(__dirname, '../../config/credentials.json'),
        'utf8',
        (err, data) => {
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

          Object.keys(mappedConfig).forEach((option) => {
            if (mappedConfig[option] && config[option]) {
              config[option] = mappedConfig[option];
            }
          });

         this.writeCredentials(config).then(resolve).catch(reject)
        }
      );
    })

  }

  getConfig() {
    fs.readFile(
      path.join(__dirname, '../../config/credentials.json'),
      'utf8',
      (err, data) => {
        if (err) {
          log('Config not set, run --help to get started');
        }
        log(data);
      }
    );
  }

  writeCredentials(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '../../config/credentials.json'),
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
    })
  }
}

module.exports = Config;
