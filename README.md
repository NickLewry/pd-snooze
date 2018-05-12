# pd-snooze

A command line tool to put services in and out of maintenance mode in PagerDuty.

### Requirements:
**Node version: >= 8.**

### Setup:
```
 pd-snooze set-config --apiKey YOUR_APIKEY --email YOUR_EMAIL --timezone YOUR_TIMEZONE
```


### Commands:
```
set-config [options]    Create the config required to interact with the PagerDuty API.
list [options]          Output all services or open maintenance windows.
start [options]         Put all services or a particular service into maintenance mode.
end [options]           End all maintenance windows or a maintenance window containing a particular service.
```

### Additional Flags:
```
-d <min>    Sets the duration of the maintenance window in minutes, default is 30.
```
#### Output current version:
```
pd-snooze -v || --version

```
#### Output help:
```
pd-snooze -h || --help

```
### Set config:
```
pd-snooze set-config --apiKey example-api-key --email email@company.org --timezone Europe/London
```
### Example Usage:
#### Output current config:
```
pd-snooze current-config

```
#### Output services:
```
pd-snooze list -s || --services

```
#### Output open maintenance windows:
```
pd-snooze list -m || --maintenance

```
#### Put all services into maintenance:
```
pd-snooze start -a || --all [-d || --duration <MIN>]

```
#### Put a single service into maintenance:
```
pd-snooze start -s || --service <SERVICE_NAME> [-d || --duration <MIN>]

```
#### End all maintenance windows:
```
pd-snooze end -a || --all

```
#### End a maintenance window containing the specified service:
```
pd-snooze end -s || --service <SERVICE_NAME>

```
   