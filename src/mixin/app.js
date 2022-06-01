// 全局混入mixin，支持app
const appMixin = {
  created () {
    // 是这样，本来应该在每个页面都注入返回事件监听，如果放在这里，页面里每个小组件created的时候都会执行
    // 所以，把注册返回监听事件的动作写到permission.js里的router.afterEach钩子函数里，保证每个页面只调用一次

    // 默认情况下，返回事件监听里，是把返回按钮交给原生APP处理（有上一页则返回上一页，没有则关闭webview）
    // 如果想要在某个页面改变这种默认行为，比如工单填写页点返回，会让用户弹框二次确认。可以在该页面的mounted方法里面重写nativeRegisterBack

    // 文档地址：http://192.168.235.7:8090/pages/viewpage.action?pageId=20450412
  },
  mounted () {
    if (this.$router) {
      this.$router.back = this.nativeBack
    }
  },
  methods: {
    // 注册返回按钮监听
    // 这里的fun会返回一个对象{type: 'xxx'}，用于告诉APP该执行哪种操作，具体含义见方法体内的注释
    nativeRegisterBack (fun) {
      this.setupWebViewJavascriptBridge((bridge) => {
        bridge.registerHandler('onBarBackButtonClick', (data, callback) => {
          console.log('这是从APP发送过来的数据', data)

          // type == "native"，走webview系统的返回，直接返回上一页，如果没有上一页，则直接关闭webview
          // type == "block"，什么都不做，一般用于返回确认弹框
          // type == "close"，直接关闭 webview

          const res = fun ? fun() : { type: 'native' }
          callback(res) // 通知APP接下来的动作
        })
      })
    },

    // 调用APP关闭webview
    nativeCloseWebView (cb) {
      this.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('closeWebView', (data) => {
          console.log('closeWebView', data)
          cb && cb(data)
        })
      })
    },

    // 调用APP返回上一页，如果没有上一页，直接关闭webview
    nativeBack (cb) {
      this.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('returnToThePreviousPage', (data) => {
          console.log('returnToThePreviousPage', data)
          cb && cb(data)
        })
      })
    },

    // 调用APP扫码
    nativeScanQRcode (cb) {
      this.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('scanQRcode', (data) => {
          console.log('scanQRcode', data)
          cb && cb(data)
        })
      })
    },

    // 调用APP获取位置
    nativeGetLocation (cb) {
      this.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('getLocation', (data) => {
          console.log('getLocation', data)
          cb && cb(data)
        })
      })
    },

    // 调用APP登录
    nativeLogin () {
      this.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('login', (data) => {
          console.log('login', data)
        })
      })
    },

    // 调用APP下载工单
    downloadWorkorder (params, cb) {
      this.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('downloadWorkorder', params, (data) => {
          console.log('download', data)
          cb && cb(data)
        })
      })
    },
    // 调用APP下载工单
    toOfflineCenter () {
      this.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('toOfflineCenter', (data) => {
          console.log('跳转至工单中心')
        })
      })
    },

    // 注册供APP调用事件
    setupWebViewJavascriptBridge (callback) {
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

  }
}

export default appMixin
