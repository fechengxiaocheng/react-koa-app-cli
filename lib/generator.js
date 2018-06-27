const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync
module.exports = function (metadata = {}, src, dest = '.') {
  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }
  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        // 循环项目中所有的文件files，传入自定义的meta数据，去compile模板，放到destination文件夹中
        Object.keys(files).forEach(fileName => {
          const t = files[fileName].contents.toString()
          files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
        })
        done()
      }).build(err => {
        // compile之后删掉temp文件。
        rm(src)
        err ? reject(err) : resolve()
      })
  })
}