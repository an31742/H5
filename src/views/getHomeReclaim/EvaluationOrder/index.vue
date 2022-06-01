<template>
  <div class="evaluate-order-page">
    <search class="qy-flex-none" :type="attr.pageType" :isReadonly="true" />
    <list
      v-if="!noData"
      ref="list"
      class="evaluate-list"
      v-bind="attr"
      @setNoDataStatus="setNoDataStatus"
    />
    <list-empty v-if="noData" />
  </div>
</template>

<script>
import { homeReclaim } from '@/utils/const.js'
import Search from 'views/getHomeReclaim/Components/Search.vue'
import List from 'views/getHomeReclaim/Components/List.vue'
import ListEmpty from 'views/getHomeReclaim/Components/ListEmpty/index.vue'
const status = {
  loading: false,
  finished: false,
  refreshing: false,
  total: 0,
  page: 0,
  page_size: 10,
  last_order_id: null,
  list: []
}

export default {
  name: 'Evaluation',
  components: {
    Search,
    List,
    ListEmpty
  },
  data () {
    return {
      noData: false,
      attr: {
        pageType: homeReclaim.evaluation,
        orderStatus: [
          {
            text: '待估价',
            key: 1,
            type: homeReclaim.STATUS_NO_EVALUATE,
            ...status
          },
          {
            text: '已估价',
            key: 2,
            type: homeReclaim.STATUS_EVALUATE,
            ...status
          }
        ]
      },
      isSendRequest: false
    }
  },
  methods: {
    setNoDataStatus () {
      this.noData = true
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    div, span img, p, ul, li {
      box-sizing: border-box;
    }
  }
  .evaluate-order-page {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    .qy-flex-none {
      flex: none;
    }
    .evaluate-list {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
