class Utils {
  constructor(Config = require('../config/config')) {
    this.config = new Config();
    this.buildRequest = this.buildRequest.bind(this);
  }

  static buildQueryString(qs) {
    if (!qs) return '';

    return Object.entries(qs)
      .reduce((acc, [key, val]) => {
        return `${acc}${key}=${val}&`;
      }, '?')
      .slice(0, -1);
  }

  static getMaintenancePayload(maintenanceServices, duration = 30) {
    const startDate = new Date();
    return {
      maintenance_window: {
        type: 'maintenance_window',
        start_time: startDate,
        end_time: new Date(startDate.getTime() + duration * 60000),
        services: maintenanceServices,
      },
    };
  }

  async buildRequest({ type, maintenanceServices, id, duration }) {
    const userConfig = await this.config.getConfig();
    const config = JSON.parse(userConfig);

    const qs = {
      time_zone: config.timeZone,
      filter: 'open',
      limit: '100',
    };

    const options = {
      services: {
        path: 'services',
        method: 'GET',
      },
      maintenance: {
        path: 'maintenance_windows',
        method: 'GET',
      },
      start: {
        path: 'maintenance_windows',
        method: 'POST',
        payload: () =>
          Utils.getMaintenancePayload(maintenanceServices, duration),
      },
      end: {
        path: `maintenance_windows/${id}`,
        method: 'DELETE',
      },
    };

    const requestOptions = {
      uri: `https://api.pagerduty.com/${
        options[type].path
      }${Utils.buildQueryString(qs)}`,
      method: options[type].method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.pagerduty+json;version=2',
        Authorization: `Token token=${config.apiKey}`,
        From: config.email,
      },
    };

    if (options[type].payload) {
      requestOptions.body = JSON.stringify(options[type].payload());
      requestOptions.json = true;
    }

    return requestOptions;
  }
}

module.exports = Utils;
