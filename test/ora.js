const ora = require('ora')
const spinner = ora('loading......').start();
setTimeout(() => {
    spinner.color = 'red'
    spinner.text = 'loading hello chengxiaocheng'
},1000)
setTimeout(() => {
    spinner.succeed(['succuss loading...']);
},2000)