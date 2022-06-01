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
      placeholder="加班时长自动计算"
      :required="formRequired(opt)"
    >
      <span slot="extra" class="span-extra">小时</span>
    </van-field>
    <p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>
  </div>
</template>

<script>
import moment from 'moment'
import mixin from '../mixin'
import FormTextView from '../detail/FormTextView'
import { getWidgetExtraWorkDuration } from '../api'

export default {
  name: 'FormExtraWorkDuration',
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
      fieldValue: ''
    }
  },
  watch: {
    'model.start_time' () {
      this.getDurationValue()
    },
    'model.end_time' () {
      this.getDurationValue()
    },
    'model.applyLauncher' () {
      this.getDurationValue()
    }
  },
  created () {
    // 填充默认值
    this.init()
  },
  methods: {
    init () {
      if (this.formDefaultValue(this.opt)) {
        const val = this.formDefaultValue(this.opt)

        this.fieldValue = val
        this.$set(this.model, this.opt.code, +val)
      }
    },

    getDurationValue () {
      if (!this.model.start_time || !this.model.end_time) {
        return
      }

      const startTime = moment(this.model.start_time).format()
      const endTime = moment(this.model.end_time).format()
      const params = {
        start_time: startTime,
        end_time: endTime
      }

      getWidgetExtraWorkDuration(params).then(res => {
        if (res.code === 200) {
          const duration = res.data
          this.fieldValue = duration.hours
          this.$set(this.model, this.opt.code, +duration.hours)
          this.$set(this.model, this.opt.code + '_desc', duration.hours + '小时')
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
