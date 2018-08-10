const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();

const Config = require('./config');

describe('Config', () => {
  afterEach(() => {
    fs.unlink(path.join(homedir, '.pd-snooze'), err => {
      if (err) {
        console.log(err);
      }
    });
  });

  it('sets the config provided', async () => {
    const config = new Config();
    config.setConfig({
      email: 'testEmail',
      apikey: 'testApiKey',
      timezone: 'testTimeZone',
    });

    const userConfig = await config.getConfig();

    expect(JSON.parse(userConfig)).toEqual({
      email: 'testEmail',
      apiKey: 'testApiKey',
      timeZone: 'testTimeZone',
    });
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

    const updatedConfig = await config.getConfig();

    expect(JSON.parse(updatedConfig)).toEqual({
      email: 'testEmail',
      apiKey: 'testApiKey',
      timeZone: 'updatedTimeZone',
    });
  });
});
