const path = require('path')
const download = require('download-git-repo')
const ora = require('ora')
module.exports = function (target, url='github:fechengxiaocheng/react-koa-app') {
  target = path.join(target || '.', '.download-temp')
  return new Promise((resolve, reject) => {
     
      const spinner = ora(`The project template is being downloaded, Origin: https://github.com/${url}`)
      spinner.start()
      download(url, target, (err) => {
      if (err) {
            spinner.fail()
            reject(err)
        } else {
          // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
          spinner.succeed([`Congratulations! Download https://github.com/${url} success.`])
          resolve(target)
        }
      })
  })
}