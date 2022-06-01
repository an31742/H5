<!--
  功能：搜索客户
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年12月08日 19:55:47
-->
<template>
  <van-action-sheet v-model="show" title="搜索客户信息" @closed="closed">
    <div class="custom">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入客户姓名/手机号"
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
      <ul v-show="list.length" class="list">
        <li class="list__label">共{{ list.length }}条信息</li>
        <li
          v-for="item in list"
          :key="item.room_name + item.user_id"
          v-html="item.text"
          @click="setCustom(item)"
        ></li>
      </ul>
    </div>
  </van-action-sheet>
</template>

<script>
import { wfeUseSuggestList } from '@/api/wfe'
import { phoneEncryption } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  // 组件名称
  name: 'SearchCustom',
  // 组件参数 接收来自父组件的数据
  props: {
    showSheet: {
      type: Boolean,
      default: false
    }
  },
  // 组件状态值
  data () {
    return {
      show: false,
      value: '',
      list: []
    }
  },
  // 计算属性
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  // 侦听器
  watch: {
    showSheet (val) {
      this.show = val
    }
  },
  // 组件方法
  methods: {
    onSearch (val) {
      wfeUseSuggestList({
        room_id: '',
        key: this.value
      }).then(res => {
        if (res.code === 200) {
          const groupName = this.userData?.group_info?.name ?? ''
          const list = res.data || []
          list.forEach(i => {
            i.room_name = `${groupName}${i.room_name}`
            const roomName = i.room_name
            const userName = i.user_name
            const userMobile = i.user_mobile
            let text = ''
            roomName && (text = `${text}<p>${roomName}</p>`)
            userName && (text = `${text}<p>${userName}</p>`)
            userMobile && (text = `${text}<p>${phoneEncryption(userMobile)}</p>`)
            i.text = text
          })
          this.list = res.data
          if (!this.list.length) {
            this.$toast('没有查询到客户')
          }
          return
        }
        this.$toast(res.msg || '客户查询失败')
      })
    },
    closed () {
      this.$emit('closed')
    },
    setCustom (val) {
      this.$emit('setCustom', val)
    }
  }
}
</script>

<style lang="scss" scoped>
  @mixin ellipsis() {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .custom {
    height: 90vh;
  }
  .list {
    background-color: #fff;
    padding: 0px 16px;
    max-height: 80%;
    overflow-y: scroll;
    li {
      height: 52px;
      line-height: 52px;
      border-bottom: 1px solid #EEE;
      display: flex;
      align-items: center;
      font-size: 15px;
    }
    .list__label {
      color: #999;
      text-align: right;
      display: inline-block;
      width: 100%;
    }
  }
  ::v-deep .list li p:not(:last-child) {
    margin-right: 8px;
  }
  ::v-deep .list li p:first-child {
    flex: 1;
    @include ellipsis()
  }
  ::v-deep .list li p:nth-child(2) {
    flex: none;
  }
  ::v-deep .list li p:last-child {
    @include ellipsis()
  }
  ::v-deep .list li .high-light {
    color: #BC8D58;
  }
</style>
