<!--
  功能：切换订单状态，显示此状态的所有订单
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月18日 14:42:27
-->
<template>
  <!-- 订单状态 -->
  <div>
    <div class="title">
      <van-search
        style="flex: 3;"
        v-model="searchValue"
        shape="round"
        background="#fff"
        placeholder="请输姓名"
        @search="onSearch"
      />
      <van-cell style="flex: 1;" title="日期" arrow-direction="down" @click="show = true" />
    </div>
    <van-list
      v-model="loading"
      class="list bdt"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad()"
    >
      <div class="list-item--bg" v-if="list && list.length > 0">
        <van-row
          v-for="i in list"
          :key="i.id"
          class="list-item bdb"
          @click="toDetail(i.id)"
        >
          <van-row>房号：{{ i.room_name || '无' }}</van-row>
          <van-row>申请人： {{ `${i.apply_user_name}（${i.phone}）` }}</van-row>
          <van-row>计划通行日期：{{ dayjs(i.plan_pass_time).format('YYYY-MM-DD') }}</van-row>
          <van-icon class="list-item_icon" name="arrow" />
        </van-row>
      </div>
      <template #finished>
        <div>
          <div v-if="list.length > 0" class="van-list__finished-text">没有更多了</div>
        </div>
      </template>
      <van-empty
        v-if="!list.length"
        class="custom__image"
        :image="require('views/getHomeReclaim/Components/ListEmpty/images/bg.png')"
        description="暂无物品放行订单"
      />
    </van-list>
    <van-calendar v-model="show" type="range" @confirm="onConfirm" />
  </div>

</template>

<script>
import dayjs from 'dayjs'
import { getPassList } from 'api/search'

export default {
  // 组件名称
  name: 'GoodsList',
  // 组件状态值
  data () {
    return {
      searchValue: '',
      loading: false,
      finished: false,
      list: [],
      date: '',
      show: false,
      params: {}
    }
  },
  // 计算属性
  computed: {
  },
  watch: {
  },
  // 组件方法
  methods: {
    dayjs,
    formatDate (date) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    },
    onConfirm (date) {
      const [start, end] = date
      console.log(start, end)
      this.show = false
      this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`
      this.params.pass_begin_time = start
      this.params.pass_end_time = end
      this.onLoad()
    },
    onSearch () {
      this.params.name = this.searchValue
      this.onLoad()
    },
    onLoad () {
      getPassList({
        page: 1,
        page_size: 9999,
        ...this.params
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data?.list ?? []
          this.finished = this.list.length < 9999
        } else {
          this.$toast('获取放行数据失败')
          this.finished = true
        }
      })
    },
    toDetail (id) {
      this.$router.push(
        {
          name: 'GoodsReleaseDetail',
          query: {
            order_id: id
          }
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
  .ellipsis {
    @include ell()
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
  }
  .list-item {
    padding: 15px;
    white-space: nowrap;
    box-sizing: border-box;
    box-shadow: none !important;
    background-color: #fff;
    position: relative;
    &_icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .list-item:last-child {
    border-bottom: none;
  }
</style>
