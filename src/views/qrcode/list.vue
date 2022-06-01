<template>
  <div class="fw-container">
    <van-popup v-model="qrCodeShow" class="pop-qrcode flex" :close-on-click-overlay="false" closeable>
      <div class="qrcodeContainer">
        <h3 class="title">{{ currentItem.title }}</h3>
        <div class="qrcode">
          <qriously :value="qrValue" :size="150"/>
        </div>
        <p class="desc">{{ currentItem.qrcode_no }}</p>
      </div>
    </van-popup>

    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-skeleton slot="loading" title avatar :row="5" :loading="loading"></van-skeleton>
        <div v-for="item in list" :key="item.id" class="list-item">
          <div class="list-item-hd">
            <div class="list-item-value">
              <p>{{ item.title }}</p>
            </div>
          </div>
          <div class="weui-panel__bd noborder">
            <div class="weui-media-box weui-media-box_text">
              <a style="color: #BC8D58;" href="javascript:;" class="weui-media-box__desc" @click="showQrcode(item)">{{ item.qrcode_no }}（点击展示收款码）</a>
            </div>
          </div>
          <div v-if="item.description" class="weui-panel__bd noborder">
            <div class="weui-media-box weui-media-box_text">
              <p class="weui-media-box__desc" v-html="item.description"></p>
            </div>
          </div>
          <div class="weui-panel__bd noborder">
            <div class="weui-media-box weui-media-box_text">
              <p class="weui-media-box__desc">{{ dayjs(item['create_time']).format('YYYY-MM-DD HH:mm') }}</p>
            </div>
          </div>
          <div class="list-item-ft btn">
            <a class="list-item-btn list-item-btn_primary" href="javascript:" @click="showQrcodeDetail(item)">
              查看收款记录
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
import { getQrcodeList } from 'api/qrcode'
import noContentArea from 'views/components/noContentArea'

export default {
  name: 'DetailQrcodeList',
  components: { noContentArea },
  data () {
    return {
      dayjs,
      list: [],
      page: 1,
      pageSize: 10,
      loading: false,
      finished: false,

      currentItem: {},
      qrCodeShow: false,
      qrValue: '',
      showImage: false,
      imageUrl: ''
    }
  },
  methods: {
    // 消息详情
    showQrcodeDetail (record) {
      this.$router.push({ name: 'QrcodeDetail', query: { id: record.id } })
    },

    /**
     * 刷新
     */
    onRefresh () {
      this.page = 1
      this.onLoad(true)
    },

    showQrcode (qrcodeItem) {
      this.qrCodeShow = true
      this.qrValue = `${qrcodeItem.h5user_app_url}/pay/qrcode?app_id=${qrcodeItem.h5user_app_id}&id=${qrcodeItem.id}`
      this.currentItem = qrcodeItem
    },

    onLoad (useNew) {
      const data = {
        page: this.page,
        page_size: this.pageSize
      }
      this.loading = true
      getQrcodeList(data).then(res => {
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
    .qrcodeContainer {
      color: black;
      background: #47b34f;
      text-align: center;
      margin: 50px 20px 20px 20px;
      padding: 20px 20px 40px 20px;

      .title {
        margin-bottom: 5px;
        font-size: 16px;
      }

      .qrcode {
        background: white;
        padding: 10px;
        div {
          line-height: 1;
        }
      }

      .desc {
        font-size: 12px;
      }
    }
  }
</style>
