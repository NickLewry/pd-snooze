const chalk = require('chalk');

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
      chalk.red(
        `Unknown service *** ${name} ***, pass flag --ls to list available services`
      )
    );
  }

  async getServices() {
    const payload = this.utils.buildRequest({ type: 'ls' });
    try {
      const request = await this.fetch(payload.uri, payload);
      const { services } = await request.json();
      return services.map(({ name, id }) => ({ name, id }));
    } catch (e) {
      this.log(chalk.red('Error retrieving services:', e));
    }
  }

  async listServices() {
    const services = await this.getServices();
    this.log(services);
  }
}

module.exports = Services;
