<template>
  <FormPositionView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else class="date-time">
    <!--自动获取-->
    <FormGetPosition v-if="opt.props.dataSource === 1" :model="model" :opt="opt" :defaultValue.sync="defaultValue" />

    <!--手动选点-->
    <FormSelectPosition v-else :model="model" :opt="opt" :defaultValue.sync="defaultValue" />

    <!--填写说明-->
    <p v-if="formExtra(opt)" class="form-tips">
      {{ formExtra(opt) }}
    </p>
  </div>
</template>

<script>
import FormSelectPosition from './common/FormSelectPosition'
import FormGetPosition from './common/FormGetPosition'
import FormPositionView from './detail/FormPosition'
import mixin from './mixin'

export default {
  name: 'FormPosition',
  components: { FormSelectPosition, FormGetPosition, FormPositionView },
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
      defaultValue: []
    }
  },
  created () {
    // 填充默认值
    this.defaultValue = this.formDefaultValue(this.opt, [])
  }
}
</script>
