<template>
  <div class="share-wrapper">
    <div class="main">
      <div class="info">
        <div class="avatar">
          <van-image round :src="require('@/assets/image/user.png')" />
        </div>
        <div class="name">{{ userName }}</div>
      </div>
      <div v-if="isEmptyResult" >
        <div class="text1">当前邀请已删除</div>
      </div>
      <div v-else-if="acceptReuslt===undefined" >
        <template v-if="isQY">
          <div v-if="isAccept" class="text1">您可扫码打开{{ visitInfo.room_location_str.split('/').join('') }}的门禁</div>
          <div v-else class="text1">分享了{{ userName }}家的访客权限给你</div>
          <div class="text2">你将在{{ expireTime }}小时内有自由开门权限</div>
        </template>
        <template v-else>
          <div v-if="isAccept" class="text1">请扫码小区提供的二维码</div>
          <div v-else class="text1">分享了{{ userName }}家的访客权限给你</div>
          <div class="text2">你将在{{ expireTime }}小时内可以自由进出{{ visitInfo.group_name||'' }}</div>
        </template>
      </div>
      <div v-else-if="acceptReuslt===false" >
        <div class="text1">您不在预约访客内</div>
      </div>
      <div v-if="isAccept" class="bottom-text">
        <div class="remain-time">
          剩余时间：
          <span>
            <van-count-down
              ref="countDown"
              class="text-yellow"
              :time="countdownTime"
              @finish="countdownFinish = true"
            />
          </span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <button v-if="!hasLogin()" type="button" class="button" @click="goLoginPage">手机验证码登录</button>
      <button
        v-else-if="!isAccept"
        type="button"
        :disabled=" acceptReuslt===false"
        class="button"

        :class="{'disabled':acceptReuslt===false}"
        @click="acceptInvite"
      >接受邀请</button>

      <button
        v-else
        type="button"
        class="button "
        :disabled="(countdownTime <=0) ||countdownFinish "
        @click="openVisit()"
      >
        {{ isQY?'立即开锁':"扫码核验" }}
      </button>

    </div>
  </div>
</template>

<script>
import { miniAcceptInvite, miniOpenVisit, miniVisitInfo, miniVisitIUnQYOpen } from '@/api/visitorInvite'
import { miniSecretGroupAccessCategory } from '@/api/entrance'
import { launchScanQr } from '@/utils/share'
import { mapOpenDoorUrl2Params, param2Obj } from '@/utils/index'

export default {
  name: 'Share',
  data () {
    return {
      userName: '',
      expireTime: '',
      openNum: '',
      userId: '',
      shareId: '',
      isAccept: false, // 是否已经接受邀请
      visitorMobile: '',
      visitInfo: {},
      serverTime: null,
      countdownStart: false,
      countdownFinish: false,
      // 是否青岳门禁
      isQY: false,
      acceptReuslt: undefined,
      isEmptyResult: false
    }
  },
  computed: {
    countdownTime () {
      if (!this.isAccept) {
        return 0
      }

      const info = this.visitInfo
      if (!info) {
        return 0
      }

      // 终止权限
      if (info.status === 3) {
        return 0
      }

      const now = new Date()
      const visitTime = new Date(info.visit_time)

      return info.expire_time * 1000 - (now - visitTime)
    }
  },
  created () {
    this.userName = this.$route.query.userName
    this.expireTime = Math.ceil(this.$route.query.expireTime / 3600)
    this.openNum = this.$route.query.openNum || 5
    this.userId = this.$route.query.userId
    this.shareId = this.$route.query.shareId

    this.getVisitorInfo()
  },
  methods: {
    async getVisitorInfo () {
      // 获取访客信息
      const res = await miniVisitInfo({ user_id: Number(this.userId), share_id: Number(this.shareId) })

      if (res.code === 200) {
        if (res.data) {
          this.visitInfo = res.data || {}
          this.isAccept = !!this.visitInfo.status
          this.serverTime = res.time
          this.userName = this.visitInfo.visitor_name
          try {
            const res2 = await miniSecretGroupAccessCategory({ group_id: res.data.group_id })
            if (res2.code === 200) {
              // 是青岳门禁
              // {access_type_id: 1, access_name: "青岳科技"}
              this.isQY = res2.data && res2.data.access_type_id === 1
            }
          } catch (e) {
            console.log(e)
          }
        }

        // this.expireTime = res.data.expire_time
        // this.openNum = res.data.num || 5

        if (this.$refs.countDown) { this.$refs.countDown.start() }
      } else {
        console.log(res)
      }
    },
    goLoginPage () {
      this.startLogin()
      // this.$router.push({
      //   name: 'login',
      //   query: {
      //     redirect: this.$route.fullPath
      //   }
      // })
    },
    acceptInvite () {
      const data = {
        user_id: Number(this.userId),
        share_id: Number(this.shareId)
      }
      miniAcceptInvite(data)
        .then(res => {
          if (res.code === 200) {
            this.isAccept = true
            this.$toast('接受成功')
            this.getVisitorInfo()
          } else if (res.code === 10516) {
            // this.$toast('您没有被邀请，请联系业主')
          // /您不在预约访客内
            this.acceptReuslt = false
          } else {
            this.$toast(res.msg)
          }
        })
    },
    async openVisit () {
      /// 非青岳门口的 开门方式
      if (!this.isQY) {
        this.openVisitIUnQY()
        return
      }

      let data = {}

      const res = await launchScanQr()

      // const resultStr = `https://gmtech.top/callup_gmtech?i=116&t=1&m=9C93E4000018&c=305298&n=%E6%98%86%E6%89%BF%E7%89%A9%E4%B8%9A%E7%AE%A1%E7%90%86%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8`
      const resultStr = res.resultStr
      //  二维码 为链接的情况
      if (resultStr.indexOf('gmtech.top/callup_wechat_mini') > -1) {
        data = mapOpenDoorUrl2Params(resultStr)
      } else if (resultStr.indexOf('gmtech.top/callup_gmtech') > -1) {
        data = mapOpenDoorUrl2Params(resultStr)
      } else {
        data = JSON.parse(resultStr)
      }

      data.device_mac = data.access_device_mac
      delete data.access_device_mac

      data = Object.assign({}, data, {
        user_id: Number(this.userId),
        share_id: Number(this.shareId)
      })
      miniOpenVisit(data)
        .then(res => {
          if (res.code === 200) {
            this.$toast('开门成功')
            this.$router.push({
              name: 'inviteVistor',
              query: {
                userId: this.userId,
                shareId: this.shareId
              }
            })
          } else {
            this.$toast('开门失败')
          }
        }).catch(r => {
          this.$toast('开门失败')
        })
    },
    // 非青岳门岗 扫码开门
    async openVisitIUnQY () {
      // eslint-disable-next-line no-unused-vars

      let res = {}
      // 测试环境
      if (window.location.origin.indexOf('localhost') > -1) {
        res.resultStr = `http://h5-user-test.fw.gmtech.top/visitorCheck/checkIn?app_id=28&companyId=1&doorId=5440&door=%E7%A4%BE%E5%8C%BA%E5%A4%A7%E9%97%A8/%E5%A4%A7%E9%97%A86&groupId=148&deviceMac=5fdc5f7d5a61b21a746820fa`
      } else {
        res = await launchScanQr()
      }

      //  二维码 格式校验
      if (res.resultStr.indexOf('visitorCheck/checkIn') === -1) {
        this.$toast('二维码格式错误')
        return
      }

      const data = param2Obj(res.resultStr)

      miniVisitIUnQYOpen({
        user_id: Number(this.userId),
        share_id: Number(this.shareId),
        location_id: Number(data.doorId),
        location_group_id: Number(data.groupId),
        device_mac: data.deviceMac
      })
        .then(res => {
          if (res.code === 200) {
            this.$toast('验证成功')
            this.$router.push({
              name: 'inviteVistor',
              query: {
                userId: this.userId,
                shareId: this.shareId
              }
            })
          } else {
            this.$toast('验证失败')
          }
        })
    }
  }
}

</script>

<style lang="scss" scoped>
  .share-wrapper {
    width: 100%;
    height: auto;
    min-height: 100vh;
    background: url('./images/share_bg.png') no-repeat;
    background-size: 100% auto;
    .info {
      display: flex;
      padding: 18px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid #eee;
      }
      .name {
        margin: 0 0 0 14px;
        font-size: 16px;
        color: #333333;
        line-height: 50px;
      }
    }
    .text1 {
      width: 100%;
      height: 22px;
      margin: 26px 0 0 0;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      text-align: center;
    }
    .text2 {
      width: 100%;
      height: 20px;
      font-size: 11px;
      color: #999999;
      line-height: 20px;
      text-align: center;
    }
    .bottom-text {
      text-align: center;
      display: flex;
      justify-content: center;
      margin: 360px 0 0 0;
      font-size: 13px;
      font-weight: 400;
      color: #999999;
      line-height: 19px;
      .remain-time {
        display: flex;
        .text-yellow {
          color: #999999;
          min-width: 60px;
        }
      }

    }
    .bottom {
      width: 100%;
      height: 80px;
      position: fixed;
      bottom: 0;
      left: 0;
    }
    .button {
      display: block;
      width: 300px;
      height: 40px;
      background: linear-gradient(175deg, #F2D5A5 0%, #E1AA6C 100%);
      border-radius: 20px;
      border: none;
      margin: 0 auto;
      font-size: 18px;
      color: #fff;
      &:disabled {
        opacity: 0.4;
      }
    }
  }
</style>
