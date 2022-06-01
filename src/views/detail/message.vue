<template>
  <div class="fw-container bgfff">
    <!--内容区-->
    <div>
      <h3 class="van-multi-ellipsis--l3">{{ message.title }}</h3>
      <p class="more-info">
        <span class="author">
          {{ dayjs(message.update_time).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </p>
      <div class="message-main-content" v-html="message.content"></div>
    </div>
  </div>
</template>

<script>
import { minipStaffMessageGet, minipStaffMessageRead } from 'api/message'
import dayjs from 'dayjs'

export default {
  name: 'MessageDetail',
  data () {
    return {
      dayjs,
      message: {},
      loading: false,

      msgId: this.$route.query.id || '',
      bizId: this.$route.query.bizId || ''
    }
  },
  created () {
    if (!this.msgId) {
      this.$router.back()
      return
    }

    // 接口参数
    this.query = { id: +(this.bizId || this.msgId) }
    this.getNoticeDetail()
    this.readMessage()
  },
  methods: {
    // 获取消息
    async getNoticeDetail () {
      const api = minipStaffMessageGet
      const result = await api(this.query)
      if (result.code === 200) {
        this.message = result.data || {}
        return
      }
      if (result.code === 401) {
        this.$router.replace({ name: 404 })
        return
      }
      this.$toast(result.msg || '获取消息失败')
    },

    readMessage () {
      minipStaffMessageRead({ id: +this.msgId }).then(res => {
        if (res.code !== 200) {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style type="text/css" lang="scss">
  .message-main-content {
    width: 100%;
    word-break: break-all;
    padding: 15px 0;
    overflow: hidden;

    p {
      font-size: 0.9em;
      line-height: 2em;
    }

    img {
      width: 100% !important;
    }
  }
</style>

<style lang="scss" scoped>
  .fw-container {
    > div {
      padding: 15px 15px 0;
    }
    .van-multi-ellipsis--l3{
      font-size: 20px;
      color: #333;
    }
    .author{
      color: #999;
      font-size: 14px;
    }
  }
</style>
