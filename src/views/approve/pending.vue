<template>
  <div class="pending flex-column h100">
    <div class="pending-header" style="z-index: 10">
      <van-search
        v-model="searchValue"
        show-action
        placeholder="请输入流程主题、流程主题"
        @search="startSearch"
        @input="startSearch"
        @clear="resetSearch"
        @blur="startSearch"
        @cancel="resetSearch"
      ></van-search>
      <filter-column :pendingApprove="false" @screenSelect="screenSelected"></filter-column>
    </div>
    <list ref="al" :api="flowInstanceTodoList" :params.sync="searchParams" @viewDetail="viewDetailTap"></list>
  </div>
</template>

<script>
import filterColumn from './components/filterColumn'
import list from './components/list'
import { flowInstanceTodoList } from '@/api/approve'

export default {
  name: 'PendingApprove',
  components: {
    filterColumn,
    list
  },
  data () {
    return {
      searchValue: '',
      searchParams: {},
      timer: null,
      flowInstanceTodoList
    }
  },
  methods: {
    // 搜索
    startSearch () {
      console.log(this.searchValue, '搜索')
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.searchParams.key = this.searchValue
        this.getList()
      }, 500)
    },
    // 取消搜索
    resetSearch () {
      this.searchValue = ''
    },
    // 筛选项选择
    screenSelected (val) {
      console.log(val, 'screenSelected')
      this.searchParams.flow_tpl_name = val.template
      this.searchParams.str_time = val.start_time
      this.searchParams.end_time = val.end_time
      this.getList()
    },
    // 列表点击查看详情
    viewDetailTap (val) {
      console.log(val, 'viewDetailTap')
      this.$router.push({
        name: 'ApproveDetail',
        query: {
          nodeId: val['node_candidate'].record_id
        }
      })
    },
    // 刷新列表
    getList () {
      this.$nextTick(() => {
        this.$refs.al && this.$refs.al.onRefresh()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .van-search__content {
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.04);
    color: #999;
  }
  ::v-deep .van-icon-search {
    color: #999;
  }
  ::v-deep .van-field__control {
    font-size: 14px;
  }
  ::v-deep .van-tabs__line {
    display: none;
  }
</style>
