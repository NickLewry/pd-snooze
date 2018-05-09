# pd-snooze

A command line tool to put services in and out of maintenance mode in Pager Duty.

### Setup:
```sh
 pd-snooze --setConfig apiKey YOUR_APIKEY email YOUR_EMAIL timeZone YOUR_TIMEZONE     // Sets config to be able to access pager duty api.
```
Example Usage:
```sh
pd-snooze --setConfig apiKey example-api-key email email@company.org timeZone Europe/London
```


### Commands:
```
  --ls                          List all services that are registered with your apiKey on Pager Duty.
  --lm                          List all open maintenance windows.
  --sm                          Starts a maintenance window for all services.
  --sm <service_name>           Starts a maintenance window for the service name provided.
  --em                          Ends all open maintenance windows.
  --em <service_name>           Ends the maintenance window that contains the service name provided.
```

### Additional Flags:
```
-d <min>                      // Sets the duration of the maintenance window in minutes, default is 30.
```
  
Example Usage:
```sh
pd-snooze --sm config-service -d 45     // Puts config-service into a maintenance window for 45min
```
   