<template>
  <div class="fw-container">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-skeleton slot="loading" title avatar :row="5" :loading="loading"></van-skeleton>
        <div v-for="item in list" :key="item.id" class="list-item">
          <div class="list-item-hd">
            <div class="list-item-value">
              <p class="van-ellipsis">{{ dayjs(item.create_time).format('YYYY-MM-DD HH:mm') }}</p>
            </div>
          </div>
          <div class="weui-panel__bd noborder">
            <div class="weui-media-box weui-media-box_text">
              <p class="weui-media-box__desc">￥{{ (item.should_pay_fee/100).toFixed(2) }} 元</p>
            </div>
          </div>
        </div>
        <noContentArea v-if="!loading && list.length===0"></noContentArea>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getQrcodeBillList } from 'api/qrcode'
import noContentArea from 'views/components/noContentArea'

export default {
  name: 'DetailQrcodeBillDetail',
  components: { noContentArea },
  data () {
    return {
      dayjs,
      list: [],
      page: 1,
      qrcodeId: parseInt(this.$route.query.id),
      pageSize: 10,
      loading: false,
      finished: false
    }
  },
  methods: {
    onRefresh () {
      this.page = 1
      this.onLoad(true)
    },

    onLoad (useNew) {
      const data = {
        qrcode_id: this.qrcodeId,
        page: this.page,
        page_size: this.pageSize
      }
      this.loading = true
      getQrcodeBillList(data).then(res => {
        this.loading = false
        if (res.code === 200 && res.data.list) {
          if (!useNew) {
            this.list = [...this.list, ...res.data.list]
          } else {
            this.list = [...res.data.list]
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
    .list-item{
      margin: 16px 16px 0;
      .weui-media-box__desc{ color: #333;padding-top: 0; }
    }
  }
</style>
