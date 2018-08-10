const chalk = require('chalk');
const Table = require('cli-table');

class Services {
  constructor(
    utils,
    log = require('../utils/log'),
    fetch = require('node-fetch')
  ) {
    this.utils = utils;
    this.log = log;
    this.fetch = fetch;
    this.listServices = this.listServices.bind(this);
    this.getServices = this.getServices.bind(this);
    this.validateService = this.validateService.bind(this);
  }

  validateService(services, name) {
    const validatedService = services
      .map(service => service.name === name && service)
      .filter(x => x);
    if (validatedService[0]) return validatedService;

    this.log(
      chalk.red(`
      Unknown service [${name}], to output available services run: pd-snooze list --services
      `)
    );
  }

  async getServices() {
    const payload = await this.utils.buildRequest({ type: 'services' });
    try {
      const request = await this.fetch(payload.uri, payload);
      const { services } = await request.json();
      return services.map(({ name, id }) => ({ name, id }));
    } catch (e) {
      this.log(
        chalk.red(
          'Error retrieving services, please ensure all config values are correct:',
          e
        )
      );
    }
  }

  async listServices() {
    const table = new Table();
    const services = await this.getServices();
    services.forEach(service => table.push(service));
    this.log(table.toString());
  }
}

module.exports = Services;
