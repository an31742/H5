<template>
  <div class="reclaim-order-page">
    <search :type="attr.pageType" :isReadonly="true" class="qy-flex-none" />
    <list
      v-if="!noData"
      class="reclaim-list"
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
        pageType: homeReclaim.reclaim,
        orderStatus: [
          {
            text: '待取件',
            key: homeReclaim.STATUS_NO_PICK_UP,
            type: homeReclaim.STATUS_NO_PICK_UP,
            ...status
          },
          {
            text: '待报价',
            key: homeReclaim.IN_QUOTATION,
            type: homeReclaim.IN_QUOTATION,
            ...status
          },
          {
            text: '待确认',
            key: homeReclaim.TO_BE_CONFIRMED,
            type: homeReclaim.TO_BE_CONFIRMED,
            ...status
          },
          {
            text: '待支付',
            key: homeReclaim.TO_BE_PAID,
            type: homeReclaim.TO_BE_PAID,
            ...status
          },
          {
            text: '已完成',
            key: homeReclaim.ORDER_END,
            type: homeReclaim.ORDER_END,
            ...status
          },
          {
            text: '已取消',
            key: homeReclaim.ORDER_CANCEL,
            type: homeReclaim.ORDER_CANCEL,
            ...status
          }
        ]
      }
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
  .reclaim-order-page {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    .qy-flex-none {
      flex: none;
    }
    .reclaim-list {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
