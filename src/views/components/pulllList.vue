<template>
  <div class="list-wrap">
    <empty-list
      v-if="!loading && (!list || !list.length)"
      :iconName="iconName"
      :emptyText="emptyText"
    >
    </empty-list>

    <template v-else>
      <van-pull-refresh v-if="pullingRefresh" v-model="loading" @refresh="pullingDown">
        <van-list :finished="loadedAll" :immediate-check="false" @load="getList(true)">
          <slot name="content"></slot>
        </van-list>
      </van-pull-refresh>
      <van-list v-else :finished="loadedAll" :immediate-check="false" @load="getList(true)">
        <slot name="content"></slot>
      </van-list>
    </template>
  </div>
</template>

<script>
import emptyList from './emptyList'
export default {
  name: 'PullList',
  components: { emptyList },
  props: {
    // 是否下拉刷新
    pullingRefresh: {
      type: Boolean,
      default: true
    },
    list: {
      type: Array,
      default: () => []
    },
    emptyText: {
      type: String,
      default: () => '暂无数据'
    },
    iconName: {
      type: String,
      default: () => 'empty-o'
    },
    apiParams: {
      type: Object,
      default: () => {}
    },
    api: {
      type: Function,
      default: () => {}
    },
    formatData: {
      type: Function,
      default: (list) => list
    },
    pageSize: {
      type: Number,
      default: () => 10
    },
    listProp: {
      type: String,
      default: () => 'list'
    },
    // 计算总数的方法
    calcTotal: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      page: 1,
      loading: false,
      loadedAll: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    pullingDown () {
      this.loadedAll = false
      this.getList()
    },

    async getList (loadMore) {
      if (loadMore && (this.loading || this.loadedAll)) { return }

      this.loading = true
      this.page = loadMore ? ++this.page : 1

      if (!loadMore) {
        this.$emit('refresh')
      }

      const data = {
        ...this.apiParams,
        page: this.page,
        page_size: this.pageSize
      }

      const result = await this.api(data)
      if (result.data) {
        const res = this.listProp ? result.data[this.listProp] : result.data
        const newList = this.formatData(res || [])
        const list = (loadMore ? this.list : []).concat(newList)
        this.$emit('update:list', list)
        // 有些独特的数据结构，计算条数的方法不一样，需要自定义
        this.loadedAll = (this.calcTotal ? this.calcTotal(newList) : newList.length) < this.pageSize
      }

      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-wrap {
    min-height: calc(100% - 72px);background: $cold-bg-color;
    .van-pull-refresh { height: 100%;overflow-y: auto; }
  }
</style>
