<template>
  <div>
    <van-field
      v-model="model[opt.code + ext]"
      clickable
      :name="opt.code + ext"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择')"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="dateTimeStr"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectRelatedDate"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择日期弹层-->
    <SelectDate
      ref="sd"
      :optProps="opt.props || {}"
      :timeFormat="timeFormat"
      :isMinDate="opt.isMinDate"
      :initValue="opt.initValue"
      @confirm="selectDate"
    >
    </SelectDate>
    <!--选择时间弹层-->
    <van-popup v-model="popupTimeShow" :get-container="getBodyContainer" position="bottom">
      <SelectTime
        timeType="range"
        :timeSpace="(opt.props && opt.props.particle) || 15"
        :optProps="opt.props"
        :dateStr="dateStr"
        :officeTimeConfig="officeTimeConfig"
        @confirm="selectTime"
        @cancel="popupTimeShow=false"
      ></SelectTime>
    </van-popup>
  </div>
</template>

<script>
import SelectTime from './common/SelectTime'
import SelectDate from './common/SelectDate'
import mixin from './mixin'
import { resetObject } from '../../utils/index'
import { getWidgetCompanyInfo } from './api'
import moment from 'moment'

export default {
  name: 'FwTimeRange',
  components: { SelectTime, SelectDate },
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    },
    ext: {
      type: String,
      default: () => '_start_time'
    },
    timeFormat: {
      type: String,
      default: () => 'YYYY-MM-DD'
    }
  },
  data () {
    return {
      dateStr: '',
      timeArray: [],
      dateTimeStr: '',
      popupTimeShow: false,
      updateTime: false,
      officeTimeConfig: {
        [moment().format('YYYYMMDD')]: [['00:00', '23:59']]
      }
    }
  },
  watch: {
    model: {
      handler (newValue, oldValue) {
        if (this.updateTime) {
          console.log(this.model)
          this.dateTimeStr = newValue[this.opt.code]
        }
        this.updateTime = true
      },
      deep: true
    }
  },
  created () {
    this.dateTimeStr = this.model[this.opt.code]
  },
  async mounted () {
    let limitDays = 30
    if (this.opt.props && this.opt.props.limitDays) {
      limitDays = this.opt.props.limitDays
    }
    if (this.opt.props && this.opt.props.range === 'work_time') {
      for (let i = 0; i < limitDays; i++) {
        this.officeTimeConfig[moment().add(i, 'days').format('YYYYMMDD')] = []
      }
      await this.getWidgetCompanyInfo()
    } else {
      for (let i = 0; i < limitDays; i++) {
        this.officeTimeConfig[moment().add(i, 'days').format('YYYYMMDD')] = [['00:00', '23:59']]
      }
    }
  },
  methods: {
    async getWidgetCompanyInfo () {
      let limit = 30
      if (this.opt.props.limitDays - 1 > 0) {
        limit = this.opt.props.limitDays - 1
      }
      const params = {
        limit: limit
      }
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
    },

    // 选择日期弹框
    selectRelatedDate () {
      this.$refs.sd.show()
    },
    // 选择日期
    selectDate (res) {
      if (!res) { return }

      this.dateStr = res.str

      this.selectRelatedTime()
    },
    // 选择时间弹框
    selectRelatedTime () {
      this.popupTimeShow = true
    },
    // 选择时间
    selectTime (res) {
      this.popupTimeShow = false
      if (!res) { return }
      this.dateTimeStr = `${this.dateStr} ${res.str}`
      if (res.arr) {
        this.$set(this.model, this.opt.code + '_start_time', `${this.dateStr} ${res.arr[0]}`)
        this.$set(this.model, this.opt.code + '_end_time', `${this.dateStr} ${res.arr[1]}`)
      }
      this.$set(this.model, this.opt.code, this.dateTimeStr)
    },
    // 重置时间
    resetTime () {
      this.dateStr = ''
      this.dateTimeStr = ''
      resetObject(this.model)
    }
  }
}
</script>
