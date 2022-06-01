<template>
  <div class="date-time">
    <!--自动获取-->
    <FormGetPosition v-if="opt.props && opt.props.dataSource === 1" :model="model" :opt="readOpt" :defaultValue.sync="defaultValue" :isView="true" />

    <!--手动选点-->
    <FormSelectPosition v-else :model="model" :opt="readOpt" :defaultValue.sync="defaultValue" :isView="true" />

    <!--填写说明-->
    <!--<p v-if="formExtra(opt)" class="form-tips">-->
    <!--{{ formExtra(opt) }}-->
    <!--</p>-->
  </div>
</template>

<script>
import FormSelectPosition from '../common/FormSelectPosition'
import FormGetPosition from '../common/FormGetPosition'
import mixin from '../mixin'

export default {
  name: 'FormPosition',
  components: { FormSelectPosition, FormGetPosition },
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
  computed: {
    readOpt () {
      return Object.assign({ visibility: 1 }, this.opt)
    }
  },
  created () {
    // 填充默认值
    this.defaultValue = this.formDefaultValue(this.opt, [])
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .fw-field {
    &.van-cell.van-field {
      padding: 17px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 19px;
      border-bottom: 1px solid #EFEFEF;
      &.rich {
        display: block;
        .van-field__control {
          margin-top: 5px;
        }
        .van-field__label {
          width: 100%;
        }
      }
      .van-field__label {
        color: #333;
      }
      .van-field__control {
        color: #999;
        -webkit-text-fill-color: #999;
      }
    }
  }

  // 只读状态
  .readonly {
    ::v-deep .fw-field.van-field {
      margin-bottom: 0;
    }
  }
</style>
