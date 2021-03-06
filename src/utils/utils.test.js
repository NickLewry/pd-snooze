const MockDate = require('mockdate');

const Utils = require('./utils');
const Config = require('../config/config');

describe('Utils', () => {
  describe('buildQueryString', () => {
    it(' should build a query string correctly', () => {
      const queryObject = {
        time_zone: 'Europe/London',
        filter: 'open',
        limit: '100',
      };

      expect(Utils.buildQueryString(queryObject)).toBe(
        '?time_zone=Europe/London&filter=open&limit=100'
      );
    });

    it('returns an empty string if no query object provided', () => {
      expect(Utils.buildQueryString()).toBe('');
    });
  });

  describe('getMaintenancePayload', () => {
    it('returns a maintenance payload for the specified services', () => {
      const timestamp = new Date('2018-04-20T16:43:48.851Z');
      MockDate.set(timestamp);
      const startDate = new Date();

      const maintenanceServices = ['firstService', 'secondService'];
      expect(Utils.getMaintenancePayload(maintenanceServices)).toEqual({
        maintenance_window: {
          type: 'maintenance_window',
          start_time: startDate,
          end_time: new Date(startDate.getTime() + 30 * 60000),
          services: maintenanceServices,
        },
      });
    });

    it('returns a maintenance payload for the specified services with a custom minute range', () => {
      const timestamp = new Date('2018-03-20T16:43:48.851Z');
      MockDate.set(timestamp);
      const startDate = new Date();
      const minutes = 20;

      const maintenanceServices = ['firstService', 'secondService'];
      expect(Utils.getMaintenancePayload(maintenanceServices, minutes)).toEqual(
        {
          maintenance_window: {
            type: 'maintenance_window',
            start_time: startDate,
            end_time: new Date(startDate.getTime() + minutes * 60000),
            services: maintenanceServices,
          },
        }
      );
    });
  });

  describe('buildRequest', () => {
    let utils;

    beforeEach(() => {
      utils = new Utils();
      const config = new Config();
      config.setConfig({
        email: 'test-email',
        apikey: 'test-api-key',
        timezone: 'Europe/London',
      });
    });
    it('builds the correct GET request for listing all services', async () => {
      expect(await utils.buildRequest({ type: 'services' })).toEqual({
        headers: {
          Accept: 'application/vnd.pagerduty+json;version=2',
          Authorization: 'Token token=test-api-key',
          'Content-Type': 'application/json',
          From: 'test-email',
        },
        method: 'GET',
        uri:
          'https://api.pagerduty.com/services?time_zone=Europe/London&filter=open&limit=100',
      });
    });

    it('builds the correct GET request for listing all maintenance windows', async () => {
      expect(await utils.buildRequest({ type: 'maintenance' })).toEqual({
        headers: {
          Accept: 'application/vnd.pagerduty+json;version=2',
          Authorization: 'Token token=test-api-key',
          'Content-Type': 'application/json',
          From: 'test-email',
        },
        method: 'GET',
        uri:
          'https://api.pagerduty.com/maintenance_windows?time_zone=Europe/London&filter=open&limit=100',
      });
    });

    it('builds the correct POST request for creating a maintenance window with a stringified payload', async () => {
      const maintenanceServices = [
        {
          name: 'config-service',
          id: 'configServiceId',
        },
        {
          name: 'analytics',
          id: 'analyticsId',
        },
      ];
      expect(
        await utils.buildRequest({ type: 'start', maintenanceServices })
      ).toEqual({
        headers: {
          Accept: 'application/vnd.pagerduty+json;version=2',
          Authorization: 'Token token=test-api-key',
          'Content-Type': 'application/json',
          From: 'test-email',
        },
        json: true,
        method: 'POST',
        uri:
          'https://api.pagerduty.com/maintenance_windows?time_zone=Europe/London&filter=open&limit=100',
        body:
          '{"maintenance_window":{"type":"maintenance_window","start_time":"2018-03-20T16:43:48.851Z","end_time":"2018-03-20T17:13:48.851Z","services":[{"name":"config-service","id":"configServiceId"},{"name":"analytics","id":"analyticsId"}]}}',
      });
    });

    it('builds the correct DELETE request for ending a maintenance window', async () => {
      expect(
        await utils.buildRequest({ type: 'end', id: 'testMaintenaceWindow' })
      ).toEqual({
        headers: {
          Accept: 'application/vnd.pagerduty+json;version=2',
          Authorization: 'Token token=test-api-key',
          'Content-Type': 'application/json',
          From: 'test-email',
        },
        method: 'DELETE',
        uri:
          'https://api.pagerduty.com/maintenance_windows/testMaintenaceWindow?time_zone=Europe/London&filter=open&limit=100',
      });
    });
  });
});
