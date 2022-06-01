<!--
  功能：切换订单状态，显示此状态的所有订单
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月18日 14:42:27
-->
<template>
  <!-- 订单状态 -->
  <van-tabs class="tabs" v-model="active" @click="changeTab">
    <van-tab
      v-for="(item, index) in status"
      :key="item.type"
      :title="item.text"
      class="tab-container"
    >
      <van-pull-refresh class="tab-container__refresh" v-model="item.refreshing" @refresh="onRefresh(index)">
        <van-list
          v-model="item.loading"
          class="list bdt"
          :finished="item.finished"
          finished-text="没有更多了"
          @load="onLoad(index)"
        >
          <div class="list-item--bg" v-if="item.list && item.list.length > 0">
            <list-item
              v-for="i in item.list"
              :key="i.time"
              :item="i"
              :pageType="pageType"
            />
          </div>
          <template #finished>
            <div>
              <div v-if="item.list.length > 0" class="van-list__finished-text">没有更多了</div>
            </div>
          </template>
          <list-empty v-if="!item.loading && !item.list.length" :desc="`暂无${item.text}订单`"/>
        </van-list>
      </van-pull-refresh>
    </van-tab>
  </van-tabs>
</template>

<script>
import { getAppraisalList, getReclaimList } from 'api/getHomeReclaim'
import { fen2yuan, phoneEncryption } from '@/utils'
import { homeReclaim } from '@/utils/const'
import { mapGetters } from 'vuex'

export default {
  // 组件名称
  name: 'EvaluationList',
  // 组件参数 接收来自父组件的数据
  props: {
    pageType: {
      // 页面类型
      type: String,
      default: ''
    },
    orderStatus: {
      type: Array,
      default: () => ([])
    }
  },
  // 局部注册的组件
  components: {
    ListItem: () => import('./ListItem/index.vue'),
    ListEmpty: () => import('./ListEmpty/index.vue')
  },
  // 组件状态值
  data () {
    return {
      status: this.orderStatus,
      active: 0,
      oneLoad: true
    }
  },
  activated () {
    this.updateList()
  },
  // 计算属性
  computed: {
    ...mapGetters([
      'updateListData'
    ]),
    typeList () {
      return this.appConfig.ESTIMATE_GOODS_CATEGORY_LIST || [
        {
          label: '手机&3C',
          value: 1
        },
        {
          label: '家电',
          value: 2
        }
      ]
    }
  },
  watch: {
    updateListData: {
      deep: true,
      handler (val) {
        if (Object.keys(val).length > 0) this.updateList()
      }
    }
  },
  // 组件方法
  methods: {
    onLoad (index) {
      if (homeReclaim.evaluation === this.pageType) this.getAppraisalList(this.status[index])
      if (homeReclaim.valet === this.pageType) this.getAppraisalList(this.status[index])
      if (homeReclaim.reclaim === this.pageType) this.getReclaimList(this.status[index])
    },
    // 获取估价单
    getAppraisalList (item) {
      item.loading = true
      getAppraisalList({
        statuses: item.key,
        page: ++item.page,
        page_size: item.page_size,
        last_estimate_order_id: item.last_order_id || 0,
        self_submit: homeReclaim.valet === this.pageType
      }).then((res) => {
        if (res.code !== 200) return
        const list = res.data?.list || []
        list.forEach(i => {
          i.title = this.typeList.find(e => e.value === i.goods_category).label
          homeReclaim.valet === this.pageType && (i.type = this.updateEvaluationType(i.status))
          homeReclaim.evaluation === this.pageType && (i.type = item.type)
          i.appraisal && (i.appraisalText = `¥${fen2yuan(i.appraisal)}`)
          i.consumer_name && (i.desc = `<span style="color: #E1AA6C">${i.consumer_name} ${phoneEncryption(i.consumer_mobile)}</span>`)
        })
        res.data.list = list
        this.computedListItem(res, item)
      }).catch((e) => {
        item.loading = false
      })
    },
    onRefresh (index) {
      const item = this.status[index]
      item.finished = false
      item.last_order_id = 0
      item.page = 0
      this.onLoad(index)
    },
    changeTab (index) {
      this.onRefresh(index)
    },
    // 获取回收订单
    getReclaimList (item) {
      item.loading = true
      getReclaimList({
        status: item.key,
        page: ++item.page,
        page_size: item.page_size,
        last_order_id: item.last_order_id || 0
      }).then((res) => {
        if (res.code !== 200) return
        const list = res.data?.list || []
        list.forEach(i => {
          i.title = i.room_name
          i.type = item.type
          i.appraisal && (i.appraisalText = `¥${fen2yuan(i.appraisal)}`)
          i.dealAmount = i.face_user_price && `¥${fen2yuan(i.face_user_price)}` || ''
          i.consumer_name && (i.desc = `<span style="color: #E1AA6C">${i.consumer_name} ${phoneEncryption(i.consumer_mobile)}</span>`)
        })
        res.data.list = list
        this.computedListItem(res, item)
      }).catch(() => {
        item.loading = false
      })
    },
    // 数据处理
    computedListItem (res, item) {
      const { total = 0, list, statistics } = res?.data ?? {}
      const selectTagStatus = statistics.select_tag_status
      if (item.refreshing) {
        item.list = []
        item.refreshing = false
      }
      if (this.oneLoad) this.setPageStatus(item, list, selectTagStatus)
      item.total = total
      item.page === 1 && (item.list = list) || (item.list = [...item.list, ...list])
      item.last_order_id = item.list[item.list.length - 1]?.order_id || 0
      item.finished = list.length < item.page_size
      item.loading = false
    },
    setPageStatus (item, list, selectTagStatus) {
      if (item.page === 1 && list.length === 0) {
        if (selectTagStatus) {
          this.active = this.status.findIndex((i) => Number(i.key) === selectTagStatus)
        } else {
          this.$emit('setNoDataStatus')
        }
      }
      this.oneLoad = false
    },
    updateEvaluationType (orderStatus) {
      const types = [
        {
          text: homeReclaim.STAFF_STATUS_NO_EVALUATE,
          key: 1
        },
        {
          text: homeReclaim.STAFF_STATUS_EVALUATE,
          key: 2
        },
        {
          text: homeReclaim.STAFF_EVALUATION_STATUS_END,
          key: 3
        },
        {
          text: homeReclaim.STAFF_EVALUATION_STATUS_CANCEL,
          key: 4
        }
      ]
      const it = types.find(i => i.key === orderStatus)
      if (it && it.text !== this.type) {
        return it.text
      }
      return ''
    },
    updateList () {
      if (this.pageType !== this.updateListData?.pageType ?? '') return
      const isDelete = this.updateListData?.deleteItem || false
      if (isDelete) this.deleteStatusList()
      const isRefresh = this.updateListData?.refresh || false
      if (isRefresh) this.deepReload()
      this.$store.dispatch('getHomeReclaim/setUpdateListData', {})
    },
    // 更新显示--当前状态删除某条数据
    deleteStatusList () {
      const list = this.status[this.active].list
      const index = list.findIndex(i => i.order_id === this.updateListData.orderId)
      if (index === -1) return
      // 删除此状态下的数据
      this.$delete(this.status[this.active].list, index)
    },
    // 更新显示--重新加载页面
    deepReload () {
      this.oneLoad = true
      this.active = 0
      this.onRefresh(this.active)
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    div, span img, p, ul, li {
      box-sizing: border-box;
    }
    .van-tabs__wrap {
      flex: none;
      box-sizing: content-box;
      div, span {
        box-sizing: content-box;
      }
    }
    .van-tabs__content {
      flex: 1;
      background-color: #f5f5f5;
      padding-bottom: 64px;
    }
  }
  .tabs {
    height: 100%;
    background-color: #f5f5f5;
  }
  .tab-container {
    height: 100%;
    &__refresh {
      height: 100%;
    }
  }
  .list {
    height: 100%;
    border-top: none;
    &-item--bg {
      background-color: #fff;
    }
    ::v-deep .van-list__finished-text {
      flex: none;
      background-color: #f5f5f5;
    }
  }
</style>
