<!--
  功能：查询页
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年12月06日 16:44:08
-->
<template>
  <div style="height: 100%;">
    <search ref="searchCom" :type="pageType" :isReadonly="false" @setDataList="setDataList" />
    <div v-if="!noData">
      <div v-for="(item, index) in domList" :key="index">
        <div class="list-title">{{ item.statusLabel }}</div>
        <div class="list">
          <list-item v-for="i in item.list" :key="i.order_id" :item="i" :pageType="pageType" />
        </div>
      </div>
    </div>
    <list-empty v-if="noData" />
  </div>
</template>

<script>
import Search from 'views/getHomeReclaim/Components/Search.vue'
import ListEmpty from 'views/getHomeReclaim/Components/ListEmpty/index.vue'
import ListItem from 'views/getHomeReclaim/Components/ListItem/index.vue'
export default {
  name: 'SearchPage',
  components: {
    Search,
    ListEmpty,
    ListItem
  },
  beforeRouteEnter (to, from, next) {
    if (['EvaluationOrder', 'ReclaimSearchList', 'ValetEvaluation'].includes(from.name)) {
      next((vm) => {
        vm.reloadDom()
      })
      return
    }
    next()
  },
  data () {
    return {
      pageType: this.$route.query.type,
      noData: false,
      isSendRequest: false,
      domList: []
    }
  },
  created () {
  },
  methods: {
    setNoDataStatus () {
      this.noData = true
    },
    setDataList (list = []) {
      this.list = list
      if (!list.length) {
        this.noData = true
      } else {
        this.noData = false
      }
      list.sort((a, b) => a.status - b.status)
      const domList = []
      list.forEach((item) => {
        const index = domList.findIndex((i) => i.statusLabel === item.statusLabel)
        if (index < 0) {
          domList.push({
            statusLabel: item.statusLabel,
            list: [item]
          })
        } else {
          domList[index].list.push(item)
        }
      })
      this.domList = domList
    },
    reloadDom () {
      this.$nextTick(() => {
        this.$refs.searchCom.deepReload()
        this.noData = false
        this.domList = []
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
  .list {
    border-top: none;
    background-color: #fff;
    ::v-deep .van-list__finished-text {
      background-color: #f5f5f5;
    }
  }
  .list-title {
    padding-left: 15px;
    width: 100%;
    height: 36px;
    line-height: 36px;
    background: #F7F8FA;
    font-size: 12px;
    color: #999;
  }
</style>
