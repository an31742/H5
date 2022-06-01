<template>
  <FwSelectTime
    :model="model"
    :opt="opt"
    :timeSpace="(opt.props && opt.props.particle) || 15"
    :optProps="opt.props"
    :officeTimeConfig="officeTimeConfig"
  />
</template>

<script>
import FwSelectTime from './common/FwSelectTime'
import { getWidgetCompanyInfo } from './api'
import moment from 'moment'

export default {
  name: 'FwTime',
  components: { FwSelectTime },
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      officeTimeConfig: {
        [moment().format('YYYYMMDD')]: [['00:00', '23:59']]
      }
    }
  },
  async mounted () {
    console.log('this.opt.props', this.opt.props)
    if (this.opt.props && this.opt.props.range === 'work_time') {
      await this.getWidgetCompanyInfo()
    }
  },
  methods: {
    async getWidgetCompanyInfo () {
      const params = { limit: 0 }
      await getWidgetCompanyInfo(params).then(res => {
        if (res.code === 200 && res.data) {
          const officeTime = res.data.office_time || []
          officeTime.map(item => {
            const workTime = item.office_time || []
            // 必须第一项第二项都存在才是正确的时间配置
            this.officeTimeConfig[item.day] = workTime.filter(item => {
              return item[0] && item[1]
            })
          })
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>
