// 全局混入mixin
import dayjs from 'dayjs'
import store from '@/store'
import { mapGetters } from 'vuex'
import validateRules from '@/utils/rules'
import { fieldsErrorMsg } from '@/utils/const'
import { supportWebp, getItemByValue } from '@/utils/index'

const globalMixin = {
  data () {
    return {
      validateRules,
      errMsg: fieldsErrorMsg
    }
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ])
  },
  filters: {
    // 重要等级
    careLevel (level) {
      return getItemByValue(store.getters.appConfig.USER_V2_CARE_LEVEL_LIST, level)
    },
    // 残障等级
    disabledLevel (level) {
      return getItemByValue(store.getters.appConfig.USER_V2_DISABLED_LEVEL_LIST, level)
    },
    // 残障部位
    disableCategory (cat) {
      return getItemByValue(store.getters.appConfig.USER_V2_DISABLED_CATEGORY_LIST, cat)
    },
    // 工单状态
    instanceStatus (cat) {
      return getItemByValue(store.getters.appConfig.WFE_FLOW_INSTANCE_STATUS, cat)
    },
    // 工单来源
    instanceSource (source) {
      return getItemByValue(store.getters.appConfig.WFE_FLOW_INSTANCE_SOURCE, source)
    },
    // 计划类型
    projectType (source) {
      return getItemByValue(store.getters.appConfig.DEVICE_PROJECT_LIST, source)
    },
    // 用户身份
    userRole (role) {
      return getItemByValue(store.getters.appConfig.USER_V2_CHECKIN_ROLE_LIST, role) || '-'
    },
    // 时间
    timeFilter (str) {
      return dayjs(str).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted () {
    // 页面mounted的时候去掉beforeEach里面加的全局loading
    store.commit('common/setLoading')
  },
  activated () {
    // 需要在activated钩子里也加去掉loading，因为有些页面是keep-alive的，二次进入页面不会走mounted
    store.commit('common/setLoading')
  },
  methods: {
    // 表单提交按钮验证
    checkFields (params) {
      for (const key in params) {
        if (!params[key] || (Array.isArray(params[key]) && !params[key].length)) {
          return true
        }
      }
      return false
    },
    // 表单校验错误toast提示
    formValidateToast (err) {
      if (err && err.errors && err.errors[0] && err.errors[0].message) {
        this.$toast(err.errors[0].message)
      }
    },
    /*
    * 腾讯云图片加载处理
    *   如果浏览器支持webp，则使用webp格式，否则设定最大宽高为1080
    * */
    cosImage (src) {
      if (!src || src.indexOf('static.gmtech.top') < 0) {
        return src || ' '
      }

      let extra = 'imageMogr2/thumbnail/1080x1080'
      if (this.supportWebp === undefined) {
        this.supportWebp = supportWebp()
      }
      if (this.supportWebp) {
        extra = 'imageView2/format/webp'
      }
      src += src.indexOf('?') > -1 ? '&' : '?'

      return `${src}${extra}`
    },
    // 改变title，由于IOS版微信下，页面加载完成后就不会再监听title改变事件，所以这里用模拟iframe的方法改变title
    changeTitle (title) {
      const iframe = document.createElement('IFRAME')
      iframe.className = 'invisible'
      const body = document.body
      document.title = title

      setTimeout(() => {
        iframe.remove()
      }, 0)
      body.appendChild(iframe)
    },
    // 格式化姓名输入(只支持字母和汉字)
    nameFormatter (str) {
      return str.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '')
    },
    // 兼容时间格式
    compTimeStamp (str) {
      return typeof str === 'string' ? new Date(str).getTime() : str
    },
    // 数组转对象
    arr2obj (arr = [], key = 'value', value = 'label') {
      const obj = {}
      arr.forEach(item => {
        obj[item[key]] = item[value]
      })

      return obj
    },
    // 工单状态
    getAppealStatus (status) {
      const list = store.getters.appConfig['WFE_FLOW_INSTANCE_STATUS']

      return this.arr2obj(list)[status] || ''
    },
    // 有偿工单支付状态
    getAppealPayStatus (status) {
      const list = store.getters.appConfig['WFE_COMPENSATION_PAY_STATE']

      return this.arr2obj(list)[status] || ''
    },

    // 有偿工单订单结算类型
    getPayManner (status) {
      const list = store.getters.appConfig['WFE_COMPENSATION_PAY_MANNER']

      return this.arr2obj(list)[status] || ''
    },
    // 工单动作
    getAppealAction (action) {
      const list = store.getters.appConfig['WFE_LOCUS_ACTION']

      return this.arr2obj(list)[action] || '-'
    },
    // 是否有操作权限
    hasPermission (value) {
      const operationCodeList = store.getters && store.getters.userPermissions

      if (value && value instanceof Array && value.length > 0) {
        const permissionRoles = value

        const hasPermission = (operationCodeList || []).some(role => {
          return permissionRoles.includes(role)
        })

        return !!hasPermission
      }

      return true
    },
    // 格式化开始时间
    formatStartTime (time) {
      const day = dayjs(time).format('YYYY/MM/DD')

      return dayjs(new Date(`${day} 00:00:00`)).format()
    },
    // 格式化结束时间
    formatEndTime (time) {
      const day = dayjs(time).format('YYYY/MM/DD')

      return dayjs(new Date(`${day} 23:59:59`)).format()
    },
    // 遍历子元素
    findChildren (list, key) {
      const arr = []

      const loopFind = (list = [], key = '$children') => {
        for (let i = 0; i < list.length; i++) {
          arr.push(list[i])
          loopFind(list[i][key])
        }
      }

      loopFind(list)

      return arr
    },
    // 自定义弹出框的挂载节点，这里要放到body下，免得被外层覆盖
    getBodyContainer () {
      return window.document.body
    },
    // 数组深拷贝
    copyArray (arr) {
      return JSON.parse(JSON.stringify(arr))
    },
    // 消息时间
    timeHandle (time) {
      const nowDate = dayjs().format('YYYY/MM/DD')
      const today = new Date(`${nowDate} 00:00:00`).getTime()
      const otime = new Date(time).getTime()
      const isToday = (otime - today) / 1000 / 60 / 60

      // 结果
      if (isToday > 0 && isToday <= 24) {
        return `今天 ${dayjs(time).format('HH:mm:ss')}`
      } else if (isToday < 0 && isToday >= -24) {
        return `昨天 ${dayjs(time).format('HH:mm:ss')}`
      } else if (dayjs().format('YYYY') === dayjs(time).format('YYYY')) {
        return dayjs(time).format('MM-DD HH:mm:ss')
      } else {
        return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    // 从url里获取参数
    getQueryString (url, key) {
      let res = url // 默认返回其本身

      try {
        url = new URL(url)
        res = url.searchParams.get(key) || ''
      } catch (e) {}

      return decodeURIComponent(res)
    }
  }
}

export default globalMixin
