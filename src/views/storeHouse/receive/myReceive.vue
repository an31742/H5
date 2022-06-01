<template>
  <div class="apply flex-column h100">
    <div class="apply-header" style="z-index: 10">
      <filter-column @screenSelect="screenSelected" :screenList="screenList"></filter-column>
    </div>
    <list ref="al" :api="myRreceiveList" :params.sync="searchParams"></list>
  </div>
</template>

<script>
import filterColumn from '@/views/storeHouse/receive/components/filterColumn'
import list from '@/views/storeHouse/receive/components/receiveAssetsList'
import { myRreceiveList } from '@/api/storeHouse.js'

export default {
  name: 'MyApply',
  components: {
    list,
    filterColumn
  },
  data () {
    return {
      searchValue: '',
      searchParams: {},
      timer: null,
      myRreceiveList,
      screenList: [
        {
          label: '申请日期',
          actived: false,
          name: 'date'
        },
        {
          label: '仓库名称',
          actived: false,
          name: 'template'
        },
        {
          label: '物资',
          actived: false,
          name: 'assets'
        }
      ]
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
      this.searchParams = { ...val }
      this.getList()
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
