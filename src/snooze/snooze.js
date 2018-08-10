class Snooze {
  constructor(
    Utils = require('../utils/utils'),
    Services = require('../services/services'),
    Maintenance = require('../maintenance/maintenance')
  ) {
    this.utils = new Utils();
    this.Services = new Services(this.utils);
    this.Maintenance = new Maintenance(this.utils);
    this.handlers = {
      end: this.Maintenance.endMaintenance,
      start: this.Maintenance.startMaintenance,
      services: this.Services.listServices,
      maintenance: this.Maintenance.listMaintenanceWindows,
    };
  }

  init({ option, data }) {
    if (option && this.handlers[option]) {
      this.handlers[option](data);
    }
  }
}

module.exports = Snooze;
