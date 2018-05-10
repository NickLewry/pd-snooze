const fs = require('fs');
const path = require('path');

const setConfig = flags => {
  const data = {
    email: flags.email,
    apiKey: flags.apiKey,
    timeZone: flags.timeZone,
  };

  fs.writeFile(
    path.join(__dirname, 'config/credentials.json'),
    JSON.stringify(data, null, 2),
    err => {
      if (err) throw err;

      console.log('Credentials stored');
    }
  );
};

module.exports = setConfig;
