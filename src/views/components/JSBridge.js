//
// // 这里导出 JSBridge
// import {
//   isIOS,      // 是否在 iOS 中，这里的判断逻辑需要你自己去写，下面几个同样如此
//   isAndroid,  // 是否在 Android 中
//   isApp,      // 是否在 App 中
//   hasBridge   // 是否在 是否存在 bridge 中
// } from './utils/index'
// const JSBridge = {
//   /**
//    * 调用app方法
//    * @param event：事件名称
//    * @param data：json数据
//    * @param successCallBack: 主动设置成功回掉
//    * @param failCallBack: 主动设置失败回掉
//    * @returns {Promise<object>}
//    */
//   callApp (event, data = {}) {
//     return new Promise((resolve, reject) => {
//       // 没有 JSBridge 或者不在 App 中，不做操作
//       if (!hasBridge || !isApp) {
//         resolve('not in app or not has JSBridge')
//         return
//       }
//
//       // 设置回调方法
//       const callbackKey =
//         Date.now() + '' + Math.floor(Math.random() * 100000)
//       window.callBackList = window.callBackList || []
//       window.callBackList.push(callbackKey)
//       const successName = `s${callbackKey}`
//       const failName = `f${callbackKey}`
//
//       // 使用生成的 回调名 在全局注册成功/失败的回调函数，以便 App 调用
//       window[successName] = function (data) {
//         isAndroid && (data = JSON.parse(data))
//         if (data.code === -1) {
//           reject(data)
//         } else {
//           resolve(data.data)
//         }
//       }
//       window[failName] = function (err) {
//         isAndroid && (err = JSON.parse(err))
//         reject(err)
//       }
//
//       // 安卓与 iOS 调用方式不一样
//       // 安卓
//       if (isAndroid) {
//         // 传递字符串到 安卓
//         data = JSON.stringify(data)
//         window.JSActionBridge.handlerAction(
//           event,
//           data,
//           successName,
//           failName
//         )
//       }
//
//       // iOS
//       if (isIOS) {
//         window.webkit.messageHandlers.JSActionBridge.postMessage({
//           method: 'handlerAction',
//           data: {
//             actionEvent: event,
//             paramsJsonValue: data,
//             successCallback: successName,
//             errorCallback: failName
//           }
//         })
//       }
//     })
//   }
// }
// export default JSBridge
