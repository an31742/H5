<template>
  <div class="main-wrap">
    <van-sticky z-index="999">
      <van-tabs v-model="activeName" color="#ef9310">
        <van-tab title="当日打卡" name="CheckOn" replace :to="{name: 'CheckOn'}"></van-tab>
        <van-tab title="考勤统计" name="CheckStatistic" replace :to="{name: 'CheckStatistic'}"></van-tab>
      </van-tabs>
    </van-sticky>
    <router-view/>
    <div v-if="$route.meta.hasFooter">
      <div style="height: 60px;"></div>
      <footer-tabbar/>
    </div>
  </div>
</template>

<script>
import FooterTabbar from 'components/FooterTabbar'

export default {
  name: 'CheckLayouts',
  components: {
    FooterTabbar
  },
  data () {
    return {
      activeName: this.$route.name
    }
  },
  watch: {
    '$route.name' (val) {
      this.activeName = val
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
      color: #D0D0D0;
    }
    .van-tab--active .van-tab__text {
      font-weight: bold;
      color: #000;
    }
    .van-tabs__line {
      width: 20px !important;
    }
  }
</style>
