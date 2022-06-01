<template>
  <!--带默认值回填的搜索组件-->
  <div class="search-container">
    <!--搜索框-->
    <div class="search-input">
      <van-search
        ref="search"
        v-model="searchKey"
        shape="round"
        class="search tl"
        :placeholder="placeholder"
        show-action
        clearable
        @search="startSearch"
        @input="startSearch"
        @clear="clearState"
        @cancel="cancelSearch"
      >
      </van-search>
    </div>

    <!--loading-->
    <van-loading
      v-if="loading"
      type="spinner"
      class="my-loading"
    ></van-loading>

    <!--搜索结果-->
    <div v-else class="search-centent">
      <div v-if="total > 0" style="padding-bottom: 1.92rem;">
        <div class="search-main">
          <slot name="list" :list="list"></slot>
        </div>
      </div>

      <div v-if="total === 0 && !loading" class="search-empty">
        <div class="empty-list tc">
          <!--未搜索到数据-->
          <div v-if="searchKey">
            <svg-icon icon-class="empty-o"/>
            <p>{{ emptyText }}</p>
          </div>
          <!--搜索提示-->
          <div v-else>
            <svg-icon icon-class="search-o"/>
            <p>{{ searchTip }}</p>
          </div>
        </div>
      </div>

      <div class="van-submit-bar">
        <div class="fw-btm-wrap btn bgfff">
          <van-button class="round" size="large" @click="confirmSelect">确定</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchListWithInit',
  props: {
    api: {
      type: Function,
      default: () => {}
    },
    apiParams: {
      type: Object,
      default: () => {}
    },
    // 搜索框占位符
    placeholder: {
      type: String,
      default: () => '请输入关键字搜索'
    },
    // 未搜索数据的提示
    emptyText: {
      type: String,
      default: () => '没有搜索到数据'
    },
    // 进入页面时，输入搜索提示语
    searchTip: {
      type: String,
      default: ''
    },
    uniKey: { // 数组去重字段
      type: String,
      default: () => 'id'
    }
  },
  data () {
    return {
      loading: false,
      list: [],
      selectedList: [],
      total: 0,
      searchKey: ''
    }
  },
  methods: {
    // 清空状态
    clearState () {
      this.searchKey = ''
      this.selectedList = []
      this.list = []
      this.total = 0
    },

    // 显示弹框
    show (param) {
      this.clearState()
      param && this.getInitList(param)
    },

    // 设置默认选中项
    setSelected (arr) {
      this.selectedList = [].concat(this.list.filter(item => arr.indexOf(item[this.uniKey]) > -1))
    },

    // 确定
    confirmSelect () {
      this.$emit('confirm', this.selectedList)
      this.clearState()
    },

    // 默认回填的列表
    getInitList (param) {
      this.loading = true
      this.api(param).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.selectedList = res.data || []
          this.list = [].concat(this.selectedList)
          this.total = this.list.length
        }
      })
    },

    // 顶部搜索
    startSearch () {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        const params = { ...this.apiParams }
        params.name = this.searchKey

        this.getUserList(params)
      }, 200)
    },

    // 取消搜索
    cancelSearch () {
      this.clearState()
      this.$emit('cancel', this.selectedList)
    },

    // 查找
    getUserList (params) {
      this.loading = true
      this.api(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          let list = res.data || [] // 需要去重
          const exits = this.selectedList.map(item => item[this.uniKey])
          list = list.filter(item => exits.indexOf(item[this.uniKey]) < 0)

          this.list = this.selectedList.concat(list)
          this.total = this.list.length
        } else {
          this.total = this.selectedList.length || 0
        }
      })
    }
  }
}
</script>

<style type="text/css" lang="less">
  @import "../common.less";
</style>
<style lang="scss" scoped>
  .search-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .search-centent {
      flex: 1;
      box-sizing: border-box;
      z-index: 100;
      overflow: scroll;
    }
    ::v-deep .search-input {
      background: #fff;
      .van-field {
        margin-bottom: 0 !important;
        .van-field__control {
          line-height: 34px;
        }
      }
    }
    .search-empty {
      height: 100%;
      box-sizing: border-box;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      text-align: center;
      padding-bottom: 72px;
    }
    .search-box {
      height: 100%;
    }
    .search-main {
      background: #FFFFFF;
    }
    .search-item {
      background: #FFFFFF;
      display: flex;
      align-items: center;
      margin: 12px 12px;
    }

    .van-search {
      background: #fff;
      .van-search__content {
        border-radius: 6px;
      }
      .van-cell {
        background: rgba(0, 0, 0, 0.04);
        border-radius: 6px;
        color: #999999;
      }
    }

    .empty-list {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $minor-text-color;
      background: transparent;
      p {
        font-size: 14px;
        color: #c5c5c5;
        line-height: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      img {
        width: 150px;
        padding-bottom: 15px;
      }
      .svg-icon {
        font-size: 170px;
      }
    }

    .my-loading {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
