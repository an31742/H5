<template>
  <div class="fw-container middle-content">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-skeleton slot="loading" title avatar :row="5" :loading="loading"></van-skeleton>
        <template v-if="list.length>0">
          <div v-for="(item, idx) in list" :key="idx" class="list-item ustomStyle">
            <div v-if="item['dispatch_order']" class="list-item-hd">
              <div class="list-item-item">
                <label class="list-item-label ub-f1">
                  工单号： {{ item['dispatch_order'].dispatch_no }}</label>
                <div>{{ getStatusText(item['dispatch_order'].dispatch_status) }}</div>
              </div>
            </div>
            <div class="list-item-bd">
              <div v-if="item['dispatch_order']['user_name']" class="list-item-item noborder">
                <label class="list-item-label">报事人</label>
                <span class="list-item-value">
                  <p class="van-ellipsis">
                    {{ item['dispatch_order']['user_name'] || '' }}
                    <a :href="`tel:${item['dispatch_order'].user_mobile }`">{{ item['dispatch_order'].user_mobile }}</a>
                  </p>
                </span>
              </div>
              <div v-if="item['dispatch_order'].appeal_create_time" class="list-item-item">
                <div class="list-item-label">提交时间</div>
                <div class="list-item-value">
                  <p class="van-ellipsis">{{ dayjs(item['dispatch_order'].appeal_create_time).format('YYYY-MM-DD HH:mm:ss') }}</p>
                </div>
              </div>
              <template v-if="item.dispatch_order.from_source === 3">
                <div v-if="item['dispatch_order'].appeal_detail" class="list-item-item">
                  <label class="list-item-label">报警信息</label>
                  <div class="list-item-value"><p class="van-ellipsis" v-html="item['dispatch_order'].appeal_detail"></p></div>
                </div>
                <div v-if="item['dispatch_order'].room_location" class="list-item-item ">
                  <label class="list-item-label">摄像头位置</label>
                  <div class="list-item-value">
                    <p class="van-ellipsis">{{ item['dispatch_order'].room_location }}</p>
                  </div>
                </div>
              </template>
              <template v-else>
                <div v-if="item['dispatch_order'].appeal_detail" class="list-item-item">
                  <label class="list-item-label">报事内容</label>
                  <div class="list-item-value"><p class="van-ellipsis" v-html="item['dispatch_order'].appeal_detail"></p></div>
                </div>
                <div v-if="item['dispatch_order'].room_location" class="list-item-item ">
                  <label class="list-item-label">报事位置</label>
                  <div class="list-item-value">
                    <p class="van-ellipsis">{{ item['dispatch_order'].room_location }}</p>
                  </div>
                </div>
              </template>

              <div class="gradient-wrap">
                <div class="gradient-content"></div>
              </div>
              <div style="height: 1px;" class="bgfff"></div>

              <div class="list-item-item ">
                <label class="list-item-label">派工时间</label>
                <div class="list-item-value">
                  <p class="van-ellipsis">
                    {{ dayjs(item['dispatch_order'].dispatch_order).format('YYYY-MM-DD HH:mm:ss') }}
                  </p>
                </div>
              </div>
              <div class="list-item-item">
                <label class="list-item-label">预计工期</label>
                <div class="list-item-value">
                  <p class="van-ellipsis">
                    {{ getExpectHour(item['dispatch_order'], item.question) }}小时
                  </p>
                </div>
              </div>
              <div v-if="item['dispatch_order'].dispatch_description" class="list-item-item">
                <label class="list-item-label">备注</label>
                <div class="list-item-value">
                  <p class="van-ellipsis">{{ item['dispatch_order'].dispatch_description }}</p>
                </div>
              </div>
            </div>
            <div class="list-item-ft">
              <a
                class="list-item-btn list-item-btn_primary"
                href="javascript:"
                @click="$router.push({name: 'DetailWork', query: { id: item['dispatch_order'].dispatch_order_id }})"
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
import { minipStaffOrderTodoList } from 'api/order'
import noContentArea from 'views/components/noContentArea'

export default {
  name: 'WorkTodo',
  components: { noContentArea },
  data () {
    return {
      dayjs,
      list: [],
      page: 1,
      pageSize: 10,
      loading: false,
      finished: false
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

    getExpectHour (item, question) {
      let time = question.response_time
      if (item.dispatch_status === 2) {
        time = question.process_time
      }
      if (item.dispatch_status === 3) {
        time = question.check_time
      }

      return time ? Math.floor(time / 60 * 100) / 100 : 0 // 分转换成小时
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
      minipStaffOrderTodoList(data).then(res => {
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
    .customStyle {
      background-color: rgb(31, 169, 234);border-radius: 8px;margin: 12px 12px;
      .list-item-label, .list-item-value, .weui-form-preview__btn {color: white;text-shadow: 1px 1px 1px #999999;}
    }
  }
  .list-item{margin: 16px 16px 0;}
</style>
