const help = () => {
  console.log(`
    
  Options:

    -h, --help            Output usage information
    -v, --version         Output current version
    
  Setup:
  
  example:
    pd-snooze set-config --apiKey example-api-key --email email@company.org --timezone Europe/London
  
  Usage:
    
    pd-snooze set-config --apiKey <APIKEY> --email <EMAIL> --timezone <TIMEZONE>    Sets config
    pd-snooze current-config                                                        Output current config
    pd-snooze list -s || --services                                                 Output available services
    pd-snooze list -m || --maintenance                                              Output open maintenance windows   
    pd-snooze end -a || --all                                                       End all maintenance windows    
    pd-snooze end -s || --service <NAME>                                            End a maintenance window containing the specified service name   
    pd-snooze start -a || --all [-d || --duration <MIN>]                            Put all services into maintenance with optional duration   
    pd-snooze start -s || --service <NAME> [-d || --duration <MIN>]                 Put a single service into maintenance with optional duration
    
`);
};

module.exports = help;
