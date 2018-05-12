const fs = require('fs');
const path = require('path');

const setConfig = ({ email, apikey, timezone }) => {
  const data = {
    email,
    apiKey: apikey,
    timeZone: timezone,
  };

  fs.writeFile(
    path.join(__dirname, '../config/credentials.json'),
    JSON.stringify(data, null, 2),
    err => {
      if (err) throw err;

      console.log(`
        Config successfully created.
      `);
    }
  );
};

module.exports = setConfig;
