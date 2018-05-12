const help = () => {
  console.log(`    
  Setup:
  
    pd-snooze set-config --apiKey example-api-key --email email@company.org --timezone Europe/London
  
  Usage:
  
    pd-snooze list -s || --services                                   List services
    pd-snooze list -m || --maintenance                                List maintenance windows   
    pd-snooze end -a || --all                                         End all maintenance windows    
    pd-snooze end -s || --service <NAME>                              End a maintenance window containing the specified service   
    pd-snooze start -a || --all [-d || --duration <MIN>]              Put all services into maintenance with optional duration   
    pd-snooze start -s || --service <NAME> [-d || --duration <MIN>]   Put a single service into maintenance with optional duration
    
`);
};

module.exports = help;
