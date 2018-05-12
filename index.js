#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');

const help = require('./src/help');
const setConfig = require('./src/setConfig');
const Snooze = require('./src/snooze/snooze');

if (!fs.existsSync(path.join(__dirname, 'config/credentials.json'))) {
  program
    .command('set-config')
    .description('Create the config required to interact with PagerDuty api')
    .option('--apikey <APIKEY>', 'your apiKey')
    .option('--email <EMAIL>', 'your email')
    .option('--timezone <TIMEZONE>', 'your time-zone')
    .action(({ apikey, email, timezone }) => {
      if (apikey && email && timezone) {
        setConfig({ apikey, email, timezone });
      }
    });
} else {
  const snooze = new Snooze();

  program.version('1.0.6', '-v, --version');

  program
    .command('set-config')
    .description(
      'Create the config required to interact with the PagerDuty API'
    )
    .option('--apikey <APIKEY>', 'your apiKey')
    .option('--email <EMAIL>', 'your email')
    .option('--timezone <TIMEZONE>', 'your time-zone')
    .action(({ apikey, email, timezone }) => {
      if (apikey && email && timezone) {
        setConfig({ apikey, email, timezone });
      } else {
        console.log(`
        please ensure you are setting credentials correctly, run --help
        `);
      }
    });

  program
    .command('start')
    .description('Put all services or a particular service into maintenance')
    .option('-a, --all', 'Put all services into maintenance mode')
    .option(
      '-s, --service <SERVICE_NAME>',
      'Put a single service into maintenance mode'
    )
    .option('-d, --duration <min>', 'Specify the duration in minutes.')
    .action(({ all, service, duration }) => {
      if (all) {
        snooze.init({
          option: 'start',
          data: {
            value: 'all',
            duration,
          },
        });
      } else if (service) {
        snooze.init({
          option: 'start',
          data: {
            value: service,
            duration,
          },
        });
      } else {
        console.log(
          'Missing flag, specify if you want to start all services or a single service.'
        );
        program.help();
      }
    });

  program
    .command('end')
    .description(
      'End all maintenance windows or a window containing a particular service'
    )
    .option('-a, --all', 'End all maintenance windows')
    .option(
      '-s, --service <SERVICE_NAME>',
      'End the maintenance window that contains this service'
    )
    .action(({ all, service }) => {
      if (all) {
        snooze.init({
          option: 'end',
          data: {
            value: 'all',
          },
        });
      } else if (service) {
        snooze.init({
          option: 'end',
          data: {
            value: service,
          },
        });
      } else {
        console.log(
          'Missing flag, specify if you want to end all windows or a window for a single service.'
        );
        program.help();
      }
    });

  program
    .command('list')
    .description('List all services or open maintenance windows')
    .option('-s , --services', 'List all your active services in PagerDuty')
    .option('-m , --maintenance', 'List all your open maintenance windows')
    .action(({ services, maintenance }) => {
      if (services) {
        snooze.init({ option: 'services' });
      } else if (maintenance) {
        snooze.init({ option: 'maintenance' });
      } else {
        console.log('Missing flag, specify what you want to list.');
        program.help();
      }
    });
}

program.on('--help', () => help());
program.parse(process.argv);

if (!program.args.length) help();
