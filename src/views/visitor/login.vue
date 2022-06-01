<template>
  <div class="login-wrapper">
    <div class="field">
      <span class="label">手机号</span>
      <input type="text" class="input mobile" placeholder="请输入手机号" />
    </div>

    <div class="field">
      <span class="label">验证码</span>
      <input type="text" class="input verif" placeholder="请输入验证码" />
      <button type="button" class="send">发送验证码</button>
    </div>
    <div class="footer">
      <div class="err">手机号格式错误</div>
      <button
        type="button"
        class="login"
        @click="login"
      >登录</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VisitorLogin',
  data () {
    return {
      verif: ''
    }
  },
  methods: {
    login () {
      this.$router.push({ name: 'VisitorCheckIn' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-wrapper {
    box-sizing: border-box;
    padding: 34px 0 0 0;
    background: url('./images/login_bg.png') no-repeat;
    background-size: 100% auto;
  }
  .field {
    display: flex;
    padding: 0 30px;
    margin: 16px 0;
    .label {
      display: block;
      width: 52px;
      height: 30px;
      line-height: 30px;
      color: #666;
    }
    .input {
      display: block;
      box-sizing: border-box;
      height: 30px;
      padding: 0 12px;
      background-color: #f5f5f5;
      border: none;
      border-radius: 4px;
      &.mobile {
        width: 265px;
      }
      &.verif {
        width: 163px;
      }
    }
    .send {
      display: block;
      width: 90px;
      height: 30px;
      margin: 0 0 0 12px;
      line-height: 30px;
      border-radius: 4px;
      border: 1px solid #E1AA6C;
      font-size: 15px;
      color: #E1AA6C;
      background-color: #fff;
    }
  }
  .err {
    width: 100%;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    color: #FA5151;
    line-height: 20px;
  }

  .login {
    display: block;
    width: 300px;
    height: 40px;
    margin: 36px auto 0;
    line-height: 40px;
    font-size: 18px;
    color: #fff;
    font-weight: 500;
    border: none;
    border-radius: 20px;
    background: linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%);
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px 0;
  }
</style>
