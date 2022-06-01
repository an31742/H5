<template>
  <div>
    <van-sticky z-index="999">
      <van-tabs v-model="activeName" style="height: 100vh;overflow-y: auto;">
        <van-tab title="工单列表" name="list">
          <Work />
        </van-tab>
        <van-tab title="工单概况" name="content">
          <WorkOverview />
        </van-tab>
      </van-tabs>
    </van-sticky>
  </div>
</template>

<script>
import Work from './workIndex'
import WorkOverview from 'views/work/workOverview'
export default {
  name: 'SearchWork',
  components: {
    Work,
    WorkOverview
  },
  data () {
    return {
      activeName: 'list'
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .van-tabs__content {
    height: calc(100% - 47px);
    .van-tab__pane {
      height: 100%;
    }
    .van-tabs__line {
      background: red;
      width: 13px!important;
      height: 3px;
    }
  }
}
</style>
