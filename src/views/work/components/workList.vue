<template>
  <div>
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

                    <span class="work-item-status" style="display: inline-block;margin-top: 1px;float: right;"><span style="margin-right:10px;">{{ item._downloadText || '' }}</span>{{ getStatus(item) }}</span>
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

              <!--底部操作栏-->
              <work-action
                :isDownload="isDownLoad"
                :order.sync="item"
                fromType="list"
                @refresh="onRefresh"
                @deal="dealOrder(item)"
                @result="result"
              ></work-action>
            </div>
          </div>
        </template>
        <noContentArea v-if="finished && list.length===0"></noContentArea>
      </van-list>
    </van-pull-refresh>

    <dial-phone ref="df" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import workAction from './workAction'
import { getItemByValue } from '@/utils/index'
import dialPhone from '../../components/dialPhone'
import noContentArea from 'views/components/noContentArea'
import { DeviceWorkTypes, SequenceWorkTypes, CleanWorkTypes, QualityWorkTypes, DecorationTypes } from '@/utils/const'

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
    downloadStatusText: {
      type: String,
      default: ''
    },
    isDownLoad: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showPicker: false,
      list: [],
      page: 1,
      pageSize: 10,
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
      // 品质工单
      QualityWorkTypes
    }
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ])
  },
  methods: {
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
        page_size: this.pageSize
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
            console.log('this.list', this.list)
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

    // 查看详情
    orderDetail (item) {
      this.$router.push({ name: 'WorkDetail', query: { id: item.record_id, download: this.isDownLoad } })
    },

    // 点击的下载的按钮的结果
    result (order) {
      console.log(order)
      this.list.forEach(e => {
        if (e.record_id === order.record_id) {
          e._downloadText = order._downloadText
        }
      })
    },
    // 处理工单
    dealOrder (order) {
      console.log(order, 'orderorder')
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
      if (this.DecorationTypes.includes(order.source)) {
        this.$router.push({ name: 'PlanFacilityDecoration', query: { order_id: order.record_id } })
        return
      }

      // 品质工单
      if (this.QualityWorkTypes.includes(order.source)) {
        this.$router.push({
          name: 'PlanFacilityQuality',
          query: { orderId: order.record_id }
        })
        return
      }
      // 普通工单
      this.$router.push({
        name: 'WorkDeal',
        query: { id: order.todo_node_instance_id },
        params: {
          flowInstance: {
            biz_service_id: order.biz_service_id,
            group_id: order.group_id
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .work {
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
</style>
