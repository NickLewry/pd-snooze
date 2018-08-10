const chalk = require('chalk');
const Table = require('cli-table');

class MaintenanceHandler {
  constructor(
    utils,
    log = require('../utils/log'),
    fetch = require('node-fetch'),
    Services = require('../services/services')
  ) {
    this.utils = utils;
    this.log = log;
    this.fetch = fetch;
    this.services = new Services(utils, log, fetch);
    this.endMaintenance = this.endMaintenance.bind(this);
    this.startMaintenance = this.startMaintenance.bind(this);
    this.listMaintenanceWindows = this.listMaintenanceWindows.bind(this);
  }

  async getMaintenanceWindows() {
    const payload = await this.utils.buildRequest({ type: 'maintenance' });
    const request = await this.makeRequest(payload.uri, payload);

    if (request && request.json) {
      const response = await request.json();
      return response.maintenance_windows;
    }
  }

  async listMaintenanceWindows() {
    const table = new Table({
      head: ['Id', 'Services', 'Maintenance-Start', 'Maintenance-End'],
    });
    const windows = await this.getMaintenanceWindows();
    if (!windows.length) {
      this.log(`
        No open maintenance windows
      `);
    } else {
      windows.forEach(({ id, start_time, end_time, services }) =>
        table.push([
          id,
          services.map(service => service.summary).join(', '),
          start_time,
          end_time,
        ])
      );

      this.log(table.toString());
    }
  }

  async startMaintenance({ value, duration }) {
    const services = await this.services.getServices();
    const servicesPayload =
      value === 'all'
        ? services
        : this.services.validateService(services, value);

    if (!servicesPayload) return;

    const maintenancePayload = await this.utils.buildRequest({
      duration,
      type: 'start',
      maintenanceServices: servicesPayload.map(({ id }) => ({
        id,
        type: 'service_reference',
      })),
    });

    await this.makeRequest(maintenancePayload.uri, maintenancePayload);
  }

  async endMaintenance({ value }) {
    const maintenanceWindows = await this.getMaintenanceWindows();
    let openWindows = maintenanceWindows;

    if (value !== 'all') {
      const mappedWindows = maintenanceWindows.map(({ id, services }) => ({
        id,
        name: services[0].summary,
      }));
      openWindows = this.services.validateService(mappedWindows, value);
      if (!openWindows) return;
    }

    if (!openWindows.length) {
      this.log(`
        No open maintenance windows
      `);
      return;
    }

    await Promise.all(
      openWindows.map(async ({ id }) => {
        const maintenancePayload = await this.utils.buildRequest({
          type: 'end',
          id,
        });
        return await this.makeRequest(
          maintenancePayload.uri,
          maintenancePayload
        );
      })
    );
  }

  async makeRequest(uri, payload) {
    try {
      return await this.fetch(uri, payload);
    } catch (e) {
      return this.log(chalk.red('Error making request: ', e));
    }
  }
}

module.exports = MaintenanceHandler;
