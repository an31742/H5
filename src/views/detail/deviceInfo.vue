<template>
  <div v-if="!loading && deviceInfo" class="device">
    <div class="device-title device-bg">
      <van-image
        width="80px"
        height="80px"
        fit="cover"
        :src="deviceInfo.pictures[0]"
        @click="previewImg"
      />
      <div class="device-right">
        <p class="device-title-name">{{ deviceInfo.name }}</p>
        <p class="device-title-desc">唯一识别码：{{ deviceInfo.smart_device_id || '无' }}</p>
        <p class="device-title-desc">设备编号：{{ deviceInfo.code }}</p>
      </div>
    </div>
    <div class="device-info">
      <p class="device-info-title">设备信息</p>
      <div class="device-list device-bg">
        <p class="device-item">
          <span class="device-item-title">设备类型：</span>
          <span>{{ getItemByValue(appConfig.DEVICE_TYPE_LIST, deviceInfo.type) }}</span>
        </p>
        <p class="device-item">
          <span class="device-item-title">设备分类：</span>
          <span>{{ deviceInfo.category ? deviceInfo.category.map(item=>item.name).join('/') : '无' }}</span>
        </p>
        <p class="device-item">
          <span class="device-item-title">所在位置：</span>
          <span>{{ deviceInfo.location_name || '无' }}</span>
        </p>
        <p class="device-item">
          <span class="device-item-title">厂家品牌/型号：</span>
          <span>{{ `${deviceInfo.brand||'无'}/${deviceInfo.model_number||'无'}` }}</span>
        </p>
        <p class="device-item">
          <span class="device-item-title">供应商：</span>
          <span>{{ deviceInfo.supplier || '无' }}</span>
        </p>
        <p class="device-item">
          <span class="device-item-title">出厂日期：</span>
          <span v-if="deviceInfo.made_time">{{ dayjs(deviceInfo.made_time).format('YYYY-MM-DD') }}</span>
          <span v-else>无</span>
        </p>
        <p class="device-item">
          <span class="device-item-title">安装日期：</span>
          <span v-if="deviceInfo.setup_time">{{ dayjs(deviceInfo.setup_time).format('YYYY-MM-DD') }}</span>
          <span v-else>无</span>
        </p>
        <p class="device-item">
          <span class="device-item-title">报废日期：</span>
          <span v-if="deviceInfo.discard_time">{{ dayjs(deviceInfo.discard_time).format('YYYY-MM-DD') }}</span>
          <span v-else>无</span>
        </p>
        <p class="device-item">
          <span class="device-item-title">设备型号：</span>
          <span>{{ deviceInfo.model_number || '无' }}</span>
        </p>
        <p class="device-item">
          <span class="device-item-title">设备IP：</span>
          <span>{{ deviceInfo.ip_address || '无' }}</span>
        </p>
        <p class="device-item">
          <span class="device-item-title">备注：</span>
          <span class="device-item-remark">{{ deviceInfo.remark || '无' }}</span>
        </p>
      </div>
      <div class="device-logs">
        <van-sticky @scroll="tabScroll">
          <van-tabs
            v-model="active"
            color="#E1AA6C"
            line-width="30px"
          >
            <van-tab title="巡检日志">
              <pull-list
                ref="pullList"
                style="overflow:auto;-webkit-overflow-scrolling:touch;"
                iconName="no-msg"
                listProp="list"
                :pullingRefresh="false"
                :list.sync="inspectionList"
                :api="getDeviceLog"
                :apiParams.sync="inspectionParams"
              >
                <div slot="content">
                  <div v-for="(item, index) in inspectionList" :key="index" class="device-logs-item" @click="orderDetail(item)">
                    <p class="device-logs-item-desc">{{ timeHandle(item.create_time) }}</p>
                    <p class="device-logs-item-desc">巡检人：{{ item.staff_name }}</p>
                    <p class="device-logs-item-desc">计划名称：{{ item.plan_name }}</p>
                    <p class="device-logs-item-desc">工单编号：{{ item.work_order_no }}</p>
                    <van-tag class="device-logs-item-tag" color="#F0F9EB" text-color="#6FC544" size="large">{{ getStatus(item.work_order_status) }}</van-tag>
                  </div>
                </div>
              </pull-list>
            </van-tab>
            <van-tab title="保养日志">
              <pull-list
                ref="pullList"
                style="overflow:auto;-webkit-overflow-scrolling:touch;"
                iconName="no-msg"
                listProp="list"
                :pullingRefresh="false"
                :list.sync="maintainList"
                :api="getDeviceLog"
                :apiParams.sync="maintainParams"
              >
                <div slot="content">
                  <div v-for="(item, index) in maintainList" :key="index" class="device-logs-item" @click="orderDetail(item)">
                    <p class="device-logs-item-desc">{{ timeHandle(item.create_time) }}</p>
                    <p class="device-logs-item-desc">保养人：{{ item.staff_name }}</p>
                    <p class="device-logs-item-desc">计划名称：{{ item.plan_name }}</p>
                    <p class="device-logs-item-desc">工单编号：{{ item.work_order_no }}</p>
                    <van-tag class="device-logs-item-tag" color="#F0F9EB" text-color="#6FC544" size="large">{{ getStatus(item.work_order_status) }}</van-tag>
                  </div>
                </div>
              </pull-list>
            </van-tab>
            <van-tab title="维修日志">
              <pull-list
                ref="pullList"
                style="overflow:auto;-webkit-overflow-scrolling:touch;"
                iconName="no-msg"
                listProp="list"
                :pullingRefresh="false"
                :list.sync="repairList"
                :api="getDeviceRepairLog"
                :apiParams.sync="repairParams"
              >
                <div slot="content">
                  <div v-for="(item, index) in repairList" :key="index" class="device-logs-item" @click="orderDetail(item)">
                    <p class="device-logs-item-desc">{{ timeHandle(item.create_time) }}</p>
                    <p class="device-logs-item-desc">提单人：{{ item.launcher_name || '无' }}</p>
                    <p class="device-logs-item-desc">详细描述：{{ item.description || '无' }}</p>
                    <p class="device-logs-item-desc">工单编号：{{ item.work_order_no }}</p>
                    <van-tag class="device-logs-item-tag" color="#F0F9EB" text-color="#6FC544" size="large">{{ getStatus(item.work_order_status) }}</van-tag>
                  </div>
                </div>
              </pull-list>
            </van-tab>
          </van-tabs>
        </van-sticky>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { ImagePreview } from 'vant'
import { mapGetters } from 'vuex'
import { getItemByValue } from '@/utils/index'
import { getDeviceQrcode, getDeviceLog, getDeviceRepairLog } from '@/api/device'
import pullList from 'views/components/pulllList'
import appMixin from '@/mixin/app'
import { isApp } from '../../utils'

export default {
  name: 'DeviceInfo',
  components: { pullList },
  mixins: [appMixin],
  data () {
    return {
      getItemByValue,
      dayjs,
      loading: false,
      active: 0,
      qrcode: '',
      deviceInfo: null,
      deviceId: 0,
      logLoading: false,
      logFinished: false,
      inspectionList: [],
      maintainList: [],
      repairList: []
    }
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ]),
    inspectionParams () {
      return {
        id: this.deviceId,
        project: 1
      }
    },
    maintainParams () {
      return {
        id: this.deviceId,
        project: 2
      }
    },
    repairParams () {
      return {
        id: this.deviceId
      }
    }
  },
  created () {
    this.qrcode = decodeURIComponent(this.$route.query.qrcode) || ''
    this.getDeviceInfo()
  },
  methods: {
    getDeviceLog,
    getDeviceRepairLog,
    // 预览设备图片
    previewImg () {
      if (this.deviceInfo.pictures.length) {
        ImagePreview(this.deviceInfo.pictures)
      }
    },

    tabScroll (opt) {
      console.log('tabScroll', opt)
    },

    // 日志状态
    getStatus (status) {
      return getItemByValue(this.appConfig ? this.appConfig.WFE_FLOW_INSTANCE_STATUS : [], status) || ''
    },
    // 设备信息
    getDeviceInfo () {
      this.loading = true
      getDeviceQrcode({
        qrcode: this.qrcode.replace('-{device}', '')
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          console.log(res.data)
          this.deviceInfo = res.data
          this.deviceInfo.pictures = this.deviceInfo.pictures ? this.deviceInfo.pictures.split(',') : []
          this.deviceId = res.data.id
        } else {
          this.$toast(res.msg || '获取设备信息失败')
          if (isApp()) {
            setTimeout(() => {
              this.nativeBack()
            }, 3000)
          }
        }
      }).catch(_ => {
        this.$toast(_.msg || '获取设备信息失败')
        setTimeout(() => {
          this.nativeBack()
        }, 3000)
      })
    },
    // 查看详情
    orderDetail (item) {
      this.$router.push({ name: 'WorkDetail', query: { id: item.work_order_record_id } })
    }
  }
}
</script>

<style lang="scss" scoped>
  .device {
    &-title {
      margin-top: 12px;
      padding: 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      &-name {
        font-size: 16px;
        line-height: 22px;
        color: #333;
        font-weight: bold;
      }

      &-desc {
        font-size: 14px;
        color: #999;
        font-weight: 400;
        line-height: 18px;
        margin-top: 4px;
      }
    }

    &-right {
      flex: 1;
      margin-left: 8px;
    }

    &-info {
      margin-top: 4px;
      &-title {
        font-size: 14px;
        line-height: 14px;
        color: #666;
        font-weight: 400;
        padding: 12px;
        box-sizing: border-box;
      }
    }

    &-bg {
      background: #fff;
    }

    &-item {
      padding: 16px 12px;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      font-size: 15px;
      line-height: 15px;
      font-weight: 400;
      display: flex;
      align-items: flex-start;

      &-title {
        min-width: 75px;
      }

      &-remark {
        line-height: 18px;
      }
    }

    &-logs {
      margin-top: 8px;
      height: 100vh;

      &-item {
        margin: 5px;
        background: #fff;
        border-radius: 4px;
        padding: 12px;
        box-sizing: border-box;
        position: relative;

        &-desc {
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          color: #666;
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }
        }

        &-tag {
          position: absolute;
          right: 12px;
          top: 12px;
        }
      }
    }
  }

  ::v-deep .van-tabs__nav {
    .van-tab {
      border-bottom: 0;
      .van-tab__text {
        color: #969799;
      }
    }
    .van-tab--active {
      .van-tab__text {
        color: #323233;
      }
    }
  }
  // ::v-deep .empty-list {
  //   height: 230px !important;
  // }
  .list-wrap {
    height: calc(100vh - 45px);
  }
</style>
