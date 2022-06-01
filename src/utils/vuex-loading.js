/**
 * 在每个action提交的时候改变loading的值，等action处理完成之后在去掉loading状态
 * 相关文档 https://vuex.vuejs.org/zh/api/#subscribeaction
 */
const NAMESPACE = '@@loading'

const createLoadingPlugin = ({
  namespace = NAMESPACE,
  includes = [],
  excludes = []
} = {}) => {
  return store => {
    if (store.state[namespace]) {
      throw new Error(
        `createLoadingPlugin: ${namespace} exited in current store`
      )
    }

    store.registerModule(namespace, {
      namespaced: true,
      state: {
        global: false,
        effects: {

        }
      },
      mutations: {
        SHOW (state, { payload }) {
          state.global = true
          state.effects = {
            ...state.effects,
            [payload]: true
          }
        },
        HIDE (state, { payload }) {
          state.global = false
          state.effects = {
            ...state.effects,
            [payload]: false
          }
        }
      }
    })

    store.subscribeAction({
      before: action => {
        console.log(`before action ${action.type}`)
        if (shouldEffect(action, includes, excludes)) {
          store.commit({ type: namespace + '/SHOW', payload: action.type })
        }
      },
      after: action => {
        console.log(`after action ${action.type}`)
        if (shouldEffect(action, includes, excludes)) {
          store.commit({ type: namespace + '/HIDE', payload: action.type })
        }
      }
    })
  }
}

function shouldEffect ({ type }, includes, excludes) {
  if (includes.length === 0 && excludes.length === 0) {
    return true
  }

  if (includes.length > 0) {
    return includes.indexOf(type) > -1
  }

  return excludes.length > 0 && excludes.indexOf(type) === -1
}

export default createLoadingPlugin
