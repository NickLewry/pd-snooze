const chalk = require('chalk');
const Table = require('cli-table');

const Services = require('./services');
const Utils = require('../utils/utils');
const Config = require('../config/config');

describe('Services', () => {
  const utils = new Utils();
  const config = new Config();
  config.setConfig({
    email: 'test-email',
    apikey: 'test-apiKey',
    timezone: 'Europe/London',
  });

  const serviceData = [
    {
      name: 'config-service',
      id: 'config-id',
      metaData: 'random',
    },
    {
      name: 'analytics-service',
      id: 'analytics-id',
      metaData: 'random',
    },
    {
      name: 'user-service',
      id: 'user-id',
      metaData: 'random',
    },
  ];

  describe('validateService', () => {
    const logSpy = jest.fn();
    const services = new Services(utils, logSpy);
    it('returns the service if it exists in the list of services provided', () => {
      expect(services.validateService(serviceData, 'user-service')).toEqual([
        {
          name: 'user-service',
          id: 'user-id',
          metaData: 'random',
        },
      ]);
    });

    it('logs an error if service name does not exist', () => {
      const logSpy = jest.fn();
      const services = new Services(utils, logSpy);
      expect(
        services.validateService(serviceData, 'invalid-name')
      ).toBeUndefined();
      expect(logSpy).toBeCalledWith(
        chalk.red(`
      Unknown service [invalid-name], to output available services run: pd-snooze list --services
      `)
      );
    });
  });

  describe('getServices', () => {
    it('returns an array of mapped services containing name and id if the request was successful', async () => {
      let logSpy = jest.fn();
      let fetchSpy = jest.fn(() => ({
        json: () => ({
          services: serviceData,
        }),
      }));
      const services = new Services(utils, logSpy, fetchSpy);
      const result = await services.getServices();
      expect(result).toEqual([
        {
          name: 'config-service',
          id: 'config-id',
        },
        {
          name: 'analytics-service',
          id: 'analytics-id',
        },
        {
          name: 'user-service',
          id: 'user-id',
        },
      ]);
    });

    it('logs an error with the applicable error message if the request was unsuccessful', async () => {
      let logSpy = jest.fn();
      let fetchSpy = jest.fn(() => ({}));
      const services = new Services(utils, logSpy, fetchSpy);

      await services.getServices();
      expect(logSpy).toBeCalledWith(
        chalk.red(
          'Error retrieving services, please ensure all config values are correct: TypeError: request.json is not a function'
        )
      );
    });
  });

  describe('listServices', () => {
    it('logs out the available services', async () => {
      let logSpy = jest.fn();
      let fetchSpy = jest.fn(() => ({
        json: () => ({
          services: serviceData,
        }),
      }));
      const table = new Table();
      const services = new Services(utils, logSpy, fetchSpy);
      await services.listServices();
      serviceData.forEach(service => table.push(service));
      expect(logSpy).toBeCalledWith(table.toString());
    });
  });
});
