const fs = require('fs');
const path = require('path');

const Config = require('./config');

describe('Config', () => {
  afterEach(() => {
    fs.unlink(path.join(__dirname, '../../config/credentials.json'), err => {
      if (err) {
        console.log(err);
      }
    });
  });

  it('sets the config provided in credentials.json', () => {
    const config = new Config();
    config.setConfig({
      email: 'testEmail',
      apikey: 'testApiKey',
      timezone: 'testTimeZone',
    });

    fs.readFile(
      path.join(__dirname, '../../config/credentials.json'),
      (err, data) => {
        expect(JSON.parse(data.toString())).toEqual({
          email: 'testEmail',
          apiKey: 'testApiKey',
          timeZone: 'testTimeZone',
        });
      }
    );
  });

  it('updates the config with the keys provided after config has been set', async () => {
    const config = new Config();
    config.setConfig({
      email: 'testEmail',
      apikey: 'testApiKey',
      timezone: 'testTimeZone',
    });

    await config.updateConfig({
      timezone: 'updatedTimeZone',
    });

    fs.readFile(
      path.join(__dirname, '../../config/credentials.json'),
      (err, data) => {
        expect(JSON.parse(data.toString())).toEqual({
          email: 'testEmail',
          apiKey: 'testApiKey',
          timeZone: 'updatedTimeZone',
        });
      }
    );

  })
});
