<template>
  <van-tabs
    v-model="activeName"
    sticky
    color="#ef9310"
    class="tabs-layout"
    title-active-color="#333"
  >
    <van-tab
      v-for="(tab, index) in tabs"
      :key="index"
      :title="tab.title"
      :name="tab.routeName"
      replace
      :to="{name: tab.routeName, query: {...$route.query, ...tab.query || {} }}"
    >
      <router-view/>
    </van-tab>
  </van-tabs>
</template>

<script>
// 多tab页layout，带自动吸顶功能
export default {
  name: 'TabCardLayout',
  props: {
    tabs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      activeName: this.$route.name
    }
  },
  watch: {
    '$route.name': {
      handler (val) {
        this.activeName = val || 'AppealInfo'
      },
      immediate: true
    }
  },
  methods: {
    onClick (name, title) {
      console.log('onClick', name, title)
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .van-tabs__wrap {
      margin-bottom: 4px;
    }
    .van-tabs__content {
      height: calc(100% - 47px);
      .van-tab__pane {
        height: 100%;
        overflow: hidden;
      }
      .van-tabs__line {
        background: red;
        width: 13px!important;
        height: 3px;
      }
    }
  }
</style>
