<template>
  <div class="fw-container middle-content">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-skeleton slot="loading" title avatar :row="5" :loading="loading"></van-skeleton>
        <div
          v-for="message in list"
          :key="message.id"
          class="list-item"
        >
          <div class="list-item-hd" :style="getStyle(message)">
            <div class="list-item-value">
              <p class="van-ellipsis">{{ category===2 ? '工单号：' : '' }}{{ category===1? message.title : message['dispatch_no'] }}</p>
            </div>
          </div>

          <div v-if="message.create_time" class="weui-panel__bd noborder">
            <div class="weui-media-box weui-media-box_text">
              <p class="weui-media-box__desc">{{ dayjs(message['create_time']).format('YYYY-MM-DD HH:mm') }}</p>
            </div>
          </div>
          <!--系统消息没有内容，到详情页展示-->
          <div v-if="category===2" class="weui-panel__bd noborder">
            <div class="weui-media-box weui-media-box_text">
              <p class="weui-media-box__desc">{{ message.title }}</p>
            </div>
          </div>
          <div v-if="category===1 && message.content" class="weui-panel__bd noborder">
            <div class="weui-media-box weui-media-box_text">
              <p class="weui-media-box__desc" v-html="message.content"></p>
            </div>
          </div>

          <div class="gradient-wrap">
            <div class="gradient-content"></div>
          </div>

          <div class="list-item-ft btn">
            <a class="list-item-btn list-item-btn_primary" href="javascript:" @click="showMessageDetail(message)">
              查看详情
            </a>
          </div>
        </div>
        <noContentArea v-if="!loading && list.length===0"></noContentArea>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { formatMessage } from 'utils/message'
import { minipStaffMessageList } from 'api/message'
import noContentArea from 'views/components/noContentArea'

export default {
  name: 'NoticeTpl',
  components: { noContentArea },
  props: {
    category: {
      type: Number,
      required: true,
      default: undefined
    }
  },
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
  methods: {
    getStyle (message) {
      const style = {}
      if (message.status === 2) {
        style.backgroundColor = '#d0d0d0'
      }
      return style
    },
    // 消息详情
    showMessageDetail (msg) {
      switch (msg.type) {
        case 1: // 内部通知
          this.$router.push({ name: 'DetailMessage', query: { id: msg.id, bizId: msg.biz_id } })
          break
        case 2: // 工单消息
          this.$router.push({ name: 'DetailWork', query: { id: msg.biz_id, msgId: msg.id } }) // 由于查不到recordId，所以暂时跳转到工单列表页
          break
      }
    },

    onRefresh () {
      this.page = 1
      this.onLoad(true)
    },

    onLoad (useNew) {
      const data = {
        category: this.category,
        page: this.page,
        page_size: this.pageSize
      }
      this.loading = true
      minipStaffMessageList(data).then(res => {
        this.loading = false
        if (res.code === 200 && res.data.list) {
          if (!useNew) {
            this.list = [...this.list, ...formatMessage(res.data.list)]
          } else {
            this.list = [...formatMessage(res.data.list)]
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
      border-radius: 8px;margin: 12px 12px;
      .weui-panel__hd,  .weui-cell__bd { color: white;text-shadow: 1px 1px 1px #999999; }
    }
    .list-item{
      margin: 16px 16px 0;
      .weui-media-box__desc{ color: #333;padding-top: 0; }
    }
  }
</style>
