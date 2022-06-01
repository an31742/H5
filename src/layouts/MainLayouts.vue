<template>
  <div class="main-wrap">
    <keep-alive>
      <router-view class="kar-main" />
    </keep-alive>
    <div v-if="$route.meta.hasFooter">
      <div style="height: 50px;"></div>
      <footer-tabbar/>
    </div>
  </div>
</template>

<script>
// 暂时用不到 111
// 带footer的布局，比如首页、个人中心、公告页面
import FooterTabbar from 'components/FooterTabbar'
export default {
  name: 'MainPage',
  components: {
    FooterTabbar
  }
}
</script>
