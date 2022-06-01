<template>
  <div class="fw-container form">
    <!--公司logo-->
    <div class="header">
      <div class="logo">
        <van-image
          v-if="commonInfo && commonInfo['company_logo_url']"
          :src="commonInfo['company_logo_url']"
          lazy-load
          fit="contain"
        ></van-image>
      </div>
    </div>

    <div class="content">
      <van-form
        ref="form"
        validate-first
        scroll-to-error
        :show-error-message="false"
        validate-trigger="onChange"
        @submit="handleLogin"
        @failed="formValidateToast"
      >
        <!--短信验证码登录-->
        <div v-if="loginType === 'sms'">
          <van-field
            ref="tel"
            v-model="mobile"
            placeholder="请输入手机号"
            clearable
            type="digit"
            maxlength="11"
            class="fw-inline-field round-input pd0"
            :readonly="onlyRead"
            name="mobile"
            :rules="[{ required: true, message: '请输入手机号' }, { validator: validateRules.mobile, message: '请输入正确的手机号' }]"
          >
            <svg-icon slot="left-icon" icon-class="phone-p" />
          </van-field>
          <van-field
            ref="code"
            v-model="code"
            placeholder="短信验证码"
            clearable
            type="digit"
            maxlength="6"
            class="fw-inline-field round-input pd0"
            name="code"
            :rules="[{ required: true, message: '请输入短信验证码' }, { pattern: /^\d{6}$/, message: '请输入6位验证码' }]"
          >
            <svg-icon slot="left-icon" icon-class="comment-p" />
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
            >发送验证码</van-button>
          </van-field>
        </div>

        <!--账号密码登录-->
        <div v-else>
          <van-field
            v-model="user_name"
            placeholder="请输入账号"
            clearable
            class="fw-inline-field round-input pd0"
            :readonly="onlyRead"
            name="user_name"
            :rules="[{ required: true, message: '请输入账号' }]"
          >
            <svg-icon slot="left-icon" icon-class="account-p" />
          </van-field>
          <van-field
            v-model="password"
            placeholder="请输入密码"
            clearable
            :type="pwdType"
            right-icon="eye-o"
            class="fw-inline-field round-input pd0"
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <svg-icon slot="left-icon" icon-class="comment-p" />

            <svg-icon
              v-if="pwdType=='text'"
              slot="right-icon"
              icon-class="eye-open"
              @click="pwdType = 'password'"
            />
            <svg-icon
              v-else
              slot="right-icon"
              icon-class="eye"
              @click="pwdType = 'text'"
            />
          </van-field>
        </div>
      </van-form>

      <!--切换登录方式-->
      <div class="tr">
        <a class="login-type" @click="changeLoginType">{{ typeText }}</a>
      </div>
    </div>

    <!--验证码滑块-->
    <div id="_tc" style="width: 0;height: 0;visibility: hidden;"></div>

    <!--登录按钮-->
    <div class="van-submit-bar pf-form">
      <div class="fw-button-wrap">
        <van-button
          v-if="loginType === 'sms'"
          size="large"
          type="primary"
          class="round"
          @click="$refs.form.submit()"
        >绑定手机号并登录</van-button>
        <van-button
          v-else
          size="large"
          type="primary"
          class="round"
          @click="$refs.form.submit()"
        >登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { mapActions, mapGetters } from 'vuex'
import { objArray2StringArray } from '@/utils'
import { minipSmsCode } from '@/api/user'

export default {
  name: 'Login',
  data () {
    return {
      mobile: '',
      code: '',
      user_name: '',
      company_id: '31',
      password: '',
      onlyRead: false,
      codeRestTime: 0,
      showTimer: false,
      listLoading: false,
      pwdType: 'password',
      loginType: 'sms',
      objArray2StringArray
    }
  },
  computed: {
    ...mapGetters([
      'wxOpenId',
      'commonInfo'
    ]),
    telRight () {
      return /^1[3456789]\d{9}$/.test(this.mobile)
    },
    typeText () {
      return this.loginType === 'sms' ? '账号密码登录' : '短信验证码登录'
    }
  },
  watch: {
    loginType (val) {
      val && this.changeTitle({ password: '账号密码登录', sms: '绑定手机号' }[val])
    }
  },
  created () {
    this.getCompanyInfo()
  },
  methods: {
    ...mapActions({
      login: 'user/login'
    }),
    // 获取公司信息
    getCompanyInfo () {
      store.dispatch('common/getInfo').then(res => {
        this.company_id = res.company_id || ''
      })
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
    // 通过选择的下标获取对应id
    queryIdByIndex (arr, index, key) {
      return arr[index] ? arr[index][key] : ''
    },
    // 登录
    handleLogin () {
      const pwd = this.loginType !== 'sms'

      if (this.listLoading) {
        this.$toast((pwd ? '账号' : '手机号') + '验证中，请稍后...')
        return
      }

      if (pwd) {
        this.showCaptcha('2077116645', (captData) => {
          const fun = () => {
            const data = {
              company_id: this.company_id,
              randstr: captData.randstr,
              ticket: captData.ticket,
              wx_open_id: this.wxOpenId,
              mobile: this.mobile,
              user_name: this.user_name,
              password: this.password,
              $router: this.$router,
              $route: this.$route,
              code: +this.code,
              pwd: pwd
            }
            this.login(data)
          }
          fun()
        })
      } else {
        const fun = () => {
          const data = {
            company_id: this.company_id,
            wx_open_id: this.wxOpenId,
            mobile: this.mobile,
            user_name: this.user_name,
            password: this.password,
            $router: this.$router,
            $route: this.$route,
            code: +this.code,
            pwd: pwd
          }
          this.login(data)
        }
        fun()
      }
    },
    // 发送验证码
    sendVerifyCode () {
      if (!document.getElementById('_tc')) { return }

      this.$refs.form.validate('mobile').then(res => {
        if (this.listLoading) {
          this.$toast('手机号验证中，请稍后...')
          return
        }

        this.showCaptcha('2077116645', (data) => {
          const params = { mobile: this.mobile }
          params.appid = data.appid
          params.randstr = data.randstr
          params.ticket = data.ticket
          params.company_id = this.company_id
          minipSmsCode(params).then(res => {
            if (res.code === 200) {
              this.timerCount()
              this.$toast('验证码已发送')
              this.onlyRead = true
            } else {
              this.$toast(res.msg || '验证码发送失败')
            }
          })
        })
      }).catch(_ => {})
    },
    // 初始化滑块
    showCaptcha (appid, cb) {
      const cc = new window.TencentCaptcha(
        document.getElementById('_tc'),
        appid, // appId
        (res) => {
          if (res.ret === 0) {
            cb && cb(res)
          }
        }
      )
      cc.show()
    },
    // 修改登录类型
    changeLoginType () {
      this.$refs.form.resetValidation()
      this.loginType = this.loginType === 'sms' ? 'password' : 'sms'
    }
  }
}
</script>

<style lang="scss" scoped>
  .fw-container { background: url(~@/assets/image/login-bg.png);background-size: 100%;background-position-y: bottom;background-position-x: 0;background-color: #fff; }
  .header{
    width: 100%;height: 220px;display: flex;justify-content: center;align-items: center;
    .logo{
      height: 60px;
      .van-image {
        height: 100%;
        img{ width: 100%; }
      }
    }
  }
  .van-field__control { text-indent: 10px; }
  .content{
    width: 100%;height: auto;padding: 0 36px 60px;box-sizing: border-box;
    .van-field__left-icon { font-size: 18px;}
    .ipt { background-color: transparent;border-bottom: 0.02667rem solid rgba(188,141,88,1);padding: 0 0 8px 0;font-size: 16px;font-family: PingFangSC-Regular,PingFang SC;font-weight: 400;color: $main-text-color;line-height: 23px; }
  }
  .verify-btn{ padding: 0 5px;border: #fff;font-size: 15px;color: rgba(188,141,88,1);line-height: 23px;width: 110px;height: 40px;background-color: #F7E9DB !important;border-radius: 20px;margin-left: 10px; }
  .fw-button-wrap {
    padding: 20px 36px;margin: 0;
    button { border-radius: 5px; }
  }
  .fw-button-wrap { margin-bottom: 50px; }
  .login-type { font-size: 13px;color: $minor-text-color; }

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
        font-size: 0;
      }
      .van-field__right-icon .svg-icon {
        vertical-align: -6px;
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
        margin-bottom: 19px !important;padding: 0;
        .van-field__body { min-height: 40px;background: rgba(250,250,250,1);border-radius: 20px !important;line-height: 40px;padding: 0 16px !important; }
        .van-field__left-icon { font-size: 20px;margin-right: 10px;margin-top: 10px; }
      }
      .van-cell__right-icon { color: #cccccc; }
    }
  }
</style>
