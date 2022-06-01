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
          v-model="dateName"
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
      :timeFormat="timeFormat"
      :isMinDate="opt.isMinDate"
      :calendarType="calendarType"
      @confirm="selectDate"
    >
    </SelectDate>
  </div>
</template>

<script>
import mixin from '../mixin'
import SelectDate from './SelectDate'

export default {
  name: 'FwSelectDate',
  components: { SelectDate },
  mixins: [mixin],
  props: {
    calendarType: {
      type: String,
      default: () => 'single'
    },
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    },
    timeFormat: {
      type: String,
      default: () => 'YYYY-MM-DD'
    }
  },
  data () {
    return {
      dateName: ''
    }
  },
  computed: {
    ext () {
      return this.calendarType === 'range' ? '_start_date' : ''
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

      this.dateName = res.str
      // 日期范围
      if (res.arr && res.arr.length) {
        this.$set(this.model, this.opt.code + '_start_date', res.arr[0])
        this.$set(this.model, this.opt.code + '_end_date', res.arr[1])
        this.$set(this.model, this.opt.code + '_desc', this.dateName)
      } else {
        this.$set(this.model, this.opt.code, res.str)
        this.$set(this.model, this.opt.code + '_desc', res.str)
      }
    }
  }
}
</script>
