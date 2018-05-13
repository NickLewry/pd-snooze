const MockDate = require('mockdate');
const Table = require('cli-table');

const Utils = require('../utils/utils');
const Maintenance = require('./maintenance');

describe('Maintenance', () => {
  let utils;
  let logSpy;
  let fetchSpy = jest.fn();

  fetchSpy.mockReturnValue({
    json: () => ({
      services: [
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
      ],
      maintenance_windows: [
        {
          id: '1234',
          start_time: '2018-03-20T16:43:48.851Z',
          end_time: '2018-03-20T17:43:48.851Z',
          services: [
            {
              summary: 'config-service',
            },
          ],
        },
        {
          id: '5678',
          start_time: '2018-03-20T12:43:48.851Z',
          end_time: '2018-03-20T13:43:48.851Z',
          services: [
            {
              summary: 'user-service',
            },
          ],
        },
      ],
    }),
  });

  beforeEach(() => {
    fetchSpy.mockClear();
    logSpy = jest.fn();
    utils = new Utils({
      email: 'test-email',
      apiKey: 'test-apiKey',
      timeZone: 'Europe/London',
    });
  });

  describe('getMaintenanceWindows', () => {
    it('returns an array of open maintenance windows ids', async () => {
      const maintenance = new Maintenance(utils, logSpy, fetchSpy);
      const maintenanceWindowIds = await maintenance.getMaintenanceWindows();
      expect(maintenanceWindowIds).toEqual([
        {
          id: '1234',
          start_time: '2018-03-20T16:43:48.851Z',
          end_time: '2018-03-20T17:43:48.851Z',
          services: [{ summary: 'config-service' }],
        },
        {
          id: '5678',
          start_time: '2018-03-20T12:43:48.851Z',
          end_time: '2018-03-20T13:43:48.851Z',
          services: [{ summary: 'user-service' }],
        },
      ]);
    });
  });

  describe('listMaintenanceWindows', () => {
    it('lists out all open maintenance windows', async () => {
      const table = new Table({
        head: ['Id', 'Services', 'Maintenance-Start', 'Maintenance-End'],
      });
      const maintenance = new Maintenance(utils, logSpy, fetchSpy);
      const maintenanceWindowIds = await maintenance.getMaintenanceWindows();
      await maintenance.listMaintenanceWindows();

      maintenanceWindowIds.forEach(({ id, start_time, end_time, services }) =>
        table.push([
          id,
          services.map(service => service.summary).join(', '),
          start_time,
          end_time,
        ])
      );

      expect(logSpy).toBeCalledWith(table.toString());
    });
  });

  describe('startMaintenance', () => {
    it('starts a maintenance window for all services', async () => {
      const timestamp = new Date('2018-04-20T16:43:48.851Z');
      MockDate.set(timestamp);

      const maintenance = new Maintenance(utils, logSpy, fetchSpy);
      await maintenance.startMaintenance({ value: 'all' });
      expect(fetchSpy).toBeCalledWith(
        'https://api.pagerduty.com/maintenance_windows?time_zone=Europe/London&filter=open',
        {
          body:
            '{"maintenance_window":{"type":"maintenance_window","start_time":"2018-04-20T16:43:48.851Z","end_time":"2018-04-20T17:13:48.851Z","services":[{"id":"config-id","type":"service_reference"},{"id":"analytics-id","type":"service_reference"},{"id":"user-id","type":"service_reference"}]}}',
          headers: {
            Accept: 'application/vnd.pagerduty+json;version=2',
            Authorization: 'Token token=test-apiKey',
            'Content-Type': 'application/json',
            From: 'test-email',
          },
          json: true,
          method: 'POST',
          uri:
            'https://api.pagerduty.com/maintenance_windows?time_zone=Europe/London&filter=open',
        }
      );
    });

    it('starts a maintenance window for a single service', async () => {
      const timestamp = new Date('2018-04-20T16:43:48.851Z');
      MockDate.set(timestamp);

      const maintenance = new Maintenance(utils, logSpy, fetchSpy);
      await maintenance.startMaintenance({ value: 'user-service' });

      expect(fetchSpy.mock.calls.length).toBe(2);
      expect(fetchSpy.mock.calls[1]).toEqual([
        'https://api.pagerduty.com/maintenance_windows?time_zone=Europe/London&filter=open',
        {
          body:
            '{"maintenance_window":{"type":"maintenance_window","start_time":"2018-04-20T16:43:48.851Z","end_time":"2018-04-20T17:13:48.851Z","services":[{"id":"user-id","type":"service_reference"}]}}',
          headers: {
            Accept: 'application/vnd.pagerduty+json;version=2',
            Authorization: 'Token token=test-apiKey',
            'Content-Type': 'application/json',
            From: 'test-email',
          },
          json: true,
          method: 'POST',
          uri:
            'https://api.pagerduty.com/maintenance_windows?time_zone=Europe/London&filter=open',
        },
      ]);
    });
  });

  describe('endMaintenance', () => {
    it('ends all open maintenance windows', async () => {
      const maintenance = new Maintenance(utils, logSpy, fetchSpy);
      await maintenance.endMaintenance({ value: 'all' });

      expect(fetchSpy.mock.calls.length).toBe(3);
      expect(fetchSpy.mock.calls[1]).toEqual([
        'https://api.pagerduty.com/maintenance_windows/1234?time_zone=Europe/London&filter=open',
        {
          headers: {
            Accept: 'application/vnd.pagerduty+json;version=2',
            Authorization: 'Token token=test-apiKey',
            'Content-Type': 'application/json',
            From: 'test-email',
          },
          method: 'DELETE',
          uri:
            'https://api.pagerduty.com/maintenance_windows/1234?time_zone=Europe/London&filter=open',
        },
      ]);

      expect(fetchSpy.mock.calls[2]).toEqual([
        'https://api.pagerduty.com/maintenance_windows/5678?time_zone=Europe/London&filter=open',
        {
          headers: {
            Accept: 'application/vnd.pagerduty+json;version=2',
            Authorization: 'Token token=test-apiKey',
            'Content-Type': 'application/json',
            From: 'test-email',
          },
          method: 'DELETE',
          uri:
            'https://api.pagerduty.com/maintenance_windows/5678?time_zone=Europe/London&filter=open',
        },
      ]);
    });

    it('ends a maintenance window for a specific service', async () => {
      const maintenance = new Maintenance(utils, logSpy, fetchSpy);
      await maintenance.endMaintenance({ value: 'config-service' });

      expect(fetchSpy.mock.calls.length).toBe(2);
      expect(fetchSpy.mock.calls[1]).toEqual([
        'https://api.pagerduty.com/maintenance_windows/1234?time_zone=Europe/London&filter=open',
        {
          headers: {
            Accept: 'application/vnd.pagerduty+json;version=2',
            Authorization: 'Token token=test-apiKey',
            'Content-Type': 'application/json',
            From: 'test-email',
          },
          method: 'DELETE',
          uri:
            'https://api.pagerduty.com/maintenance_windows/1234?time_zone=Europe/London&filter=open',
        },
      ]);
    });
  });
});
