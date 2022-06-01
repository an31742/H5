<template>
  <div class="fw-container middle-content">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-skeleton slot="loading" title avatar :row="5" :loading="loading"></van-skeleton>
        <template v-if="list.length>0">
          <div v-for="(item, idx) in list" :key="idx" class="list-item">
            <div class="list-item-hd">
              <div class="list-item-item">
                <label class="list-item-label ub-f1">
                  {{ item['user_name'] || '' }} {{ item['user_mobile'] || '' }}</label>
                <div>{{ getStatusText(item.dispatch_status) }}</div>
              </div>
            </div>
            <div class="list-item-bd">
              <div v-if="item.dispatch_order_no" class="list-item-item">
                <label class="list-item-label">工单号</label>
                <span class="list-item-value"><p class="van-ellipsis">{{ item.dispatch_order_no }}</p></span>
              </div>
              <template v-if="item.from_source === 3">
                <div v-if="item.appeal_detail" class="list-item-item">
                  <label class="list-item-label">报警信息</label>
                  <div class="list-item-value"><p class="van-ellipsis" v-html="item.appeal_detail"></p></div>
                </div>
                <div v-if="item.room_location" class="list-item-item">
                  <label class="list-item-label">摄像头位置</label>
                  <div class="list-item-value"><p class="van-ellipsis">{{ item.room_location }}</p></div>
                </div>
              </template>
              <template v-else>
                <div v-if="item.appeal_detail" class="list-item-item">
                  <label class="list-item-label">报事内容</label>
                  <div class="list-item-value"><p class="van-ellipsis" v-html="item.appeal_detail"></p></div>
                </div>
                <div v-if="item.room_location" class="list-item-item">
                  <label class="list-item-label">报事位置</label>
                  <div class="list-item-value"><p class="van-ellipsis">{{ item.room_location }}</p></div>
                </div>
              </template>
              <div v-if="item.appeal_create_time" class="list-item-item">
                <label class="list-item-label">提交时间</label>
                <div class="list-item-value"><p class="van-ellipsis">{{ dayjs(item.appeal_create_time).format('YYYY-MM-DD HH:mm:ss') }}</p></div>
              </div>
              <div v-if="item.dispatch_create_time" class="list-item-item">
                <label class="list-item-label">派工时间</label>
                <div class="list-item-value"><p class="van-ellipsis">{{ dayjs(item.dispatch_create_time).format('YYYY-MM-DD HH:mm:ss') }}</p></div>
              </div>
              <div v-if="item.dispatch_repair_time" class="list-item-item">
                <label class="list-item-label">完成时间</label>
                <div class="list-item-value"><p class="van-ellipsis">{{ dayjs(item.dispatch_repair_time).format('YYYY-MM-DD HH:mm:ss') }}</p></div>
              </div>
              <!--<div class="list-item-item" v-if="item['dispatch_order'] && item['dispatch_order'].expect_task_time">-->
              <!--<label class="list-item-label">实际/预计工时</label>-->
              <!--<div class="list-item-value"><p class="van-ellipsis">{{ item.real_task_time }} / {{ item.expect_task_time }}小时</p></div>-->
              <!--</div>-->
            </div>
            <div class="list-item-ft">
              <a
                class="list-item-btn list-item-btn_primary"
                href="javascript:"
                @click="$router.push({name: 'DetailWork', query: {id: item.dispatch_order_id}})"
              >
                查看详情
              </a>
            </div>
          </div>
        </template>
        <noContentArea v-if="finished && list.length===0"></noContentArea>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { formatAppeal } from 'utils/appeal'
import { minipStaffOrderDoneList } from 'api/order'
import noContentArea from 'views/components/noContentArea'

export default {
  name: 'WorkDone',
  components: { noContentArea },
  data () {
    return {
      dayjs,
      list: [],
      page: 1,
      pageSize: 10,
      finished: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ])
  },
  methods: {
    getStatusText (status) {
      const st = this.appConfig.DISPATCH_ORDER_STATUS.find(item => item.value === status)
      if (st) {
        return st.label
      } else {
        return '未知'
      }
    },

    onRefresh () {
      this.page = 1
      this.onLoad(true)
    },

    onLoad (useNew) {
      const data = {
        page: this.page,
        page_size: this.pageSize
      }
      this.loading = true
      minipStaffOrderDoneList(data).then(res => {
        this.loading = false
        if (res.code === 200 && res.data.list) {
          if (!useNew) {
            this.list = [...this.list, ...formatAppeal(res.data.list)]
          } else {
            this.list = [...formatAppeal(res.data.list)]
          }
          this.page++
          this.finished = this.list.length >= res.data.total
        } else {
          this.finished = true
        }
      }).catch(() => {
        this.loading = false
        this.finished = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .fw-container {
    .list-item{margin: 16px 16px 0;}
    .customStyle {
      .list-item-label, .list-item-value, .weui-form-preview__btn {color: white;text-shadow: 1px 1px 1px #999999;}
    }
  }
</style>
