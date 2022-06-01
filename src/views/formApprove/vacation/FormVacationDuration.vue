<template>
  <FormTextView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else style="text-align: left;">
    <van-field
      v-model="fieldValue"
      class="fw-field bdn"
      input-align="right"
      :name="opt.code"
      :label="formLabel(opt)"
      :disabled="true"
      :maxlength="formMaxLength(opt)"
      placeholder="时长自动根据开始结束时间计算"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择', true)"
    >
      <span v-if="currentUnit" slot="extra" class="span-extra">{{ getUnitText(currentUnit) }}</span>
    </van-field>
    <p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>
  </div>
</template>

<script>
import moment from 'moment'
import mixin from '../mixin'
import { VacationUnit } from '@/utils/const'
import FormTextView from '../detail/FormTextView'
import { getWidgetVacationDuration } from '../api'
import { getItemByValue } from '@/utils/index'
import { mapGetters } from 'vuex'

export default {
  name: 'FormVacationDuration',
  components: {
    FormTextView
  },
  mixins: [mixin],
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
      unit: '小时',
      fieldValue: '',
      vacation: {},
      currentUnit: this.opt.props.unit
    }
  },
  computed: {
    ...mapGetters([ 'userData' ])
  },
  watch: {
    'model.start_time' () {
      this.getDurationValue()
    },
    'model.end_time' () {
      this.getDurationValue()
    },
    'model.unit' (val) {
      this.currentUnit = val
      this.getDurationValue()
    },
    'model.applyLauncher' (val) {
      this.getDurationValue()
    }
  },
  created () {
    // 填充默认值
    this.init()

    this.$watch(`model.${this.opt.code}`, (val, old) => {
      this.fieldValue = parseInt(val || 0)
    })
  },
  methods: {
    init () {
      if (this.formDefaultValue(this.opt)) {
        const val = this.formDefaultValue(this.opt)

        this.fieldValue = val
        this.$set(this.model, this.opt.code, +val)
        if (this.model.unit) {
          this.currentUnit = this.model.unit
        }
      }
    },

    getUnitText (unit) {
      return getItemByValue(VacationUnit, unit)
    },
    getDurationValue () {
      if (!this.model.start_time ||
          !this.model.end_time ||
          !moment(this.model.start_time).isValid() ||
          !moment(this.model.end_time).isValid()
      ) {
        return
      }
      const startTime = moment(this.model.start_time).format()
      const endTime = moment(this.model.end_time).format()
      const params = {
        start_time: startTime,
        end_time: endTime,
        unit: this.currentUnit,
        staff_id: this.model.applyLauncher || this.userData.staff_id
      }

      getWidgetVacationDuration(params).then(res => {
        if (res.code === 200) {
          const duration = res.data
          const unitText = this.getUnitText(this.currentUnit)
          if (unitText === '小时') {
            this.fieldValue = duration.hours
            this.$set(this.model, this.opt.code, parseInt(duration.hours))
            this.$set(this.model, this.opt.code + '_desc', duration.hours + unitText)
          }
          if (unitText === '天') {
            this.fieldValue = duration.days
            this.$set(this.model, this.opt.code, parseInt(duration.days))
            this.$set(this.model, this.opt.code + '_desc', duration.days + unitText)
          }
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep {
    .van-field {
      .van-field__control {
        line-height: inherit !important;
      }
    }
    .van-field__error-message {
      text-align: right;
      opacity: .6;
    }
    .van-field--error {
      &.van-field {
        .van-field__control {
          color: red;
        }
      }
    }
    .span-extra {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      padding-left: 10px;
    }
  }
</style>
