const routerContext = require.context('./', true, /\.js$/)
const formExtLogic = {}
routerContext.keys().forEach(path => {
  // 如果是根目录的 index.js 、不处理
  if (path.startsWith('./index')) {
    return
  }
  // 提取名称
  const r = /\.\/(.*).js/
  const arr = r.exec(path)
  const name = arr[1]
  const routerModule = routerContext(path)
  formExtLogic[name] = routerModule.default || routerModule
})

export default formExtLogic
