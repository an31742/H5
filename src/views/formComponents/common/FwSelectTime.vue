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
          v-model="timeStr"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectRelatedTime"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择日期弹层-->
    <van-popup v-model="popupTimeShow" :get-container="getBodyContainer" position="bottom">
      <SelectTime
        :timeType="timeType"
        :timeSpace="timeSpace"
        :optProps="opt.props"
        :officeTimeConfig="officeTimeConfig"
        @confirm="selectTime"
        @cancel="popupTimeShow=false"
      ></SelectTime>
    </van-popup>
  </div>
</template>

<script>
import mixin from '../mixin'
import SelectTime from './SelectTime'

export default {
  name: 'FwSelectTime',
  components: { SelectTime },
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
    timeSpace: {
      type: Number,
      default: () => 15
    },
    timeType: {
      type: String,
      default: () => 'range'
    },
    optProps: {
      type: Object,
      default: () => {}
    },
    officeTimeConfig: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      timeStr: '',
      timeArray: [],
      popupTimeShow: false
    }
  },
  watch: {
    model: {
      handler (newValue, oldValue) {
        this.timeStr = newValue[this.opt.code]
      },
      deep: true
    }
  },
  methods: {
    // 选择日期弹框
    selectRelatedTime () {
      this.popupTimeShow = true
    },
    // 选择日期
    selectTime (res) {
      this.popupTimeShow = false

      if (!res) { return }
      this.timeStr = res.str
      if (res.arr && res.arr.length) {
        this.timeArray = res.arr
      }
      this.$set(this.model, this.opt.code, res.str)
      this.$set(this.model, this.opt.code + '_desc', this.timeStr)
    }
  }
}
</script>
