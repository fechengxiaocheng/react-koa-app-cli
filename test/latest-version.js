const latestVersion = require('latest-version');
 
(async () => {
    console.log(await latestVersion('react-koa-app-cli'));
    //=> '0.18.0'
 
  
})();