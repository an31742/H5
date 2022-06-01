<template>
  <div class="apply flex-column h100">
    <div class="apply-header" style="z-index: 10">
      <van-search
        v-model="searchValue"
        placeholder="请输入申请人"
        @search="startSearch"
        @input="startSearch"
        @clear="startSearch"
      ></van-search>
      <!-- type: 1->我的申请，2->待我出库 -->
      <filter-column @screenSelect="screenSelected" :screenList="screenList"></filter-column>
    </div>
    <list ref="al" :api="outList" :type="3" :params.sync="searchParams" @viewDetail="viewDetailTap"></list>
  </div>
</template>

<script>
import filterColumn from '@/views/storeHouse/receive/components/filterColumn'
import list from '@/views/storeHouse/receive/components/receiveList'
import { outList } from '@/api/storeHouse.js'

export default {
  name: 'MyApply',
  components: {
    list,
    filterColumn
  },
  data () {
    return {
      searchValue: '',
      searchAssets: '',
      searchParams: { is_self_create: 0 },
      timer: null,
      outList,
      screenList: [
        {
          label: '申请日期',
          actived: false,
          name: 'date'
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
      this.searchParams = { ...val }
      this.getList()
    },
    // 列表点击查看详情
    viewDetailTap (val) {
      // 跳转到查看详情页
      this.$router.push({
        name: 'MyOutDetail',
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
</style>
