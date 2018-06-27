#!/usr/bin/env node

const program = require('commander')

const path = require('path')
const fs = require('fs')
const glob = require('glob')
const download = require('../lib/download')
const generator = require('../lib/generator')
const inquirer = require('inquirer')
const chalk = require('chalk')
const logSymbols = require('log-symbols')

program.usage('<project-name>').parse(process.argv)
// 根据输入，获取项目名称
let projectName = program.args[0]

if (!projectName) { // project-name 必填
    // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
    program.help()
    return
}
const list = glob.sync('*') // 遍历当前目录
let rootName = path.basename(process.cwd())
console.log('rootName......',rootName);

let next = undefined

if (list.length) { // 如果当前目录不为空
    if (list.filter(name => {
            const fileName = path.resolve(process.cwd(), path.join('.', name))
            
            const isDir = fs.statSync(fileName).isDirectory()
            // 要init的文件名如果和list循环中的文件名一样，且这个是个文件夹的话，就返回true，表示已有这个文件。
            return name.indexOf(projectName) !== -1 && isDir
        }).length !== 0) {
            console.log(`The project ${projectName} has already existed.`)
        return
    }
    next = Promise.resolve(projectName)
} else if (rootName === projectName) {
    // 当前目录为空&&创建的目录名和当前目录一样时，直接把当前目录当作项目根目录
    next = inquirer.prompt([
        {
        name: 'buildInCurrent',
        message: 'The current directory is empty, and the directory name is the same as the project name. Do you want to create new project directly under the current directory?', // 当前目录为空，且目录名称和项目名称相同，是否直接把当前目录作为新项目根目录？
        type: 'confirm',
        default: true
        }
    ]).then(answer => {
        return Promise.resolve(answer.buildInCurrent ? '.' : projectName)
    })
} else {
    next = Promise.resolve(projectName)
}
next && go()

function go() {
    next.then(projectRoot => {
        
        if (projectRoot !== '.') {
            fs.mkdirSync(projectRoot)
        }
        console.log('~~~~~~~~~~~~~~~~projectRoot~~~~~~~~~~~~~',projectRoot);
        return download(projectRoot).then(target => {
            return {
                name: projectRoot, // my-app
                root: projectRoot, // my-app
                downloadTemp: target // my-app/.download-temp
            }
        })
    }).then(context => {
       
        return inquirer.prompt([
        {
            name: 'projectName',
            message: 'Project Name',
            default: context.name
        }, {
            name: 'projectVersion',
            message: 'project Version',
            default: '1.0.0'
        }, {
            name: 'projectDescription',
            message: 'Project Description',
            default: `A project named ${context.name}`
        }
        ]).then(answers => {
            return {
                ...context,
                metadata: {
                    ...answers
                }
            }
        })
    }).then(context => {
        /*  context = { 
            name: 'my-app',
            root: 'my-app',
            downloadTemp: 'my-app/.download-temp',
            metadata:
            { 
                projectName: 'my-app',
                projectVersion: '1.0.0',
                projectDescription: 'A project named my-app' 
            } 
        } */
        // 添加生成的逻辑
        return generator(context.metadata, context.downloadTemp, context.root)
    }).then(context => {
        console.log(logSymbols.success, chalk.green('创建成功:)'))
        console.log()
        console.log(chalk.green(`cd ${projectName}\nnpm install\nnpm run dev`))
    }).catch(err => {
        console.error(logSymbols.error, chalk.red(`创建失败：${error.message}`))
    })
}