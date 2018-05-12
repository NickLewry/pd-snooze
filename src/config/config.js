const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class Config {
  setConfig({ email, apikey, timezone }) {
    const data = {
      email,
      apiKey: apikey,
      timeZone: timezone,
    };

    fs.writeFile(
      path.join(__dirname, '../../config/credentials.json'),
      JSON.stringify(data, null, 2),
      err => {
        if (err) throw err;
        console.log(chalk.green('Config set successfully.'));
      }
    );
  }

  logConfig() {
    fs.readFile(
      path.join(__dirname, '../../config/credentials.json'),
      'utf8',
      (err, data) => {
        if (err) {
          console.log('Config not set, run --help to get started');
        }
        console.log(data);
      }
    );
  }
}

module.exports = Config;
