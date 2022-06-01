<template>
  <div class="valet">
    <search :type="attr.pageType" :isReadonly="true" style="flex: none;" />
    <!-- 搜索框 (业主端不需要) -->
    <list class="valet-list" ref="list" v-if="!noData" v-bind="attr" @setNoDataStatus="setNoDataStatus" />
    <list-empty v-if="noData" />
    <div class="fixed-bottom footer">
      <van-button
        round
        class="valet-button"
        @click="toAddOrEdit"
      >代客提单</van-button>
    </div>
  </div>
</template>

<script>
import { homeReclaim } from '@/utils/const.js'
import Search from 'views/getHomeReclaim/Components/Search.vue'
import List from 'views/getHomeReclaim/Components/List.vue'
import ListEmpty from 'views/getHomeReclaim/Components/ListEmpty/index.vue'
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
        pageType: homeReclaim.valet,
        orderStatus: [
          {
            text: '估价单',
            key: '1,2,4',
            type: homeReclaim.STATUS_NO_EVALUATE,
            loading: false,
            finished: false,
            refreshing: false,
            total: 0,
            page: 0,
            page_size: 10,
            last_order_id: null,
            list: []
          },
          {
            text: '已提单',
            key: 3,
            type: homeReclaim.STATUS_EVALUATE,
            loading: false,
            finished: false,
            refreshing: false,
            total: 0,
            page: 0,
            page_size: 10,
            last_order_id: null,
            list: []
          }
        ]
      },
      isSendRequest: false
    }
  },
  methods: {
    setNoDataStatus () {
      this.noData = true
    },
    toAddOrEdit () {
      this.$router.push({
        name: 'GetHomeReclaim'
      })
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
  .valet {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    .valet-list {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
 .footer {
   padding: 10px 15px;
   background-color: #fff;
   .valet-button {
     width: 100%;
     background-color: #E1AA6C;
     font-size: 16px;
     color: #fff;
   }
 }
</style>
