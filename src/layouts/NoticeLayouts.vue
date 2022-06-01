<template>
  <div class="main-wrap">
    <template v-if="!allNum && !loading">
      <div class="notice-empty">
        <img class="notice-empty-image" src="~assets/notice-nodata.png" />
        <span class="notice-empty-text">没有消息</span>
      </div>
    </template>

    <template v-else>
      <van-sticky z-index="999">
        <van-tabs v-model="activeName" color="#ef9310">
          <van-tab name="MessageWork" :to="{ name: 'MessageWork' }">
            <template #title>
              工单消息
              <span v-if="workOrderNum">
                ({{ workOrderNum }})
              </span>
            </template>
          </van-tab>

          <van-tab name="MessageApproval" :to="{ name: 'MessageApproval' }">
            <template #title>
              我的审批
              <span v-if="approvalNum">
                ({{ approvalNum }})
              </span>
            </template>
          </van-tab>

          <van-tab name="MessageNotice" :to="{ name: 'MessageNotice' }">
            <template #title>
              通知公告
              <span v-if="innerNoticeNum">
                ({{ innerNoticeNum }})
              </span>
            </template>
          </van-tab>
        </van-tabs>
      </van-sticky>

      <keep-alive>
        <router-view class="kar-notice" />
      </keep-alive>
    </template>

    <div v-if="$route.meta.hasFooter">
      <div style="height: 50px;"></div>
      <footer-tabbar></footer-tabbar>
    </div>
  </div>
</template>

<script>
import FooterTabbar from 'components/FooterTabbar'
import { mapState } from 'vuex'

export default {
  name: 'NoticePage',
  components: {
    FooterTabbar
  },
  data () {
    return {
      activeName: this.$route.name,
      loading: false
    }
  },
  computed: {
    ...mapState({
      allNum: state => state.message.all_num,
      approvalNum: state => state.message.approval_unread_num,
      workOrderNum: state => state.message.work_order_unread_num,
      innerNoticeNum: state => state.message.inner_notice_unread_num
    })
  },
  watch: {
    '$route.name' (val) {
      this.activeName = val
    }
  },
  created () {
    this.init()
  },
  methods: {
    handleNums (num) {
      return num > 99 ? '99+' : num
    },

    init () {
      this.loading = true
      this.$store.dispatch('message/updateMessageStatistics')
      this.loading = false
    }
  }
}
</script>

<style type="text/css" lang="scss">
.main-wrap {
  .van-tabs__content {
    padding-top: 0;
  }
  .van-tab__text {
    display: flex;
    align-items: center;
    position: relative;
    overflow: inherit;
  }
}
.notice-badge {
  min-width: 17px;
  height: 17px;
  padding: 0 2px;
  box-sizing: border-box;
  border-radius: 8px;
  background: -webkit-linear-gradient(#fd8989, #ff6464);
  color: #fff;
  font-size: 10px;
  display: block;
  text-align: center;
  line-height: 17px;
  margin-left: 4px;
  position: absolute;
  right: -26px;
  top: 1px;
}
.notice-empty {
  height: calc(100vh - 50px);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &-image {
    width: 250px;
    margin-bottom: 20px;
  }

  &-text {
    font-size: 14px;
    color: #bc8d58;
    line-height: 20px;
    font-weight: 400;
  }
}
</style>
