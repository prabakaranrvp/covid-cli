#!/usr/bin/env node

const chalk = require('chalk');
const yargs = require('yargs');
const axios = require('axios');
const boxen = require("boxen");
const log = console.log;
var showLocations = require('./locations.js');

const baseUrl = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations';

const newLine = function() { log('\n'); }
const title = chalk.bold.underline('COVID 19 Latest Updates:');

const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: "round",
  borderColor: "green",
  // backgroundColor: "#555555"
 };

const options = yargs
//  .usage("Usage:")
 .option("l", { alias: "location", describe: "List all country codes" })
 .option("c", { alias: "country", describe: "Get updates on specific country code", type: 'string'})
 .argv;

newLine();
log(title);
newLine();

log(chalk.dim('fetching info...'));

if(options.country) {
  axios.get(baseUrl + `?country_code=${options.country}`, { headers: { Accept: "application/json" } })
    .then(res => {
      log(chalk.green.dim('Fetch Success\n'));
      
      var lastUpdated = new Date(res.data.locations[0]['last_updated']);
      log(chalk.green.dim(`Last updated on ${lastUpdated.toString()}`))
      logUpdate(res.data.latest, res.data.locations[0]['country']);
    })
    .catch(error => {
      var errorMessage;
      if(error.response && error.response.status === 404)
        errorMessage = `Invalid country code ${options.country}`;
      else
        errorMessage = `Oops! something is definietly wrong. Please try again later`;
      
      log(chalk.red(errorMessage));
    });
}
else {
  axios.get(baseUrl, { headers: { Accept: "application/json" } })
    .then(res => {
      log(chalk.green.dim('Fetch Success\n'));
      if(options.location){
        log('listing all available locations');
        showLocations(res.data.locations);
      }
      else {
        var { latest } = res.data;
        logUpdate(latest, 'World');
      }
    });
}


function logUpdate(latest, title) {
  var message = chalk.bold.underline(title + ':');
  message += `\nConfirmed Cases: ${chalk.bold.green(latest.confirmed.withCommas())}`;
  message += `\nTotal Deaths: ${chalk.bold.green(latest.deaths.withCommas())}`;

  var msgBox = boxen( message, boxenOptions );
  log(msgBox);
}

String.prototype.withCommas = function() {
  return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

Number.prototype.withCommas = function() {
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}