<template>
  <div class="service-wrap">
    <van-overlay :show="pageLoading" class="download-overlay">
      <van-loading type="spinner" class="my-loading"></van-loading>
    </van-overlay>
    <div class="download-tips flex justify-space-between">
      <div>
        <span style="color: #CDCDCD">请选择工单</span>
        <svg-icon icon-class="explain" style="font-size:16px;" @click="openTips"/>
      </div>
      <span style="color:#E1AA6C" @click="closeOverlay">取消</span>
    </div>
    <!-- 下载中 -->
    <div class="download-status flex justify-space-between" v-if="downloadStatus === 1">
      <div>
        <svg-icon icon-class="downloading" style="font-size:16px;background:#fff;"/>
        <span style="color: #1A7AFF">{{ downloadingLength || '0' }}个工单下载中</span>
      </div>
    </div>
    <!-- 下载成功 -->
    <div v-if="downloadStatus === 2" class="download-status flex justify-space-between" style="background:#F0FAE6;">
      <div>
        <svg-icon icon-class="download-success" style="font-size:16px;" />
        <span style="">工单下载成功</span>
      </div>
    </div>
    <!-- 下载失败 -->
    <div v-if="downloadStatus === 3" class="download-status flex justify-space-between" style="background:#FFEDED;">
      <div>
        <svg-icon icon-class="download-error" style="font-size:16px;" @click="downloadStatus = 0"/>
        <span style="" v-if="successList.length">{{ `${successList.length}下载成功${errorList.length}个工单下载失败` }}</span>
        <span style="" v-else>{{ `${errorList.length}个工单下载失败` }}</span>
      </div>
      <span style="color: #1A7AFF;text-decoration: dashed;" @click="againDownload">重新下载</span>
    </div>

    <!-- 工单列表 -->
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-skeleton slot="loading" title avatar :row="5" :loading="loading"></van-skeleton>
        <template v-if="list.length>0">
          <div class="work-list">
            <div v-for="(item, idx) in list" :key="idx" class="work-item">
              <div class="work-content" @click="orderDetail(item)">
                <p class="work-mgb20 work-between">
                  <span class="work-item-title">{{ item.biz_subservice_name }}</span>

                  <span class="work-item-status">
                    <van-button v-if="item.is_urgent && item.is_urgent === 1" class="work-detail-urgent" size="mini">
                      <template slot="default">
                        <svg-icon class="work-detail-urgent-icon" icon-class="notice-urgent" />
                        <span>加急</span>
                      </template>
                    </van-button>

                    <span class="work-item-status" style="display: inline-block;margin-top: 1px;float: right;">
                      <svg-icon v-if="item._ischeck" icon-class="download-select" />
                      <svg-icon v-else icon-class="download-selected" />
                    </span>
                  </span>
                </p>
                <template>
                  <!--时间-->
                  <p class="work-item-row">
                    <span class="work-item-desc">
                      {{ timeHandle(item['created']) }}
                    </span>
                  </p>

                  <!--项目名称-->
                  <p class="work-item-row">
                    <span class="work-item-desc">项目名称：{{ item.group_name }}</span>
                  </p>

                  <!--提单人-->
                  <p class="work-item-row">
                    <span class="work-item-desc">提单人：{{ item.launcher_name }}</span>
                    <span v-if="item.launcher && item.launcher.user" class="work-item-light">
                      <span @click.stop="$refs.df && $refs.df.handleDial([{name:item.launcher.user.mobile}])">{{ item.launcher.user.mobile || '' }}</span>
                    </span>
                    <span v-if="getCareLevel(item)" class="work-item-tag work-item-level">
                      {{ getCareLevel(item) }}
                    </span>
                  </p>

                  <!--服务名称-->
                  <p class="work-item-row">
                    <span class="work-item-desc">服务名称：{{ item.biz_service_name }}/{{ item.biz_subservice_name }}</span>
                  </p>

                  <!--摘要描述-->
                  <p v-if="item.detail" class="work-item-row">
                    <span class="work-item-desc">摘要描述：{{ item.detail }}</span>
                  </p>

                  <!--工单编号-->
                  <p class="work-item-row">
                    <span class="work-item-desc">工单编号：{{ item.no }}</span>
                  </p>

                  <!--残障情况-->
                  <p v-if="getDisabledLevel(item) || getDisableCategory(item)" class="work-item-row">
                    <span class="work-item-tag work-item-disability">
                      {{ getDisabledLevel(item) }}
                      <span>/</span>
                      {{ getDisableCategory(item) }}
                    </span>
                    <span
                      v-if="item.launcher.user.disabled_member && item.launcher.user.disabled_member.length"
                      class="work-item-tag work-item-disability"
                    >家属残障</span>
                  </p>
                </template>
              </div>
            </div>
          </div>
        </template>
        <noContentArea v-if="finished && list.length===0"></noContentArea>
      </van-list>
    </van-pull-refresh>
    <div class="download-btn">
      <van-checkbox v-model="allChecked" shape="square" checked-color="#E1AA6C" @click="selectedAll">全选</van-checkbox>
      <van-button
        :disabled="!downLoadLength"
        square
        block
        type="info"
        native-type="submit"
        color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
        style="width: 180px;border-radius: 10px;"
        @click="multipleDownload"
      >
        下载{{ downLoadLength ? `(${downLoadLength})`: '' }}
      </van-button>
    </div>
    <dial-phone ref="df" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import workAction from './components/workAction'
import { getItemByValue, isApp } from '@/utils/index'
import dialPhone from '@/views/components/dialPhone'
import noContentArea from 'views/components/noContentArea'
import { DeviceWorkTypes, SequenceWorkTypes, CleanWorkTypes, DecorationTypes } from '@/utils/const'
import { Dialog } from 'vant'

export default {
  name: 'WorkList',
  components: {
    noContentArea,
    workAction,
    dialPhone
  },
  props: {
    api: {
      type: Function,
      default: () => {}
    },
    params: {
      type: Object,
      default: () => {}
    },
    actions: {
      type: Array,
      default: () => []
    },
    downloadStatusText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showPicker: false,
      list: [],
      page: 1,
      pageSize: 30,
      loading: false,
      finished: false,

      // 设备工单
      DeviceWorkTypes,
      // 秩序工单
      SequenceWorkTypes,
      // 环境工单
      CleanWorkTypes,
      // 装修工单
      DecorationTypes,
      allChecked: false,
      downLoadLength: '',
      downloadStatus: 0, // 0 无下载内容，1下载中，2下载成功，3下载失败
      successList: [],
      errorList: [],
      pageLoading: false,
      downloadingLength: 0
    }
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ])
  },
  methods: {
    openTips () {
      Dialog.alert({
        title: '仅支持下载如下类型的工单',
        message: '工程保养计划、工程巡检计划、环境工作计划、秩序工作计划',
        confirmButtonText: '好的',
        theme: 'round-button',
        confirmButtonColor: '#E1AA6C'
      }).then(() => {
        // on close
      })
    },
    selectedAll () {
      this.list = this.list.map(e => {
        if (this.allChecked) {
          e._ischeck = true
        } else {
          e._ischeck = false
        }
        return e
      })
      this.downLoadLength = this.list.filter(t => t._ischeck).length
    },
    // 重新下载
    againDownload () {
      this.downloadingLength = this.errorList.length
      this.download(this.errorList)
    },
    // 批量下载
    multipleDownload () {
      const arr = this.list.filter(t => t._ischeck).map(t => t.record_id)
      this.downloadingLength = arr.length
      this.download(arr)
    },
    download (arr) {
      if (isApp()) {
        this.downloadStatus = 1
        this.pageLoading = true
        this.downloadWorkorder(arr, (res) => {
          // Dialog.alert({
          //   title: '返回的数据',
          //   message: res,
          //   confirmButtonText: '好的',
          //   theme: 'round-button',
          //   confirmButtonColor: '#E1AA6C'
          // }).then(() => {
          //   // on close
          // })

          this.pageLoading = false
          this.allChecked = false
          this.downLoadLength = 0
          this.allChecked = false
          arr.forEach(e => {
            this.list.find(item => item.record_id === e)._ischeck = false
          })

          // 判断是否下载过
          if (!res) {
            this.downloadStatus = 0
            this.successList = []
            this.errorList = []
            return
          }
          // 根据返回数组的数量判断成功与否
          if (!res.length) {
            this.downloadStatus = 3
            this.successList = []
            this.errorList = arr
            return
          }
          // 筛选出成功/失败的数据
          this.successList = arr.filter(e => res.indexOf(e) !== -1)
          this.errorList = arr.filter(e => res.indexOf(e) === -1)
          // 成功的处理：
          if (res && res.length && (res.length === arr.length)) {
            this.downloadStatus = 2
            setTimeout(() => {
              this.downloadStatus = 0
            }, 3000)
          }
          // 失败的处理：
          if (res && res.length && (res.length !== arr.length)) {
            this.downloadStatus = 3
          }
        })
      }
    },
    setDownloadText (text) {
      this.$set(this.order, '_downloadText', text)
      this.$emit('result', this.order)
    },
    getAllChecked () {
      this.allChecked = this.list.every(e => e._ischeck)

      this.downLoadLength = this.list.filter(t => t._ischeck).length
    },
    closeOverlay () {
      this.$emit('closeOverlay')
    },
    // 重要等级
    getCareLevel (item) {
      const level = item.launcher && item.launcher.user && item.launcher.user.care_level
      if (level && level === 2) {
        return getItemByValue(this.appConfig.USER_V2_CARE_LEVEL_LIST, level) + '客户'
      }
    },

    // 残障等级
    getDisabledLevel (item) {
      const level = item.launcher && item.launcher.user && item.launcher.user.disabled_level

      return level ? getItemByValue(this.appConfig.USER_V2_DISABLED_LEVEL_LIST, level) : ''
    },

    // 残障部位
    getDisableCategory (item) {
      const level = item.launcher && item.launcher.user && item.launcher.user.disabled_category

      return level ? getItemByValue(this.appConfig.USER_V2_DISABLED_CATEGORY_LIST, level) : ''
    },

    // 右上角状态显示
    getStatus (item) {
      // 处理中、挂起中展示节点名称，其他的展示状态
      if ([1, 2].indexOf(item.status) > -1) {
        return item['todo_node_name'] || ''
      }

      return getItemByValue(this.appConfig ? this.appConfig.WFE_FLOW_INSTANCE_STATUS : [], item.status) || ''
    },

    // 下拉刷新
    onRefresh () {
      this.page = 1
      this.onLoad(true)
    },

    // 加载数据
    onLoad (flag) {
      const data = {
        ...this.params,
        page: this.page,
        page_size: this.pageSize,
        source_str: '4,5,6,7' // 筛选来源为工程保养、工程巡检、环境、秩序计划工单下载
      }
      this.loading = true
      // 筛选参数
      for (const key in data) {
        if (data[key] === undefined || data[key] === '') {
          delete data[key]
        }
      }

      this.api(data).then(res => {
        this.loading = false
        if (res.code === 200) {
          if (res.data) {
            const arr = res.data.list || []

            if (!flag) {
              this.list = [...this.list, ...arr]
            } else {
              this.list = [...arr]
            }
            const tempArr = []
            this.list.forEach((item, index) => {
              if (this.allRight(item) && (item.is_my_todo && !item.need_grab && item.status === 1)) {
                tempArr.push(item)
              }
            })
            this.list = tempArr
            this.page++
            this.finished = this.list.length >= res.data.total || !arr.length
          } else {
            this.finished = true
          }
        } else {
          this.$toast(res.msg)
        }
      }).catch(() => {
        this.loading = false
        this.finished = true
      })
    },
    allRight (order) {
      let isRight = false
      if (DeviceWorkTypes.includes(order.source) && (order.task_device && order.task_device.eng_group.devices && order.task_device.eng_group.devices.some(item => !item.commit_id))) {
        isRight = true
      }
      if (CleanWorkTypes.includes(order.source) && (order.task_cleaning && order.task_cleaning.cleaning_group.location_points && order.task_cleaning.cleaning_group.location_points.some(item => !item.commit_id))) {
        isRight = true
      }
      if (SequenceWorkTypes.includes(order.source) && (order.task_guardian && order.task_guardian.guardian_group.location_points && order.task_guardian.guardian_group.location_points.some(item => !item.commit_id))) {
        isRight = true
      }
      return isRight
    },

    // 查看详情
    orderDetail (item) {
      if (item._ischeck) {
        item._ischeck = false
      } else {
        item._ischeck = true
      }
      this.$forceUpdate()
      this.getAllChecked()
    },

    // 处理工单
    dealOrder (order) {
      if (this.DeviceWorkTypes.includes(order.source)) {
        this.$router.push({
          name: 'PlanFacility',
          query: { orderId: order.record_id }
        })
        return
      }

      // 环境工单
      if (this.CleanWorkTypes.includes(order.source)) {
        this.$router.push({
          name: 'PlanFacilityClean',
          query: { orderId: order.record_id }
        })
        return
      }

      // 秩序工单
      if (this.SequenceWorkTypes.includes(order.source)) {
        this.$router.push({
          name: 'PlanFacilitySequence',
          query: { orderId: order.record_id }
        })
        return
      }
      // 裝修工單
      console.log(this.DecorationTypes.includes(this.flowInstance.source))
      if (this.DecorationTypes.includes(order.source)) {
        this.$router.push({ name: 'PlanFacilityDecoration', query: { order_id: order.record_id } })
        return
      }

      // 普通工单
      this.$router.push({
        name: 'WorkDeal',
        query: { id: order.todo_node_instance_id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .service-wrap {
    height: calc(100vh - constant(safe-area-inset-bottom));
    height: calc(100vh - env(safe-area-inset-bottom));
    overflow-y: scroll;
    overflow-x: hidden;
    background: #ffffff;
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
  }
  .download-overlay{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .download-tips{
      padding: 0  12px 0 12px;
      height: 40px;
      align-items: center;
      font-size: 13px;
      background: #F6F8FA;
      position: sticky;
      top: 0;
      left: 0;
      width: calc(100% - 24px);
      z-index: 1;
  }
  .download-status{
      padding: 0  12px 0 12px;
      height: 40px;
      align-items: center;
      font-size: 13px;
      position: sticky;
      left: 0;
      top: 40px;
      z-index: 1;
    //   background: #F6F8FA;
  }
  .work {
    &-list{
      background: #f6f8fa;
    }
    &-mgb20 {
      margin-bottom: 16px;
    }

    &-content {
      margin-bottom: 12px;
    }

    &-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-item {
      padding: 12px 16px 1px;
      box-sizing: border-box;
      background: #fff;
      margin-bottom: 10px;
      &:not(:first-child) {
        margin-top: 4px;
      }

      &-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      &-title {
        font-size: 16px;
        color: #282828;
        line-height: 24px;
        font-weight: 400;
      }

      &-status, &-desc, &-light {
        font-size: 14px;
        color: #999;
        font-weight: 400;
        line-height: 24px;
      }

      &-desc {
        color: #666;
      }

      &-light {
        color: #BC8D58;
        margin-left: 8px;
      }

      &-tag {
        padding: 2px 4px;
        box-sizing: border-box;
        border-radius: 4px;
        font-size: 12px;
        line-height: 16px;
        font-weight: 500;
      }

      &-level {
        margin-left: 8px;
        color: #FFAB2D;
        background: rgba(255, 171, 45, 0.15);
      }

      &-disability {
        margin-right: 8px;
        color: #FF4D4F;
        background: #FFEBEA;
      }

      &-bottom {
        padding-bottom: 12px;
      }

      .work-detail-urgent {
        width: 55px;
        color: #FA5151;
        background: #FEE5E5;
        border-radius: 4px;
        font-size: 12px;
        border: 0;
        margin-right: 10px;

        &-content {
          display: flex;
          align-items: center;
        }
      }
    }

    &-plant {
      float: right;
      line-height: 14px;
      margin-top: 6px;
    }
  }
  ::v-deep {
    .van-pull-refresh {
      min-height: 100%;
    }
  }
  .download-btn{
      position: fixed;
      left: 0;
      bottom: 0;
      width: calc(100% - 40px);
      display: flex;
      justify-content: space-between;
      background: #fff;
      padding: 10px 20px;
      box-shadow: 0px -4px 12px 0px rgba(0, 0, 0, 0.1);
}
</style>
