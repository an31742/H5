<template>
  <FormTextView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else class="date-time">
    <!--日期时间-->
    <DateTime
      :model="model"
      :opt="opt"
      @change="change"
    />
    <!--填写说明-->
    <p v-if="formExtra(opt)" class="form-tips">
      {{ formExtra(opt) }}
    </p>
  </div>
</template>

<script>
import FormTextView from './detail/FormTextView'
import DateTime from './common/DateTime'
import mixin from './mixin'

import moment from 'moment'

export default {
  name: 'FormDatetime',
  components: { DateTime, FormTextView },
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
    }
  },
  created () {
  },

  methods: {
    change (val, desc) {
      this.$set(this.model, this.opt.code, val ? moment(val).format() : null)
      this.$set(this.model, this.opt.code + '_desc', desc)
    }
  }
}
</script>
