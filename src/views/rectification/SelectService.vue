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
        <fw-tree-select
          class="h100"
          v-else
          :depth="depth"
          :items="list"
          :navStyle="{flex: 'unset', width: '3rem'}"
          :active-indexes.sync="currentIndexes"
          :active-ids.sync="currentSubIds"
          @click-nav="categoryClick"
          @click-item="subClick"
        >
          <template slot="title" slot-scope="item">
            <div class="van-ellipsis">
              <!-- <svg-icon class="pre-icon" :icon-class="item.item.icon"></svg-icon> -->
              {{ item.item.label }}
            </div>
          </template>
        </fw-tree-select>
      </template>
    </div>

    <div v-if="showBottomBtn" class="btn-save">
      <a v-if="cancelText" class="btn-item" @click="cancelSelect">{{ cancelText }}</a>
      <a class="btn-item confirm" @click="selectService">确定</a>
    </div>
  </div>
</template>

<script>
import { wfeInstanceServiceListMultiple } from '@/api/wfe'
// wfeInstanceServiceList,
import fwTreeSelect from './fwTreeSelect'
import { isWeixin, isApp } from '@/utils/index'

export default {
  name: 'SelectService',
  components: { fwTreeSelect },
  props: {
    cancelText: {
      type: String,
      default: () => ''
    },
    apiParams: {
      type: Object,
      default: () => {}
    },
    // 是否显示底部按钮，如果不展示，则点击二级时执行save逻辑
    showBottomBtn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      selectedItem: {},
      selectedSubItem: {},
      selectedSonItem: {},
      currentIndexes: [], // 当前选中的下标
      currentSubIds: [], // 当前选中的子分类id
      depth: 3,
      isWeixin,
      isApp
    }
  },
  methods: {
    // 显示,如果带过来serviceId和subServiceId，则需要有回填逻辑
    show (serviceItem, subServiceItem, selectedSonItem) {
      if (this.list && this.list.length) {
        this.initService(serviceItem, subServiceItem, selectedSonItem)
        return
      }

      this.getList(serviceItem, subServiceItem, selectedSonItem)
    },

    // 品质-获取品质相关所有的服务
    getList (serviceItem, subServiceItem, selectedSonItem) {
      this.loading = true
      wfeInstanceServiceListMultiple({ entry_ids: isApp() ? '703,704,705,706' : '303,304,305,306' }).then(res => {
        this.loading = false
        if (res.code === 200) {
          const list = (res.data || []).filter(item => item.children && item.children.length)
          this.list = list.map(i => {
            i.label = i.service_name
            i.children.map(j => {
              j.label = j.service_name
              j.value = j.service_id
              j.children.map(n => {
                n.label = n.service_name
                n.value = n.service_id
                return n
              })
              return j
            })
            return i
          })

          this.initService(serviceItem, subServiceItem, selectedSonItem)
        } else {
          this.list = []
        }
      })
    },

    // 获取服务分类列表
    // getList (serviceItem, subServiceItem) {
    //   this.loading = true
    //   wfeInstanceServiceList(this.apiParams).then(res => {
    //     this.loading = false
    //     if (res.code === 200) {
    //       const list = (res.data || []).filter(item => item.children && item.children.length)
    //       this.list = list.map(i => {
    //         i.label = i.service_name
    //         i.children.map(j => {
    //           j.label = j.service_name
    //           j.value = j.service_id
    //           return j
    //         })
    //         return i
    //       })

    //       this.initService(serviceItem, subServiceItem)
    //     } else {
    //       this.list = []
    //     }
    //   })
    // },

    // 数据回填
    initService (serviceItem, subServiceItem, selectedSonItem) {
      if (serviceItem && subServiceItem) {
        this.list.map((item, idx) => {
          if (item.service_name === serviceItem.service_name) {
            this.currentIndexes = [idx]
            this.currentSubIds = [item.value]
            this.selectedItem = item

            item.children.map((child, childIdx) => {
              if (child.service_id === subServiceItem.service_id) {
                this.currentIndexes.push(childIdx)
                this.currentSubIds.push(child.value)
                this.selectedSubItem = child

                child.children.map((son, sonIdx) => {
                  if (son.service_id === selectedSonItem.service_id) {
                    this.currentIndexes.push(sonIdx)
                    this.currentSubIds.push(son.value)
                    this.selectedSonItem = son
                  }
                })
              }
            })
          }
        })
      }
    },

    // 取消选择
    cancelSelect () {
      this.currentIndexes = []
      this.currentSubIds = []

      this.$emit('cancel')
    },

    // 选择一级分类
    categoryClick (item, index) {
      if (index !== -1 && this.list[index]) {
        this.selectedItem = item
        this.selectedSubItem = {}
        this.selectedSonItem = {}
      }
    },

    // 选择子分类
    subClick (sub, index, isLeaf) {
      if (isLeaf) {
        this.selectedSonItem = sub
      } else {
        this.selectedSubItem = sub
      }

      if (!this.showBottomBtn) {
        this.selectService()
      }
    },

    // 选择分类
    selectService () {
      if (this.currentIndexes.length < this.depth) {
        this.$toast('请先选择服务分类')
        return
      }

      const obj = {
        item: this.selectedItem,
        subItem: this.selectedSubItem,
        sonItem: this.selectedSonItem
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
      padding: 10px 0;
      text-align: center;
      display: flex;
      .btn-item {
        font-size: 16px;
        flex: 1;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #E1AA6C;
        line-height: 25px;
        border-radius: 10px;
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

    .h100 {
      height: 100% !important;
    }

    .pre-icon {
      font-size: 17px;
      padding-right: 8px;
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
