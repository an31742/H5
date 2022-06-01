<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view class="router"></router-view>
      </keep-alive>
      <router-view v-else class="router"></router-view>
    </transition>
    <!--全局loading-->
    <van-overlay :show="$store.state.loading" class="highest-wrap">
      <div class="wrapper">
        <van-loading/>
      </div>
    </van-overlay>

    <!--横屏提示-->
    <van-overlay :show="true" class="landscape-tips">
      <div class="wrapper">
        <div class="content">
          当前页面不支持横屏浏览与编辑，请旋转为竖屏
        </div>
      </div>
    </van-overlay>

    <!--微信不支持提示-->
    <van-overlay :show="env!=='development' && !isWeixin() && !isApp() && !ignoreWxEnvi" class="unsupport-tips">
      <div class="weui_msg">
        <div class="weui_icon_area">
          <van-icon name="warning" />
        </div>
        <div class="weui_text_area">
          <h4 class="weui_msg_title">请在微信客户端打开链接</h4>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import defaultSetting from './settings'
import { getAppConfig } from './api/common'
import { isWeixin, isApp } from '@/utils/index'

export default {
  name: 'App',
  data () {
    return {
      env: '',
      isApp,
      isWeixin,
      $winHeight: null,
      resizeTimer: null
    }
  },
  computed: {
    transitionName () {
      if (defaultSetting.needPageTrans) {
        return this.$store.state.direction
      }
      return ''
    },
    ignoreWxEnvi () {
      return window.location.href.indexOf('ignorewxenvironment=1') > -1
    }
  },
  created () {
    this.direction()
    this.touchMove()
    this.getConfig()
    this.env = process.env.NODE_ENV
    this.$winHeight = document.documentElement.clientHeight
  },
  mounted () {
    window.addEventListener('resize', () => {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer)
      }

      this.resizeTimer = setTimeout(() => {
        const currentHeight = document.body.clientHeight
        const pfel = document.querySelector('.van-submit-bar.pf-form')
        if (!pfel) { return }

        // 根据高度差距，来判断是否是键盘弹起
        const al = document.activeElement
        if (this.$winHeight - currentHeight > 100) {
          pfel.style.display = 'none' // 键盘弹起隐藏底部按钮
          if (al && ['INPUT', 'TEXTAREA'].indexOf(al.tagName.toUpperCase()) > -1) {
            setTimeout(() => { // 滚动到activeElement位置
              window.scrollTo(0, al.getBoundingClientRect().top)
            }, 0)
          }
        } else {
          pfel.style.display = 'block'
        }
      }, 300)
    })
  },
  methods: {
    // 滑动时，使输入框失去焦点，解决ios下光标不跟随的问题
    touchMove () {
      document.body.addEventListener('touchmove', function (e) {
        if (document.activeElement) {
          document.activeElement.blur()
        }
      }, { passive: false })
    },
    // 监听屏幕方向
    direction () {
      // ignoreoration 不监听横屏
      if (window.location.href.indexOf('ignoreoration=1')) {
        document.body.className = 'portrait'
        return
      }

      const fun = (orien) => {
        document.body.className = { 0: 'portrait', 180: 'portrait' }[orien] || 'landscape'
      }
      const evt = 'onorientationchange' in window ? 'orientationchange' : 'resize'

      fun(window.orientation)

      window.addEventListener(evt, () => {
        fun(window.orientation)
      }, false)
    },
    // 获取配置文件
    getConfig () {
      getAppConfig().then(res => {
        if (res.code === 200) {
          this.$store.commit('common/SET_APP_CONFIG', res.data)
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss">
  #app {
    font-family: PingFangSC-Regular, PingFang SC;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .router {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: #f5f5f5;
    -webkit-overflow-scrolling: touch;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: calc(100% - constant(safe-area-inset-bottom));
    height: calc(100% - env(safe-area-inset-bottom));
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .portrait .landscape-tips { display: none; }
  .landscape-tips {
    background-color: rgba(0,0,0,.9);
    .content {
      color: #fff;
      font-size: 15px;
      font-weight: normal;
    }
  }
  .unsupport-tips {
    background: #fff;
    .weui_msg {
      padding-top: 36px;
      text-align: center;
      .weui_icon_area {
        margin-bottom: 30px;
        font-size: 104px;
        color: #10AEFF;
      }
      .weui_text_area {
        margin-bottom: 25px;
        padding: 0 20px;
        .weui_msg_title {
          margin-bottom: 5px;
          font-weight: 400;
          font-size: 20px;
        }
      }
    }
  }

  .highest-wrap {
    z-index: 9999;
  }
</style>
