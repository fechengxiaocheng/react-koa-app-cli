const Metalsmith = require('metalsmith');
const markdown = require('markdown');
Metalsmith(__dirname)
  .use(markdown())
  .use(layouts('handlebars'))
  .build(function(err) {
    if (err) throw err;
    console.log('Build finished!');
  });