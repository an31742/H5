<template>
  <div class="apply flex-column h100">
    <div class="apply-header" style="z-index: 10">
      <van-search
        v-model="searchValue"
        show-action
        placeholder="请输入物资名称"
        @search="startSearch"
        @input="startSearch"
        @clear="startSearch"
      ></van-search>
      <filter-column @screenSelect="screenSelected" :screenList="screenList"></filter-column>
    </div>
    <list ref="al" :api="receiveList" :type="2" :params.sync="searchParams"></list>
  </div>
</template>

<script>
import filterColumn from '@/views/storeHouse/receive/components/filterColumn'
import list from '@/views/storeHouse/receive/components/receiveList'
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
      searchParams: { is_self_create: 0 },
      timer: null,
      receiveList,
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
        this.searchParams.apply_user_name = this.searchValue
        this.getList()
      }, 500)
    },
    // 取消搜索
    resetSearch () {
      this.searchValue = ''
    },
    // 筛选项选择
    screenSelected (val) {
      this.searchParams = { ...this.searchParams, ...val }
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
</style>
