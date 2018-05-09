class Utils {
  constructor({ email, apiKey, timeZone }) {
    this.apiKey = apiKey;
    this.email = email;
    this.timeZone = timeZone;
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

  static getMaintenancePayload(maintenanceServices, minutes = 30) {
    const startDate = new Date();
    return {
      maintenance_window: {
        type: 'maintenance_window',
        start_time: startDate,
        end_time: new Date(startDate.getTime() + minutes * 60000),
        services: maintenanceServices,
      },
    };
  }

  buildRequest({ type, maintenanceServices, id, minutes }) {
    const qs = {
      time_zone: this.timeZone,
      filter: 'open',
    };

    const options = {
      ls: {
        path: 'services',
        method: 'GET',
      },
      mw: {
        path: 'maintenance_windows',
        method: 'GET',
      },
      sm: {
        path: 'maintenance_windows',
        method: 'POST',
        payload: () =>
          Utils.getMaintenancePayload(maintenanceServices, minutes),
      },
      em: {
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
        Authorization: `Token token=${this.apiKey}`,
        From: this.email,
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
