const fs = require('fs');

const setConfig = flags => {
  const data = {
    email: flags.email,
    apiKey: flags.apiKey,
    timeZone: flags.timeZone,
  };

  const writeStream = fs.createWriteStream('./config/credentials.json');

  writeStream.write(JSON.stringify(data, null, 2), function(err) {
    if (err) return console.log(err);
  });

  writeStream.end();
};

module.exports = setConfig;
