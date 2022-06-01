<template>
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
      <div v-if="total > 0">
        <div class="search-main">
          <ul>
            <li
              v-for="(item,index) in list"
              :key="index"
              class="search-item"
              @click="confirmSelect(item)"
            >
              <slot name="item" :item="item"></slot>
            </li>
          </ul>
        </div>
      </div>

      <!--<div v-if="total === 0 && searchKey " class="search-empty">-->
      <div v-if="total === 0" class="search-empty">
        <div class="empty-list tc">
          <slot name="content">
            <div>
              <svg-icon icon-class="empty-o"/>
              <slot name="text">
                <p>{{ emptyText }}</p>
              </slot>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchList',
  props: {
    api: {
      type: Function,
      default: () => {}
    },
    apiParams: {
      type: Object,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: () => '请输入关键字搜索'
    },
    emptyText: {
      type: String,
      default: () => '没有搜索到数据'
    }
  },
  data () {
    return {
      loading: false,
      list: [],
      total: 0,
      searchKey: ''
    }
  },
  methods: {
    // 清空状态
    clearState () {
      this.searchKey = ''
      this.list = []
      this.total = 0
    },

    // 显示弹框
    show () {
      this.clearState()
      this.startSearch()
    },

    // 选择
    confirmSelect (item) {
      this.$emit('confirm', item)
      this.clearState()
    },

    // 顶部搜索
    startSearch () {
      this.loading = true
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getUserList()
      }, 200)
    },

    // 取消搜索
    cancelSearch () {
      this.clearState()
      this.$emit('cancel')
    },

    // 查找
    getUserList () {
      // if (this.searchKey === '') {
      //   this.clearState()
      //   this.loading = false
      //   return
      // }

      const params = { ...this.apiParams }
      params.name = this.searchKey

      this.api(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.list = res.data || []
          this.total = this.list.length
        } else {
          this.total = 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-container {
    height: 100%;
    background: #F5F5F5;
    display: flex;
    flex-direction: column;
    .search-centent {
      flex: 1;
      box-sizing: border-box;
      z-index: 100;
      overflow: scroll;
      margin-top: 8px;
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
      border-bottom: 1px solid #EEEEEE;
      align-items: center;
      padding: 12px 16px;
      height: 30px;
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
