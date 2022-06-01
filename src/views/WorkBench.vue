<template>
  <div class="work">
    <div class="work-header">
      <img src="@/assets/ui-prettify/header-bg.svg" class="work-header-bg">
      <!-- 小区 -->
      <topHeader/>
      <!-- 扫码 -->
      <svg-icon icon-class="work-scan" style="font-size: 22px;z-index:1;" @click="scanQrCode"/>
    </div>
    <div class="work-area">
      <div class="work-area-box">
        <p class="work-area-text">{{ nowDate }}</p>
        <van-button round color="#3DABFF" class="work-area-button work-area-clock" @click="$router.push('/check')">上班打卡</van-button>
      </div>
      <div class="work-area-line"></div>
      <div class="work-area-box">
        <p class="work-area-text">
          <span class="work-area-num">{{ myTodoNum }}</span>
          个待办工单
        </p>
        <van-button round color="#E6B57B" class="work-area-button work-area-order" @click="$router.push('/work/mytodo')">立即处理</van-button>
      </div>
    </div>
    <div class="work-content">
      <van-grid v-permission="['FPMS_MENU_CODE_H5_SEARCH_WORK_CUSTOMER', 'FPMS_MENU_CODE_H5_WORK_REPORT', 'FPMS_MENU_CODE_H5_VISITOR_CHECK_QR', 'FPMS_MENU_CODE_H5_SEARCH_WORK']" :border="false" :column-num="4" class="work-order">
        <van-grid-item v-permission="['FPMS_MENU_CODE_H5_SEARCH_WORK_CUSTOMER']" @click="$router.push('/search/work/customer')">
          <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/daikeludan.png')"/>
          <span class="work-order-text">代客录单</span>
        </van-grid-item>
        <van-grid-item v-permission="['FPMS_MENU_CODE_H5_WORK_REPORT']" @click="$router.push('/work/report')">
          <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/zichabaoshi.png')"/>
          <span class="work-order-text">自查报事</span>
        </van-grid-item>
        <!--        <van-grid-item @click="$router.push('/visitor/checkQr')">
          <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/fangkedengji.png')"/>
          <span class="work-order-text">访客登记</span>
        </van-grid-item>-->
        <van-grid-item v-permission="['FPMS_MENU_CODE_H5_SEARCH_WORK']" @click="$router.push('/search/work')">
          <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/gongdanchaxun.png')"/>
          <span class="work-order-text">工单查询</span>
        </van-grid-item>
        <van-grid-item @click="$router.push('/work/rectification')">
          <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/zhenggaibaozhang.png')"/>
          <span class="work-order-text">整改报障</span>
        </van-grid-item>
      </van-grid>
      <div class="work-notice" v-if="noticeTip">
        <p class="work-notice-title">通知公告<span class="work-notice-info">{{ noticeTip }}</span></p>
      </div>
      <div class="work-entrance">
        <p v-permission="['FPMS_MENU_CODE_H5_ENTRANCE']" class="work-entrance-title">门禁</p>
        <van-grid v-permission="['FPMS_MENU_CODE_H5_ENTRANCE']" :border="false" :column-num="4" class="work-order">
          <van-grid-item @click="checkIsQingYue()">
            <van-image class="work-entrance-icon" :src="require('@/assets/ui-prettify/zhinengmenjin.png')"/>
            <span class="work-entrance-text">智能门禁</span>
          </van-grid-item>
        </van-grid>
        <p class="work-entrance-title">管理</p>
        <van-grid :border="false" :column-num="4" class="work-order">
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_GROUP_APPROVE']" @click="$router.push({name: 'Approve'})">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/shenpi.png')"/>
            <span class="work-order-text">审批</span>
          </van-grid-item>
          <van-grid-item @click="$router.push('/check/statistic')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/paiban.png')"/>
            <span class="work-order-text">排班</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_ESTATE_CHARGE']" @click="jumpOuterUrl('estate-charge')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/propertyCharge.png')"/>
            <span class="work-order-text">物业收费</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_FEE_TABLE']" v-if="!(this.userData && this.userData.company_belong_government_id && this.userData.company_belong_government_id > 0)" @click="jumpOuterUrl('fee-table')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/meterReading.png')"/>
            <span class="work-order-text">费用抄表</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_QRCODE_LIST']" @click="$router.push({name: 'QrcodeList'})">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/shoukuanma.png')"/>
            <span class="work-order-text">收款码</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_DECORATION']" @click="$router.push({name: 'Decoration'})">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/fangwuchaxun.png')"/>
            <span class="work-order-text">装修管理</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_VISITORS_INVITATION']" @click="$router.push({name: 'VisitorHistory'})">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/visitorInvite.png')"/>
            <span class="work-order-text">访客邀请</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_ITEMS_RELEASE']" @click="$router.push({name: 'GoodsRelease'})">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/goodsRelease.png')"/>
            <span class="work-order-text">物品放行</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_GET_APPLY']" @click="$router.push({name: 'ReceiveApply'})">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/apply.png')"/>
            <span class="work-order-text">领用申请</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_WU_ZI_PAN_DIAN']" @click="$router.push({name: 'Materials'})">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/wuzipandian.png')"/>
            <span class="work-order-text">物资盘点</span>
          </van-grid-item>
        </van-grid>
        <p v-permission="['FPMS_MENU_CODE_H5_SEARCH_CUSTOMER', 'FPMS_MENU_CODE_H5_SEARCH_ROOM', 'FPMS_MENU_CODE_H5_SEARCH_PARKING', 'FPMS_MENU_CODE_H5_SEARCH_VEHICLE']" class="work-entrance-title">查询</p>
        <van-grid v-permission="['FPMS_MENU_CODE_H5_SEARCH_CUSTOMER', 'FPMS_MENU_CODE_H5_SEARCH_ROOM', 'FPMS_MENU_CODE_H5_SEARCH_PARKING', 'FPMS_MENU_CODE_H5_SEARCH_VEHICLE']" :border="false" :column-num="4" class="work-order">
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_SEARCH_CUSTOMER']" @click="$router.push('/search/customer')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/kehuchaxun.png')"/>
            <span class="work-order-text">客户查询</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_SEARCH_ROOM']" @click="$router.push('/search/room')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/fangwuchaxun.png')"/>
            <span class="work-order-text">房屋查询</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_SEARCH_PARKING']" @click="$router.push('/search/parking')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/cheweichaxun.png')"/>
            <span class="work-order-text">车位查询</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_SEARCH_VEHICLE']" @click="$router.push('/search/vehicle')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/cheliangchaxun.png')"/>
            <span class="work-order-text">车辆查询</span>
          </van-grid-item>
          <van-grid-item @click="$router.push('/visitor/checkQr')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/fangkedengji.png')"/>
            <span class="work-order-text">访客登记</span>
          </van-grid-item>
        </van-grid>

        <p v-permission="['FPMS_MENU_CODE_H5_EBA_DATA', 'FPMS_MENU_CODE_H5_EBA_WARNING', 'FPMS_MENU_CODE_H5_EBA_CONTROL']" class="work-entrance-title">EBA</p>
        <van-grid v-permission="['FPMS_MENU_CODE_H5_EBA_DATA', 'FPMS_MENU_CODE_H5_EBA_WARNING', 'FPMS_MENU_CODE_H5_EBA_CONTROL']" :border="false" :column-num="4" class="work-order">
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_EBA_DATA']" @click="jumpRouterUrl('/h5/data')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/eba_data.png')"/>
            <span class="work-order-text">数据</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_EBA_WARNING']" @click="jumpRouterUrl('/h5/alarm')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/eba_warning.png')"/>
            <span class="work-order-text">告警</span>
          </van-grid-item>
          <van-grid-item v-permission="['FPMS_MENU_CODE_H5_EBA_CONTROL']" @click="jumpRouterUrl('/h5/control')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/eba_control.png')"/>
            <span class="work-order-text">控制</span>
          </van-grid-item>
        </van-grid>

        <!-- 上门回收模块一期仅给一个小区使用，且员工端的功能模块没有对应的配置功能，故写死 -->
        <p v-if="showHomeReclaim()" class="work-entrance-title">上门回收</p>
        <van-grid v-if="showHomeReclaim()" :border="false" :column-num="4" class="work-order">
          <van-grid-item @click="$router.push('/evaluation-order')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/evaluation.png')"/>
            <span class="work-order-text">回收估价</span>
          </van-grid-item>
          <van-grid-item @click="$router.push('/reclaim-order')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/reclaim.png')"/>
            <span class="work-order-text">回收订单</span>
          </van-grid-item>
          <van-grid-item @click="$router.push('/valet-evaluation')">
            <van-image class="work-order-icon" :src="require('@/assets/ui-prettify/add_evaluation.png')"/>
            <span class="work-order-text">代客提单</span>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script>
import topHeader from '@/views/components/topHeader'
import { timeFix } from '@/utils'
import { isApp, mapOpenDoorUrl2Params } from '@/utils/index'
import { mapGetters } from 'vuex'
import moment from 'moment'
import wx from 'weixin-js-sdk'
import { wfeFlowInstanceTodoStatics } from '@/api/wfe'
import { miniSecretOpen, miniSecretGroupAccessCategory } from '@/api/entrance'
import { minipNoticeList } from 'api/messageV2'
import { getToken, getGroupId } from '@/utils/auth'
import { outEntryLinks } from '../utils/const'

export default {
  name: 'WorkBench1',
  components: {
    topHeader
  },
  data () {
    return {
      loading: false,
      myTodoNum: '',
      nowDate: '',
      noticeTip: '',
      curGroupId: ''
    }
  },
  computed: {
    ...mapGetters([
      'userGroupList',
      'userData',
      'appConfig',
      'userData',
      'app_id'
    ]),
    curGroupObjectId () {
      let gl = []
      if (this.userGroupList) {
        gl = this.userGroupList.filter(item => item.id === this.curGroupId)
        return gl[0] ? gl[0]['object_id'] : ''
      } else {
        return ''
      }
    }
  },
  created () {
    this.curGroupId = getGroupId() ? +getGroupId() : ''
  },
  mounted () {
    this.getNowDate()
    this.getStatics()
    this.getNotice()
  },
  methods: {
    jumpRouterUrl (path) {
      const hasToken = getToken()
      if (hasToken && this.curGroupObjectId) {
        location.href = `${process.env.VUE_APP_EBA_PATH_HOST}${path}?token=${hasToken}&project_id=${this.curGroupObjectId}&app_id=${this.app_id}`
      }
    },
    // 跳转外网页面
    jumpOuterUrl (url) {
      const hasToken = getToken()
      if (hasToken && this.curGroupObjectId) {
        location.href = `${outEntryLinks.Payment}${url}?token=${hasToken}&project_id=${this.curGroupObjectId}&app_id=${this.app_id}`
      }
    },
    timeFix,
    // 是否显示上门回收
    showHomeReclaim () {
      const env = process.env.NODE_ENV
      const groupIds = {
        test: 148,
        development: 148,
        production: 80
      }
      return groupIds[env] === Number(getGroupId())
    },
    // 扫码
    async scanQrCode () {
      // try {
      //   const params = { 'access_device_mac': '9C93E400001D', 'access_type': '1', 'device_type': 'gateway', 'unlock_code': '894583' }
      //   const res1 = await miniSecretOpen(params)
      //   if (res1.code === 200) {
      //     that.$toast('开门成功')
      //   } else if (res1.code === 500) {
      //     that.$toast('您不是当前小区员工')
      //   } else {
      //     that.$toast('开门失败')
      //   }
      // } catch (error) {
      //   that.$toast('开门失败')
      // }

      // app走APP扫码
      if (isApp()) {
        this.nativeScanQRcode((res) => {
          if (res.error) {
            this.$toast(res.error)
            return
          }

          this.dealScanResult(res.str)
        })
        return
      }

      // 非APP下，走微信扫码
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'],
        success: (res) => {
          this.dealScanResult(res.resultStr)
        }
      })
    },
    // 处理扫描结果
    async dealScanResult (str) {
      let params = str
      try {
        params = JSON.parse(str)
      } catch (e) {
        params = str
      }
      if (typeof params === 'string' && params.indexOf('goodsrelease') > -1) {
        this.$router.push({ name: 'GoodsReleaseDetail', query: { order_id: params.split(':')[1] } })
        return
      }
      if (typeof params === 'string' && !this.checkDeviceLink(params)) {
        this.$router.push({ name: 'DeviceInfo', query: { qrcode: params } })
        return
      }
      // http的链接直接跳转
      if (typeof params === 'string' && /^https?/.test(params)) {
        // 开门二维码 为链接的情况 提取参数 走开门逻辑
        if (params.indexOf('gmtech.top/callup_wechat_mini') > -1) {
          params = mapOpenDoorUrl2Params(params)
        } else if (params.indexOf('gmtech.top/callup_gmtech') > -1) {
          params = mapOpenDoorUrl2Params(params)
        } else {
          // 共享车位
          window.location.href = params
          return
        }
      }
      // 其余逻辑走扫码开门
      const res1 = await miniSecretOpen(params)
      if (res1.code === 200) {
        this.$toast('开门成功')
      } else if (res1.code === 500) {
        this.$toast('您不是当前小区员工')
      } else {
        this.$toast('开门失败')
      }
    },

    diffTime (time) {
      const m1 = moment()
      const m2 = moment(time)

      return m1.diff(m2, 'day')
    },

    // 获取待办工单统计数据
    getStatics () {
      this.loading = true
      wfeFlowInstanceTodoStatics().then(res => {
        this.loading = false
        if (res.code === 200) {
          const num = res.data['1'] || 0
          this.myTodoNum = num > 99 ? '99+' : num
        } else {
          this.$toast(res.msg || '获取数据失败')
        }
      })
    },

    // 是青岳门禁
    async checkIsQingYue () {
      let groupId = getGroupId()
      groupId = parseInt(groupId)
      const res = await miniSecretGroupAccessCategory({
        group_id: groupId
      })
      // 是青岳门禁
      // {access_type_id: 1, access_name: "青岳科技"}
      if (res.data.access_type_id === 1) {
        this.$router.push({ name: 'entrance' })
      } else {
        this.$alert({
          title: '智能门禁',
          message: '您所在的小区没有安装智能门禁，暂不支持此功能',
          confirmButtonText: '知道了',
          theme: 'round-button',
          confirmButtonColor: '#E1AA6C'
        })
      }
    },

    // 设备连接
    checkDeviceLink (str) {
      return /^https?/.test(str)
    },

    getNowDate () {
      const time = new Date()
      const week = ['日', '一', '二', '三', '四', '五', '六']
      const date = moment(time).format('M月D日')
      const weekStr = week[moment(time).day()]
      this.nowDate = `${date} 周${weekStr}`
    },

    getNotice () {
      const params = {
        page: 1,
        page_size: 1,
        notice_type: 0
      }
      minipNoticeList(params).then(res => {
        if (res.code === 200 && res.data.list && res.data.list) {
          this.noticeTip = res.data.list[0] && res.data.list[0].title || ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .work {
    width: 100%;
    min-height: calc(100vh - 50px);
    background: #F6F8FA;

    &-header {
      height: 101px;
      background: #fff;
      position: relative;
      padding: 32px 27px 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      &-bg {
        position: absolute;
        right: 0;
        top: 0;
        height: 101px;
      }
    }

    &-area {
      padding: 15px 28px 19px;
      box-sizing: border-box;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-text {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        line-height: 1;
      }

      &-button {
        width: 140px;
        height: 28px;
        margin-top: 23px;
      }

      &-line {
        width: 2px;
        height: 24px;
        background: #F6F8FA;
      }

      &-box {
        width: 140px;
      }

      &-num {
        color: #FF3B30;
      }

      &-clock {
        box-shadow: 0px 4px 10px 0px rgba(61, 171, 255, 0.5);
      }

      &-order {
        box-shadow: 0px 4px 10px 0px rgba(230, 181, 123, 0.5);
      }
    }

    &-content {
      padding: 16px;
      box-sizing: border-box;
    }

    &-order, &-notice, &-entrance {
      background: #fff;
      border-radius: 6px;

      &-icon {
        width: 44px;
        height: 44px;
        margin-bottom: 5px;
      }

      &-text {
        font-size: 13px;
        color: #333;
        font-weight: bold;
        line-height: 18px;
      }
    }

    &-notice {
      padding: 13px 14px;
      box-sizing: border-box;
      margin: 8px 0 16px;

      &-title {
        font-size: 13px;
        color: #333;
        font-weight: bold;
        line-height: 1;
      }

      &-info {
        font-size: 13px;
        color: #666;
        line-height: 1;
        margin-left: 10px;
      }
    }

    &-entrance {
      &-title {
        font-size: 18px;
        color: #333;
        font-weight: bold;
        padding: 25px 18px 0;
        box-sizing: border-box;
      }
    }
  }
  ::v-deep.van-grid .van-grid-item__content {
    border-radius: 6px;
  }
</style>
