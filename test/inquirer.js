const inquirer  = require('inquirer');

inquirer.prompt([
    {
        name: 'yourName',
        message: 'who are you?',
        default: 'chengxiaocheng',
    },
    {
        name: 'yourAge',
        message: 'how old are you?',
        default: '17',
    },
    {
        name: 'yourAdreess',
        message: 'where are you from?',
        default: 'shanghai',
    }
]).then(answers => {
    console.log('1...',answers);

    inquirer.prompt([
        {
            name: 'niceGirl',
            message: 'are you a nice girl?',
            type: 'confirm',
            default: true
        }
    ]).then(answers => {
        console.log('2...',answers)
    })
})

