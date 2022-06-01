<template>
  <div class="approved flex-column h100">
    <div class="approved-header" style="z-index: 10">
      <van-search
        v-model="searchValue"
        show-action
        placeholder="请输入审批编号、流程主题"
        @search="startSearch"
        @input="startSearch"
        @clear="resetSearch"
        @blur="startSearch"
        @cancel="resetSearch"
      ></van-search>
      <filter-column @screenSelect="screenSelected"></filter-column>
    </div>
    <list ref="al" :api="flowInstanceDoneList" :params.sync="searchParams" @viewDetail="viewDetailTap"></list>
  </div>
</template>

<script>
import filterColumn from './components/filterColumn'
import list from './components/list'
import { flowInstanceDoneList } from '@/api/approve'

export default {
  name: 'MyApproved',
  components: {
    list,
    filterColumn
  },
  data () {
    return {
      searchValue: '',
      searchParams: {},
      timer: null,
      flowInstanceDoneList
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
      this.searchParams.any_status = val.status
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
  .approved {
    &-tag {
      &-item {
        display: flex;
        align-items: center;
      }

      &-text {
        font-size: 15px;
        color: #333;
        font-weight: 400;
        line-height: 21px;
      }

      &-arrow {
        width: 0;
        height: 0;
        border: 4px solid transparent;
        border-top-color: #282828;
        margin-left: 6px;
        margin-top: 4px;
      }

      &-actived {
        color: #BC8D58;
        border-top-color: #BC8D58;
      }
    }
  }

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
</style>
