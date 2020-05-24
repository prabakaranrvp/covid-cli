const chalk = require('chalk');
const log = console.log;

var showLocations = function(arrLocations) {
  var countryCodes = [];
  log(chalk.bold.underline('Country Codes'))

  arrLocations.forEach(location => {

    if(!countryCodes.includes(location.country_code)) {
      log(location.country + ' : ' + chalk.bold(location.country_code));
      countryCodes.push(location.country_code);
    }
    
  });

  log('\n');
  log('To get more information on a country, use ' + chalk.bold('covid -c <country_code>'));
}

module.exports = showLocations;