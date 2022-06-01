<template>
  <div class="service-wrap flex-column">
    <div class="expand">
      <van-loading v-if="loading" type="spinner" class="my-loading"></van-loading>
      <template v-else>
        <div v-if="list.length === 0" class="search-empty">
          <div class="empty-list tc">
            <slot name="content">
              <div>
                <svg-icon icon-class="empty-o"/>
                <slot name="text">
                  <p>暂无数据</p>
                </slot>
              </div>
            </slot>
          </div>
        </div>

        <template v-for="num of rows" v-else>
          <div :key="'cat-' + num" class="cat-item">
            <div
              v-for="index of 4"
              :key="index"
              class="cat-line"
              :class="{active: (num - 1) * 4 + index - 1 === currentIndex}"
              @click="categoryClick((num - 1) * 4 + index - 1)"
            >
              <template v-if="list[(num - 1) * 4 + index - 1]">
                <div class="svg-wrap">
                  <svg-icon
                    :icon-class="list[(num - 1) * 4 + index - 1].icon"
                  ></svg-icon>
                </div>
                <label class="van-ellipsis">{{ list[(num - 1) * 4 + index - 1]['service_name'] }}</label>
              </template>
            </div>
          </div>
          <div
            v-if="currentChildren && currentChildren.length && parseInt(currentIndex / 4) === num - 1"
            :key="'sub-' + num"
            class="sub-item"
          >
            <div
              v-for="(child, pos) in currentChildren"
              :key="pos"
              :class="{active: pos === currentSubIndex}"
              @click="subClick(child, pos)"
            >
              {{ child.service_name }}
            </div>
          </div>
        </template>
      </template>
    </div>

    <div class="btn-save">
      <a v-if="cancelText" class="btn-item" @click="cancelSelect">{{ cancelText }}</a>
      <a class="btn-item confirm" @click="selectService">确定</a>
    </div>
  </div>
</template>

<script>
import { wfeInstanceServiceList } from '@/api/wfe'

export default {
  name: 'SelectService',
  props: {
    cancelText: {
      type: String,
      default: () => ''
    },
    apiParams: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      selectedItem: {},
      selectedSubItem: {},
      currentIndex: -1, // 当前选中的下标
      currentSubIndex: -1 // 当前选中的子分类下标
    }
  },
  computed: {
    // 显示的总行数
    rows () {
      const num = this.list.length / 4

      return Math.ceil(num)
    },
    // 当前选中的服务分类下面的子分类
    currentChildren () {
      if (!this.list || this.currentIndex === -1) {
        return []
      }

      return this.list[this.currentIndex] ? this.list[this.currentIndex]['children'] : []
    }
  },
  methods: {
    // 显示,如果带过来serviceId和subServiceId，则需要有回填逻辑
    show (serviceItem, subServiceItem) {
      this.getList(serviceItem, subServiceItem)
    },

    // 获取服务分类列表
    getList (serviceItem, subServiceItem) {
      this.loading = true
      wfeInstanceServiceList(this.apiParams).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.list = (res.data || []).filter(item => item.children && item.children.length)
          if (serviceItem && subServiceItem) {
            this.initService(serviceItem, subServiceItem)
          }
        } else {
          this.list = []
        }
      })
    },

    initService (serviceItem, subServiceItem) {
      this.list.map((item, idx) => {
        if (item.service_id === serviceItem.service_id) {
          this.currentIndex = idx
          this.selectedItem = item

          item.children.map((child, childIdx) => {
            if (child.service_id === subServiceItem.service_id) {
              this.currentSubIndex = childIdx
              this.selectedSubItem = child
            }
          })
        }
      })
    },

    // 取消选择
    cancelSelect () {
      this.currentIndex = -1
      this.currentSubIndex = -1
      this.$emit('cancel')
    },

    // 选择一级分类
    categoryClick (index) {
      if (index !== -1 && this.list[index]) {
        if (this.currentIndex !== index) {
          this.currentIndex = index
          this.selectedItem = this.list[index]

          this.currentSubIndex = -1
          this.selectedSubItem = {}
        }
      }
    },

    // 选择子分类
    subClick (sub, index) {
      this.currentSubIndex = index
      this.selectedSubItem = sub
    },

    // 选择分类
    selectService () {
      if (this.currentIndex === -1 || this.currentSubIndex === -1) {
        this.$toast('请先选择服务分类')
        return
      }

      const obj = {
        item: this.selectedItem,
        subItem: this.selectedSubItem
      }
      this.$emit('confirm', obj)
    }
  }
}
</script>

<style scoped lang="scss">
  .service-wrap {
    height: 100%;
    height: calc(100% - constant(safe-area-inset-bottom));
    height: calc(100% - env(safe-area-inset-bottom));
    background: #ffffff;
    .btn-save {
      padding: 16px 0;
      text-align: center;
      display: flex;
      .btn-item {
        font-size: 18px;
        flex: 1;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #E1AA6C;
        line-height: 25px;
        border-radius: 20px;
        border: 1px solid;
        padding: 7px 0;
        display: inline-block;
        margin-left: 30px;
        &.confirm {
          background: linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%);
          color: #FFFFFF;
          margin-right: 30px;
        }
      }
    }

    .my-loading {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .cat-item {
      display: flex;padding: 20px 30px;
      .cat-line {
        flex: 1;
        text-align: center;
        padding-right: 20px;
        &:nth-child(4) {
          padding-right: 0;
        }
        label {
          height: 20px;
          font-size: 14px;
          color: #595959;
          line-height: 20px;
          padding: 8px 0 0;
          width: 65px;
          display: inline-block;
        }
        .svg-wrap {
          width: 48px;
          height: 48px;
          background: #F3F3F3;
          border-radius: 10px;
          font-size: 25px;
          line-height: 48px;
          color: #8C8C8C;
          text-align: center;
          margin: 0 auto;
        }

        &.active {
          position: relative;
          &::after {
            position: absolute;
            left: 19px;
            bottom: -20px;
            content: '';
            width: 0;
            height: 0;
            border-left: 11px solid transparent;
            border-right: 11px solid transparent;
            border-bottom: 10px solid #F6F8FA;
          }
          .svg-wrap {
            background: #F9EEE2;
            color: #E1AA6C;
          }
          label {
            color: #BC8D58;
          }
        }
      }
    }
    .sub-item {
      background: #F6F8FA;
      padding: 12px 0 0 12px;
      &>div {
        display: inline-block;
        margin-right: 12px;
        margin-bottom: 12px;
        font-size: 15px;
        color: #333333;
        line-height: 21px;
        padding: 8px 17px;
        background: #fff;
        border-radius: 20px;
        &.active {
          background: #F9EEE2;
          color: #BC8D58;
        }
      }
    }

    .search-empty {
      height: 100%;
      .empty-list {
        height: 100%;
        display: flex;
        justify-content: center;
        vertical-align: middle;
        align-items: center;
        .svg-icon {
          font-size: 170px;
        }
        p {
          color: #999;
          font-size: 14px;
        }
      }
    }
  }
</style>
