// 注册供APP调用事件
export function setupWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }

  window.WVJBCallbacks = [callback]

  const WVframe = document.createElement('iframe')
  WVframe.style.display = 'none'
  WVframe.src = 'https://__bridge_loaded__'
  document.documentElement.appendChild(WVframe)
  setTimeout(() => {
    document.documentElement.removeChild(WVframe)
  }, 0)
}

// 注册返回按钮监听
export function nativeRegisterBack (fun) {
  setupWebViewJavascriptBridge((bridge) => {
    bridge.registerHandler('onBarBackButtonClick', (data, callback) => {
      console.log('这是从APP发送过来的数据', data)
      // type == "native"，走webview系统的返回，直接返回上一页，如果没有上一页，则直接关闭webview
      // type == "block"，什么都不做，一般用于返回确认弹框
      // type == "close"，直接关闭 webview

      const res = fun ? fun() : { type: 'native' }
      callback(res) // 通知APP接下来的动作
    })
  })
}
// 调用APP登录
export function nativeLogin () {
  setupWebViewJavascriptBridge((bridge) => {
    bridge.callHandler('login', (data) => {
      console.log('login', data)
    })
  })
}
