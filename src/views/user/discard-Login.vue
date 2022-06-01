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

    <template v-if="!loginByWx">
      <!--登录表单-->
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
              class="fw-inline-field round-input pd0 full-bg"
              :readonly="onlyRead"
              name="mobile"
              :rules="[{ required: true, message: '请输入手机号' }, { validator: validateRules.mobile, message: '请输入正确的手机号' }]"
            >
              <!--<svg-icon slot="left-icon" icon-class="phone-p" />-->
              <template #left-icon>
                <span class="tel-pre">+86</span>
              </template>
            </van-field>
            <van-field
              ref="code"
              v-model="code"
              placeholder="短信验证码"
              clearable
              type="digit"
              maxlength="6"
              class="fw-inline-field round-input pd0 left-bg"
              name="code"
              :rules="[{ required: true, message: '请输入短信验证码' }, { pattern: /^\d{6}$/, message: '请输入6位验证码' }]"
            >
              <!--<svg-icon slot="left-icon" icon-class="comment-p" />-->
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
              class="fw-inline-field round-input pd0 full-bg"
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
              class="fw-inline-field round-input pd0 full-bg"
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
            <div class="login-type tr" style="margin: -0.16rem 0.48rem -0.26rem 0;" @click="$router.push({name: 'ChangePwd'})">忘记密码</div>
          </div>
        </van-form>
      </div>

      <!--登录按钮-->
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

      <!--切换登录方式-->
      <div class="tc">
        <a class="login-type" @click="changeLoginType">{{ typeText }}</a>
      </div>

      <!--隐私协议-->
      <div class="fixed-bottom tc terms">
        <!--微信登录方式-->
        <svg-icon v-if="hasBoundedWeiXin || loginByWx" icon-class="wx" class="big-icon" @click="loginByWx=!loginByWx" />
        <!--同意协议-->
        <van-checkbox v-model="hasAgreeTerms" icon-size="12px" class="tc">
          <template #icon="props">
            <svg-icon v-if="props.checked" icon-class="ckb-on" />
            <svg-icon v-else icon-class="ckb" />
          </template>
          <div class="flex van-cell--center">
            登录即同意<a>《用户协议》</a>和<a>《隐私协议》</a>
          </div>
        </van-checkbox>
      </div>
    </template>

    <!--微信快捷登录-->
    <template v-else>
      <!--绑定的账号信息-->
      <div class="content">
        <div class="bound-user tc">
          <van-image
            class="bg"
            round
            fit="cover"
            :src="weiXinBindInfo && weiXinBindInfo.avatar"
          ></van-image>
          <p>{{ weiXinBindInfo.mobile }}</p>
        </div>
      </div>

      <!--提示信息-->
      <div class="login-tips">您的账号已和此账号绑定，点击登录即可</div>

      <!--登录按钮-->
      <div class="fw-button-wrap">
        <van-button
          size="large"
          type="primary"
          class="round"
          @click="loginByWeiXin"
        >微信登录</van-button>
      </div>

      <!--切换登录方式-->
      <div class="tc">
        <a class="login-type" @click="loginByWx=false">密码登录</a>
      </div>
    </template>

    <!--验证码滑块-->
    <div id="_tc" style="width: 0;height: 0;visibility: hidden;"></div>
  </div>
</template>

<script>
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
      password: '',
      onlyRead: false,
      codeRestTime: 0,
      showTimer: false,
      listLoading: false,
      pwdType: 'password',
      loginType: 'sms',
      objArray2StringArray,
      companyOptions: [],
      hasAgreeTerms: false,
      loginByWx: false, // 微信方式登录
      hasBoundedWeiXin: false
    }
  },
  computed: {
    ...mapGetters([
      'wxOpenId',
      'commonInfo',
      'weiXinBindInfo'
    ]),
    typeText () {
      return this.loginType === 'sms' ? '账号密码登录' : '短信验证码登录'
    }
  },
  watch: {
    loginType (val) {
      val && this.changeTitle({ password: '账号密码登录', sms: '绑定手机号' }[val])
    }
  },
  mounted () {
    this.hasBoundedWeiXin = !!(this.weiXinBindInfo && this.weiXinBindInfo.mobile && this.weiXinBindInfo.token)
    this.loginByWx = this.hasBoundedWeiXin // 如果该微信已绑定账号，则默认展示微信登录
  },
  methods: {
    ...mapActions({
      login: 'user/login'
    }),

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

    // 登录
    handleLogin () {
      const pwd = this.loginType !== 'sms'

      if (!this.hasAgreeTerms) {
        this.$toast('请先同意《用户协议》和《隐私协议》')
        return
      }

      if (this.listLoading) {
        this.$toast((pwd ? '账号' : '手机号') + '验证中，请稍后...')
        return
      }

      if (pwd) {
        this.showCaptcha('2077116645', (captData) => {
          const fun = () => {
            const data = {
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
          params.randstr = data.randstr
          params.ticket = data.ticket
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
    },

    // 一键微信登录
    loginByWeiXin () {
      this.login({
        code: 200,
        loginByWeiXin: true,
        wx_open_id: this.wxOpenId,
        $router: this.$router,
        $route: this.$route,
        data: this.weiXinBindInfo
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .fw-container {
    background: url(~@/assets/image/login-bg.png);background-size: 100%;background-position-y: bottom;background-position-x: 0;background-color: #fff;
  }

  .header {
    width: 100%;height: 194px;display: flex;justify-content: center;align-items: center;
    background: url(~@/assets/image/login-logo-bg.png) 0 0 no-repeat;
    background-size: 100% auto;
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
    width: 100%;height: auto;padding: 0 28px 10px;box-sizing: border-box;
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
        margin-top: 10px;
        margin-bottom: 20px;
      }
      p {
        font-size: 15px;
        color: #354052;
        line-height: 10px;
      }
    }
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

  .fw-button-wrap {
    padding: 20px 36px;margin: 0;
    button { border-radius: 5px; }
  }

  .login-type {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #BC8D58;
    line-height: 20px;
  }

  .terms {
    padding-bottom: 45px;
    font-size: 11px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #999999;
    line-height: 15px;
    .big-icon {
      font-size: 50px;
      padding-bottom: 50px;
    }
    a {
      color: #BC8D58;
    }
  }

  .login-tips {
    font-size: 14px;
    font-weight: 500;
    color: #999999;
    line-height: 20px;
    text-align: center;
    padding: 70px 0 0;
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
