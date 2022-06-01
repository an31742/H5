<template>
  <div>
    <van-field
      v-model="model[opt.code]"
      clickable
      :name="opt.code"
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
      calendarType="single"
      @confirm="selectDate"
    >
    </SelectDate>

    <!--选择时间弹层-->
    <van-popup v-model="popupTimeShow" class="form-component" :get-container="getBodyContainer" position="bottom">
      <SelectTime
        timeType="single"
        :timeSpace="1"
        :minTime.sync="minTime"
        @confirm="selectTime"
        @cancel="popupTimeShow=false"
      ></SelectTime>
    </van-popup>
  </div>
</template>

<script>
import SelectTime from './common/SelectTime1'
import SelectDate from './common/SelectDate'
import mixin from './mixin'

export default {
  name: 'FwDateTime',
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
    minDateTime: { // 最小可选择的时间
      type: Date,
      default: () => null
    }
  },
  data () {
    return {
      dateStr: '',
      dateTimeStr: '',
      popupTimeShow: false
    }
  },
  computed: {
    minTime () {
      if (!this.dateStr || !this.minDateTime) {
        return '00:00'
      }

      const cp = new Date(this.minDateTime.getTime())
      cp.setHours(0)
      cp.setMinutes(0)
      cp.setSeconds(0)

      const ds = new Date(this.dateStr.replace(/-/g, '/'))
      if (ds > cp) {
        return '00:00'
      }

      return `${this.minDateTime.getHours()}:${this.minDateTime.getMinutes()}`
    }
  },
  methods: {
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
      this.$set(this.model, this.opt.code, this.dateTimeStr)
      this.$set(this.model, this.opt.code + '_desc', this.dateTimeStr)
    }
  }
}
</script>
