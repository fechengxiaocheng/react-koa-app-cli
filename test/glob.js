const glob = require('glob');

const list = glob.sync('lib/*.js')

console.log(list);