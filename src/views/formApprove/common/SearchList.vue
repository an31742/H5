<template>
  <div class="search-container">
    <!--搜索框-->
    <div v-if="!hideSearch" class="search-input">
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
  name: 'SearchList',
  props: {
    hideSearch: {
      type: Boolean,
      default: false
    },
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
    formatFun: {
      type: Function,
      default: null
    },
    keyName: {
      type: String,
      default: 'name'
    },
    // 自定义搜索方法，不走接口搜索
    searchFun: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      list: [],
      total: 0,
      searchKey: '',
      allData: []
    }
  },
  methods: {
    // 清空状态
    clearState () {
      this.searchKey = ''
    },

    // 显示弹框
    show () {
      this.clearState()
      this.getUserList()
    },

    // 确定
    confirmSelect (item) {
      this.$emit('confirm', this.list)
      this.clearState()
    },

    // 顶部搜索
    startSearch () {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.searchFun) {
          const arr = this.searchFun(this.copyArray(this.allData), this.searchKey)
          this.list = this.formatFun ? this.formatFun(arr) : arr
          this.total = this.list.length
        } else {
          this.getUserList()
        }
      }, 200)
    },

    // 取消搜索
    cancelSearch () {
      this.clearState()
      this.$emit('cancel', this.list)
    },

    // 查找
    getUserList () {
      this.loading = true
      const params = { ...this.apiParams }
      params[this.keyName] = this.searchKey

      this.api(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.list = this.formatFun ? this.formatFun(res.data || []) : (res.data || [])
          this.allData = this.copyArray(this.list)
          this.total = this.list.length
          console.log('this.total', this.total)
        } else {
          this.total = 0
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
