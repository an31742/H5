<template>
  <div class="fw-container flex-column">
    <!--表单-->
    <van-form
      ref="form"
      class="expand"
      validate-first
      scroll-to-error
      :show-error-message="false"
      @submit="handleSubmit"
    >
      <!--动态表单-->
      <fc ref="fc" :model="formModel" :options="options" />
    </van-form>

    <!--提交按钮-->
    <div class="pf-form" style="position: relative;">
      <div class="btn btn-save">
        <van-button
          type="primary"
          round
          class="btn-item confirm"
          @click="$refs.form && $refs.form.submit()"
        >
          完成
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { updateNodeInstanceForm } from '@/api/wfe'
import fc from '../formComponents/index'
import { string2obj } from '@/utils/index'
import { mapState } from 'vuex'

export default {
  name: 'WfeInstanceLaunch',
  components: { fc },
  data () {
    return {
      options: [],
      formModel: {},

      btns: [{
        act: 'NEXT',
        name: '完成'
      }],
      orderDetail: {},
      orderId: this.$route.query.id || ''
    }
  },
  computed: {
    ...mapState({
      node_data: state => state.workorder.node_data
    }),
    // 回退按钮
    backBtn () {
      return this.btns.find(item => item.act === 'BACK')
    },
    // 流转按钮
    nextBtn () {
      return this.btns.find(item => item.act === 'NEXT')
    }
  },
  created () {
    console.log(this.node_data)
    this.getOrderDetail()
  },
  methods: {
    // 获取节点表单
    getOrderDetail () {
      this.orderDetail = this.node_data || {}
      const formModel = string2obj(this.orderDetail['form_data']) || {}
      const options = formModel.frontFormLabels || []
      this.formModel = formModel
      this.options = options.map(item => {
        item.code = item.code.toLowerCase()
        // item.user_id = launcher
        return item
      })
    },
    async handleSubmit () {
      console.log(this.formModel)
      // 判断是否有图片在上传中
      let comps = this.findChildren(this.$children)
      comps = comps.filter(item => item.$options.name === 'UploadComponent' && item.loading)
      if (comps && comps.length) {
        this.$toast('请等待图片上传完成')
        return
      }

      // 传到接口，方便查看详情的时候直接取字段 和 表单项顺序问题
      const ffl = this.options.map(item => {
        return { name: item.name, code: item.code, type: item.type, props: item.props || {} }
      })
      this.formModel.frontFormLabels = ffl
      console.log(this.options)
      const params = {
        form: this.formModel,
        node_instance_id: this.node_data.node_instance_id
      }

      const res = await updateNodeInstanceForm(params)
      if (res.code === 200) {
        this.$toast('提交成功')
        this.$router.back()
        return
      }
      this.$toast(res.msg || '提交失败')
    }
  }
}
</script>

<style scoped lang="scss">
  .expand {
    margin-top: 12px;
  }
  .fw-btm-wrap {
    padding: 16px 36px;
  }
  .btn-save {
    padding: 16px 0;
    text-align: center;
    .btn-item {
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #E1AA6C;
      line-height: 25px;
      border-radius: 20px;
      border: 1px solid;
      padding: 7px 0;
      width: 141px;
      display: inline-block;
      &.confirm {
        background: linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%);
        color: #FFFFFF;
        margin-left: 18px;
      }
    }

    ::v-deep .van-button__text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  ::v-deep .van-field {
    margin-bottom: 12px;
    .van-cell__title.van-field__label {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #333333;
      line-height: 24px;
    }
    .van-field__control {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #999999;
      line-height: 20px;
    }
    .van-field__right-icon {
      line-height: 20px;
      font-size: 0;
    }
    .van-field__right-icon .svg-icon {
      vertical-align: -6px;
    }
  }
</style>
