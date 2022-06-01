<template>
  <div class="fw-container form bgfff">
    <done ref="done" msg="密码修改成功" style="color: #fff" @over="complete()"></done>

    <div class="header">
      <h4>请设置新密码</h4>
    </div>

    <div class="content">
      <van-form
        ref="form"
        validate-first
        scroll-to-error
        :show-error-message="false"
        @submit="changePwd"
        @failed="formValidateToast"
      >
        <!--手机号-->
        <van-field
          ref="tel"
          v-model="form.mobile"
          placeholder="请输入手机号"
          clearable
          type="digit"
          maxlength="11"
          class="fw-inline-field round-input pd0 full-bg"
          name="mobile"
          :disabled="!!(userData && userData['mobile'])"
          :rules="[{ required: true, message: '请输入手机号' }, { validator: validateRules.mobile, message: '请输入正确的手机号' }]"
        >
          <template #left-icon>
            <span class="tel-pre">+86</span>
          </template>
        </van-field>
        <!--短信验证码-->
        <van-field
          ref="code"
          v-model="form.code"
          placeholder="短信验证码"
          clearable
          type="digit"
          maxlength="6"
          class="fw-inline-field round-input pd0 left-bg"
          name="code"
          :rules="[{ required: true, message: '请输入短信验证码' }, { pattern: /^\d{6}$/, message: '请输入6位验证码' }]"
        >
          <van-button
            v-if="showTimer"
            slot="extra"
            native-type="button"
            class="verify-btn cl-stress"
            size="mini"
            type="info"
          >{{ codeRestTime ? `${codeRestTime}S` : '60S' }}</van-button>
          <van-button
            v-else
            slot="extra"
            native-type="button"
            class="verify-btn cl-stress"
            size="mini"
            type="info"
            @click="sendVerifyCode"
          >短信验证码</van-button>
        </van-field>

        <!--输入新密码-->
        <van-field
          v-model="form.new_password"
          class="fw-inline-field round-input pd0 full-bg"
          clearable
          :type="pwdType2"
          name="new_password"
          placeholder="请输入新密码"
          :rules="[{ required: true, message: '请输入新密码' }, { validator: validateRules.strongPassword, message: '密码必须填写8-16位之间的字符，必须包含字母、数字、符号至少2种' }]"
        >
          <svg-icon
            v-if="pwdType2=='text'"
            slot="right-icon"
            icon-class="eye-open"
            @click="pwdType2 = 'password'"
          />
          <svg-icon v-else slot="right-icon" icon-class="eye" @click="pwdType2 = 'text'" />
        </van-field>

        <!--再次输入新密码-->
        <van-field
          v-model="form.confirm_new_password"
          class="fw-inline-field round-input pd0 full-bg"
          clearable
          :type="pwdType3"
          name="confirm_new_password"
          placeholder="请再次输入新密码"
          :rules="[{ required: true, message: '请再次输入新密码' }, { validator: validateSame, message: '两次输入的密码必须完全一致' }]"
        >
          <svg-icon
            v-if="pwdType3=='text'"
            slot="right-icon"
            icon-class="eye-open"
            @click="pwdType3 = 'password'"
          />
          <svg-icon v-else slot="right-icon" icon-class="eye" @click="pwdType3 = 'text'" />
        </van-field>
      </van-form>
    </div>

    <!--提交-->
    <div class="footer footer--buttons">
      <div class="fw-btm-wrap btn">
        <van-button
          class="round"
          size="large"
          type="primary"
          @click="$refs.form.submit()"
        >确认</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { minipPasswordModifySmsCode, minipPasswordModify, minipPasswordResetSmsCode, minipPasswordReset } from '@/api/user'
import done from '../components/done'
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  name: 'ChangePwd',
  components: { done },
  data () {
    return {
      form: {},
      isReset: true, // 是否是重置
      codeRestTime: 0,
      showTimer: false,
      listLoading: false,
      pwdType2: 'password',
      pwdType3: 'password',
      pwdApi: minipPasswordReset,
      smsApi: minipPasswordResetSmsCode
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  created () {
    if (this.userData && this.userData['mobile']) {
      this.form.mobile = this.userData['mobile']
      this.isReset = false
      this.pwdApi = minipPasswordModify
      this.smsApi = minipPasswordModifySmsCode
    }
  },
  methods: {
    // 修改密码成功
    async complete () {
      await store.dispatch('user/logout', { noRefresh: true })
      this.$router.back()
    },

    // 倒计时
    timerCount () {
      this.showTimer = true
      this.codeRestTime = 60
      let timer = setInterval(() => {
        --this.codeRestTime
        if (!this.codeRestTime) {
          this.showTimer = false
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    },

    // 发送验证码
    sendVerifyCode () {
      this.$refs.form.validate('mobile').then(res => {
        if (this.listLoading) {
          this.$toast('手机号验证中，请稍后...')
          return
        }

        const params = { }
        if (this.isReset) {
          params.mobile = this.form.mobile
        }
        this.smsApi(params).then(res => {
          if (res.code === 200) {
            this.timerCount()
            this.$toast('验证码已发送')
          } else {
            this.$toast(res.msg || '验证码发送失败')
          }
        })
      }).catch(_ => {})
    },

    // 弹层隐藏
    dialogHide () {
      this.form.new_password = ''
      this.form.confirm_new_password = ''
    },

    // 验证两次输入是否一致
    validateSame () {
      return this.form.new_password === this.form.confirm_new_password
    },

    // 修改密码
    changePwd () {
      const params = {
        code: +this.form.code,
        password: this.form.new_password,
        password_repeat: this.form.confirm_new_password
      }

      if (this.isReset) {
        params.mobile = this.form.mobile
      }

      this.pwdApi(params).then(res => {
        this.dialogHide()
        if (res.code === 200) {
          this.$refs.done.show()
          return
        }
        this.$toast(res.msg || '密码修改失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .header, .content {
    padding: 0 38px;
    h4 {
      font-size: 21px;
      margin: 67px 0 43px;
      font-weight: 500;
      line-height: 30px;
    }
  }

  .fw-btm-wrap {
    margin-bottom: 50px;
  }

  .content {
    width: 100%;height: auto;padding: 0 28px 20px;box-sizing: border-box;
    .van-field__left-icon { font-size: 18px;}
    .ipt {
      background-color: transparent;
      border-bottom: 0.02667rem solid rgba(188,141,88,1);
      padding: 0 0 8px 0;
      font-size: 16px;
      font-family: PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      color: $main-text-color;
      line-height: 23px;
    }
    .bound-user {
      .van-image {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        padding-top: 10px;
        padding-bottom: 20px;
      }
      p {
        font-size: 15px;
        color: #354052;
        line-height: 10px;
      }
    }
  }

  .footer--buttons {
    padding-top: 100px;
  }

  .verify-btn{
    padding: 0 5px;
    border: #fff;
    font-size: 15px;
    color: rgba(188,141,88,1);
    line-height: 23px;
    width: 110px;
    height: 40px;
    background-color: #F7E9DB !important;
    border-radius: 20px;
    margin-left: 15px;
  }

  ::v-deep {
    .van-field {
      margin-bottom: 12px;
      .van-cell__title.van-field__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #333333;
        line-height: 24px;
      }
      .van-field__label {
        width: auto;
      }
      .van-field__control {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999999;
        line-height: 20px;
      }
      .van-field__right-icon {
        line-height: 20px;
        .svg-icon {
          vertical-align: -3px;
        }
      }
    }
    .van-cell {
      height: auto;line-height: 23px;padding: 16px 15px;font-size: inherit;
      &.inside { padding: 16px 31px 16px 0;margin-left: 15px; }
      &.wide { background: transparent;margin: 0 0 14px;padding: 0; }
      &:not(:last-child)::after { left: 0;border-bottom: none; }
      &:not(:last-child) { border-bottom: 1px solid #eeeeee; }
      &.bdn::after { left: 0; border-bottom: none; }
      &.bdnafter::after { border-bottom: none; }
      &.round-input {
        margin-bottom: 20px !important;padding: 0;
        .van-field__body { min-height: 40px;background: rgba(250,250,250,1);border-radius: 20px !important;line-height: 40px;padding: 0 !important; }
        .van-field__left-icon { font-size: 20px;margin-right: 10px;line-height: 40px; }
        .tel-pre {
          font-size: 15px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #333333;
          line-height: 40px;
          border-right: 1px solid #eee;
          padding-right: 8px;
        }
      }
      &.full-bg {
        background: #FAFAFA;
        border-radius: 20px;
        padding: 0 10px 0 20px !important;
        &.van-field--error {
          border: 1px solid #FA5151;
          .van-field__body {
            border: none;
          }
        }
      }
      &.left-bg {
        .van-field__body {
          background: #FAFAFA;
          border-radius: 20px !important;
          padding: 0 10px 0 20px !important;
        }
        &.van-field--error {
          .van-field__body {
            border: 1px solid #FA5151;
          }
        }
      }
      .van-cell__right-icon { color: #cccccc; }
    }
  }
</style>
