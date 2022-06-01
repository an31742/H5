<template>
  <div>
    <van-field
      v-model="model[opt.code]"
      clickable
      :name="opt.code"
      class="fw-field bdn light-title"
      input-align="right"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请')"
    >
    </van-field>

    <div class="slot-preview">
      <template v-if="!model[opt.code]">
        <svg-icon icon-class="upload-plus" @click="goSign" />
        <span class="van-uploader__upload-text" @click="goSign">点击进行电子签名</span>
      </template>
      <template v-else>
        <van-image lazy-load fit="cover" :src="model[opt.code]" />
        <a class="re-sign" @click="goSign">重新签名</a>
      </template>
    </div>

    <!--选择签名弹层-->
    <van-popup v-model="popupSignShow" class="form-component fake-popup" :get-container="getBodyContainer">
      <sign ref="sign" @change="confirmSign" @cancel="cancelSign" />
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import sign from './sign/sign'

export default {
  name: 'FwSign',
  components: {
    sign
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
      popupSignShow: false
    }
  },
  methods: {
    // 确认签名
    confirmSign (url) {
      this.popupSignShow = false
      this.$set(this.model, this.opt.code, url)
      this.$set(this.model, this.opt.code + '_img', url)
    },

    // 取消签名
    cancelSign () {
      this.popupSignShow = false
    },

    // 签名弹框
    goSign () {
      if (this.formReadonly(this.opt)) {
        return // 禁用状态
      }

      this.popupSignShow = true

      this.$nextTick(() => {
        this.$refs.sign.show()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .fake-popup {
    border-radius: 0 !important;
  }

  .light-title {
    padding-bottom: 4px !important;margin-bottom: 0 !important;
    background: transparent;
    ::v-deep &.van-field {
      padding-top: 0 !important;
      .van-field__label, .van-field__value {
        font-size: 13px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
        .van-field__control {
          display: none;
        }
      }
      &.van-field--error {
        .van-field__value {
          .van-field__control {
            display: block;
          }
        }
      }
    }
  }

  ::v-deep .slot-preview {
    width: 100%;padding: 10px 16px;background: #fff;box-sizing: border-box;text-align: left;font-size: 0;margin-bottom: 12px;position: relative;font-family: PingFangSC-Regular, PingFang SC;
    .svg-icon {
      font-size: 19px;
      background: #FAF7F4;
      border-radius: 4px;
      padding: 11px;
    }
    .van-uploader__upload-text {
      font-size: 14px;
      font-weight: 400;
      color: #BC8D58;
      line-height: 40px;
      position: absolute;
      display: inline-block;
      width: 200px;
      padding-left: 8px;
      margin-top: 0;
    }

    .van-image {
      width: 40px;
      height: 40px;
    }
    .re-sign {
      font-size: 14px;
      color: #333333;
      line-height: 40px;
      float: right;
    }
  }
</style>
