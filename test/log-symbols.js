const logSymbols = require('log-symbols');
const chalk = require('chalk');
 
console.log(logSymbols.success, chalk.green('Finished successfully!'));
console.log(logSymbols.info, chalk.rgb(255,255,0).inverse('Finished info!'));
console.log(logSymbols.warning, 'Finished warning!');
console.log(logSymbols.error, chalk.red.bold('Finished error!'));

