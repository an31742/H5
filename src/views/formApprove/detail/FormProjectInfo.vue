<template>
  <div v-if="groupInfo" class="date-time" style="margin: 0 0 0.32rem 0;">
    <p class="info-title-tips">项目信息</p>

    <FormTextView v-for="(item, index) in columns" :key="index" :model="groupInfo" :opt="item" />

    <!--填写说明-->
    <!--<p v-if="formExtra(opt)" class="form-tips">-->
    <!--{{ formExtra(opt) }}-->
    <!--</p>-->
  </div>
</template>

<script>
import mixin from '../mixin'
import FormTextView from './FormTextView'
import { getWidgetProjectInfo } from '../api'

export default {
  name: 'FormProjectInfo',
  components: { FormTextView },
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
      groupId: '',
      columns: [],
      groupInfo: null
    }
  },
  computed: {

  },
  created () {
    this.generalInfo()
    this.getGroupDetail()
  },
  methods: {
    generalInfo () {
      this.groupId = this.model[this.opt.code]
      const columns = this.opt.props && this.opt.props.columns || []
      this.columns = columns.map((item) => {
        return {
          code: item.key,
          name: item.label,
          type: 'FormInput'
        }
      })
    },

    getGroupDetail () {
      if (!this.groupId) { return }

      getWidgetProjectInfo({ group_id: this.groupId }).then(res => {
        if (res.code === 200 && res.data) {
          this.groupInfo = res.data
          return
        }
        this.$toast(res.msg || '获取项目信息失败')
      })
    }
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

  .info-title-tips {
    font-size: 12px;
    color: #999999;
    line-height: 17px;
    margin: 12px 0 5px 16px;
  }
</style>
