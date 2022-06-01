<template>
  <div class="search-container">
    <div class="search-input">
      <van-tabs v-model="active" @click="onChange">
        <van-tab title="姓名"></van-tab>
        <van-tab title="房屋"></van-tab>
        <van-tab title="手机号码"></van-tab>
      </van-tabs>
      <van-search
        ref="search"
        v-model="searchKey"
        autofocus
        shape="round"
        class="search tl"
        :placeholder="getPlaceholder()"
        show-action
        clearable
        @search="startSearch"
        @input="startSearch"
        @clear="resetSearch"
        @blur="startSearch"
        @cancel="resetSearch"
      ></van-search>
    </div>
    <div class="search-centont">
      <div v-if="total > 0" class="search-box">
        <div class="search-total">共 {{ total }} 条信息</div>
        <div class="search-main">
          <ul>
            <li v-for="(item,index) in data" :key="index" class="search-item" @click="linkDetail(item)">
              <span class="item-name" v-html="item.room_name"></span>
              <span class="user-name" v-html="item.name"></span>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="total === 0 && searchKey" class="search-empty">
        <img src="~@/assets/search-empty.png" alt="" width="300">
        <div>{{ searchEmpty }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { gmanagerUserSearch } from '@/api/search'
import { keywordsColorful } from '@/utils'

export default {
  name: 'UserSearch',
  data () {
    return {
      expend: false,
      active: 0,
      loading: false,
      lockEmpty: true,
      showSearch: false,
      tempOptions: [],
      options: [],
      data: [],
      total: 0,
      searchEmpty: '没有找到内容',
      searchType: 0,
      searchKey: ''
    }
  },
  methods: {
    // 拷贝数组
    onChange () {
      this.clearState()
    },
    getPlaceholder () {
      let text = '请输入关键词查找'
      switch (this.active) {
        case 0:
          text = '请输入客户姓名查找'
          break
        case 1:
          text = '请输入房屋名称查找'
          break
        case 2:
          text = '请输入客户手机号查找'
          break
        default:
      }
      return text
    },
    copyArray (arr) {
      return JSON.parse(JSON.stringify(arr))
    },
    // 显示弹框
    show () {
      this.expend = this.type !== 2
      this.getData()
    },
    // 获取数据
    getData () {
    },
    // 选择
    saveSelect (item) {
      this.clearState()
    },
    linkDetail (item) {
      this.$router.push(`/management/detail/customer?id=${item.id}`)
    },
    // 清空状态
    clearState () {
      this.searchKey = ''
      this.showSearch = false
      this.data = []
      this.total = 0
    },
    // 顶部搜索
    startSearch () {
      this.loading = true
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.userSearch()
      }, 200)
    },
    userSearch () {
      if (this.searchKey === '') {
        this.resetSearch()
        this.loading = false
        return
      }
      const params = {}
      switch (this.active) {
        case 0:
          params.name = this.searchKey
          break
        case 1:
          params.room_name = this.searchKey
          break
        case 2:
          params.mobile = this.searchKey
          break
        default:
      }
      gmanagerUserSearch(params).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.data = res.data.list.map(item => {
            if (this.active === 0) {
              item.name = keywordsColorful(item.name, this.searchKey)
            } else if (this.active === 1) {
              item.room_name = keywordsColorful(item.room_name, this.searchKey)
            }
            return item
          })
          this.total = res.data.total
        } else {
          this.searchEmpty = res.data
          this.total = 0
        }
      })
    },
    // 取消搜索
    resetSearch () {
      this.clearState()
      this.showSearch = false
    }
  }
}
</script>
<style lang="scss" scoped>
.search-container{
  height: 100%;
  background: #F6F8FA;
}
.search-centont{
  padding-top: 98px;
  height: 100%;
  box-sizing: border-box;
  z-index: 100;
  overflow: scroll;
}
.search-input{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 111;
}
.search-empty{
  height: 100%;
  padding-top: 36px;
  box-sizing: border-box;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  text-align: center;
  background-color: #FFFFFF;
}
.search-total{
    background-color: #fff;
    margin: 4px 0;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 42px;
    text-align: right;
    padding: 0 16px;
}
.search-box{
  height: 100%;
}
.search-main{
    padding-left: 16px;
    background: #FFFFFF;
}
.search-item{
    height: 50px;
    line-height: 50px;
    background: #FFFFFF;
    display: flex;
    border-bottom: 1px solid #EEEEEE;
}
.search-item:last-child{
  border-bottom:none;
}
.item-name{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
}
.user-name{
    margin-left: 18px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
