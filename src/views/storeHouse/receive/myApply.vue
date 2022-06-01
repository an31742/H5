<template>
  <div class="apply flex-column h100">
    <div class="apply-header" style="z-index: 10">
      <filter-column @screenSelect="screenSelected" :screenList="screenList"></filter-column>
    </div>
    <list ref="al" :api="receiveList" :params.sync="searchParams" @viewDetail="viewDetailTap"></list>
  </div>
</template>

<script>
import filterColumn from '@/views/storeHouse/receive/components/filterColumn'
import list from '@/views/storeHouse/receive/components/applyList'
import { receiveList } from '@/api/storeHouse.js'

export default {
  name: 'MyApply',
  components: {
    list,
    filterColumn
  },
  data () {
    return {
      searchValue: '',
      searchParams: { is_self_create: 1 },
      timer: null,
      receiveList,
      screenList: [
        {
          label: '申请日期',
          actived: false,
          name: 'date'
        },
        {
          label: '状态',
          actived: false,
          name: 'status'
        },
        {
          label: '仓库名称',
          actived: false,
          name: 'template'
        }
      ]
    }
  },
  methods: {
    // 取消搜索
    resetSearch () {
      this.searchValue = ''
    },
    // 筛选项选择
    screenSelected (val) {
      this.searchParams = { ...this.searchParams, ...val }
      this.getList()
    },
    // 列表点击查看详情
    viewDetailTap (val) {
      // 跳转到查看详情页
      this.$router.push({
        name: 'MyReceiveApplyDetail',
        query: {
          receiveId: val.receive_id
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
  // .apply {
  //   &-tag {
  //     &-item {
  //       display: flex;
  //       align-items: center;
  //     }
  //
  //     &-text {
  //       font-size: 15px;
  //       color: #333;
  //       font-weight: 400;
  //       line-height: 21px;
  //     }
  //
  //     &-arrow {
  //       width: 0;
  //       height: 0;
  //       border: 4px solid transparent;
  //       border-top-color: #282828;
  //       margin-left: 6px;
  //       margin-top: 4px;
  //     }
  //
  //     &-actived {
  //       color: #BC8D58;
  //       border-top-color: #BC8D58;
  //     }
  //   }
  // }

  // ::v-deep .van-search__content {
  //   border-radius: 6px;
  //   background: rgba(0, 0, 0, 0.04);
  //   color: #999;
  // }
  // ::v-deep .van-icon-search {
  //   color: #999;
  // }
  // ::v-deep .van-field__control {
  //   font-size: 14px;
  // }
</style>
