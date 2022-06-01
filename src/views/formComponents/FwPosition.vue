<template>
  <div>
    <van-field
      v-model="selPos"
      clickable
      name="selPos"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择')"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="selectedLocation"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectPos"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择弹层-->
    <van-popup v-model="popupRoomShow" class="form-component fw-fake-popup" :get-container="getBodyContainer" position="bottom">
      <div class="bgmain fixed-popup">
        <!--搜索框-->
        <van-search
          v-if="!showSearch"
          shape="round"
          show-action
          action-text="返回"
          class="search tl"
          placeholder="搜索位置"
          :readonly="true"
          @click="searchPop"
          @cancel="clearState"
        ></van-search>
        <van-search
          v-else
          ref="search"
          v-model="searchKey"
          autofocus
          shape="round"
          class="search tl"
          placeholder="请输入关键词查找位置"
          show-action
          clearable
          @search="startSearch"
          @input="startSearch"
          @clear="resetSearch"
          @blur="startSearch"
          @cancel="resetSearch"
        ></van-search>

        <!--tabs-->
        <van-tabs v-model="activeIndex" @click="tabClick">
          <van-tab v-for="(cat, ind) in locationTypes" :key="ind" :title="cat.label">
          </van-tab>
        </van-tabs>

        <!--顶部占位符-->
        <p v-if="options.length" class="pt8"></p>
        <!--内容区-->
        <div class="bgmain search-content">
          <!--loading-->
          <van-loading v-if="loading" type="spinner" class="my-loading" />

          <!--暂无数据-->
          <div v-if="!loading && !options.length" class="empty-list h100 tc bgfff">
            <div>
              <svg-icon icon-class="position-empty" class="position-empty" />
              <p>没有找到位置</p>
            </div>
          </div>

          <!--列表-->
          <div v-for="(item, index) in options" v-else :key="index">
            <p v-if="index !== 0" class="pt8"></p>
            <van-cell-group v-if="item.children && item.children.length" :class="'expend-'+item.expend">
              <div slot="title" class="flex" @click="item.expend = !item.expend">
                <div v-html="keywordsColorful(item.label, searchKey)"></div>
                <svg-icon icon-class="arrow-down" style="font-size: 14px;" />
              </div>
              <van-cell
                v-for="(ite, ind) in item.children"
                v-show="item.expend"
                :key="ind"
                clickable
                @click="saveSelect(ite)"
              >
                <div slot="title" v-html="keywordsColorful(ite.label, searchKey)"></div>
              </van-cell>
            </van-cell-group>
            <van-cell v-else clickable @click="saveSelect(item)">
              <div slot="title" v-html="keywordsColorful(item.label, searchKey)"></div>
            </van-cell>
          </div>
        </div>

      </div>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import { mapGetters } from 'vuex'
import { commonLocationAll } from './api'
import { keywordsColorful } from '@/utils'

export default {
  name: 'FwPosition',
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      locationTypes: [
        { label: '楼宇', id: 1, svg: 'home-area' },
        { label: '公区', id: 4, svg: 'public-area' },
        { label: '停车场', id: 2, svg: 'parking-repair' },
        { label: '大门', id: 3, svg: 'door-area' }
      ],
      keywordsColorful,
      popupRoomShow: false,
      activeIndex: 0,
      position_type: 1,
      selPos: null,
      selectedLocation: '',
      expend: false,
      loading: false,
      showSearch: false,
      tempOptions: [],
      options: [],
      searchKey: ''
    }
  },
  computed: {
    ...mapGetters([
      'commonInfo'
    ])
  },
  methods: {
    // 切换tab
    tabClick (index, name) {
      this.position_type = this.locationTypes[index].id
      // this.activeIndex = index
      this.showSearch = false
      this.searchKey = ''
      this.show()
    },

    // 选择位置弹层
    selectPos () {
      this.popupRoomShow = true
      this.show()
    },

    // 拷贝数组
    copyArray (arr) {
      return JSON.parse(JSON.stringify(arr))
    },

    // 显示弹框
    show () {
      this.expend = this.position_type !== 1
      this.getData()
    },

    // 三级数据合并成两级
    mergeData (list) {
      let res = []

      list.map(item => {
        // 给二级数据重命名
        item.children = item.children || []
        item.children.map(child => {
          child.label = `${item.label}${child.label}`
          return child
        })
        return item
      })

      list.map(item => {
        res = res.concat(item.children || [])
        return item
      })

      return res
    },

    // 获取数据
    getData () {
      this.loading = true
      const params = { category: this.position_type }

      commonLocationAll(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          let list = res.data || []

          // 房屋三级数据需要合并成两级
          if (this.position_type === 1) {
            list = this.mergeData(list)
          }

          list = list.map(item => {
            item.expend = this.expend
            if (item.children && item.children.length) {
              // 格式化showName
              item.children.map(ite => {
                ite.showName = `${item.label}/${ite.label}`
                return ite
              })
            }
            return item
          })

          // 没有筛选到二级信息的不展示
          this.options = list.filter(item => item.children && item.children.length)
        }
      })
    },

    // 选择
    saveSelect (pos) {
      this.clearState()
      this.popupRoomShow = false

      this.selPos = pos.value
      this.selectedLocation = pos.showName || pos.label

      this.$set(this.model, this.opt.code + '_location_type', pos.category || this.position_type)
      this.$set(this.model, this.opt.code + '_location_id', pos.value)
      this.$set(this.model, this.opt.code + '_desc', this.selectedLocation)
    },

    // 清空状态
    clearState () {
      this.searchKey = ''
      this.showSearch = false
      this.options = []
      // this.$router.back()
      this.popupRoomShow = false
    },

    // 显示搜索页
    searchPop () {
      this.tempOptions = this.copyArray(this.options)
      this.showSearch = true
      this.$nextTick(() => {
        this.$refs.search.focus()
      })
    },

    // 顶部搜索
    startSearch () {
      if (this.searchKey === '') {
        this.resetSearch()
      } else {
        this.options = this.filterPosition(this.tempOptions, this.searchKey)
      }
    },

    // 搜索位置
    filterPosition (a, key) {
      const res = []
      for (let i = 0; i < a.length; i++) {
        const pos = this.copyArray(a[i])
        let matched = false
        if (pos.children && pos.children.length > 0) {
          pos.children = pos.children.filter(item => item.label.indexOf(key) > -1)
          matched = pos.children.length > 0
        } else {
          matched = pos.label.indexOf(key) > -1
        }

        pos.expend = pos.expend || true
        if (matched) { res.push(pos) }
      }

      return res
    },

    // 清空搜索
    clearSearch () {
      this.options = this.copyArray(this.tempOptions)
    },

    // 取消搜索
    resetSearch () {
      this.clearSearch()
      this.showSearch = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .pt8 { padding-top: 8px; }

  .fw-fake-popup {
    height: 90%;width: 100%;font-family: PingFangSC-Regular, PingFang SC;
    position: fixed;
    left: 0;
    overflow: hidden;
    bottom: 0;
    border-radius: 0 !important;
    .fixed-popup {
      height: 100%;
      display: flex;
      flex-direction: column;
      .search-content {
        flex: 1;
        overflow: scroll;
        text-align: left;
      }

      ::v-deep .van-field {
        margin-bottom: 0 !important;
        .van-field__control {
          line-height: 34px;
        }
      }
    }
    .my-loading {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
    }

    .van-cell-group__title { background: #fff;padding-bottom: 0.42667rem; }
    .van-cell-group__title { font-size: 14px;font-weight: 400;color: #333333;line-height: 24px; }
    .van-cell-group.van-hairline--top-bottom {
      padding-left: 36px;
      &.expend-true { font-size: 14px;margin-top: 2px; }
      &::after { border: none; }
      .van-cell { padding-left: 0; padding-right: 0; }
    }
    .van-search {
      background: #fff;
      .van-search__content { border-radius: 6px; }
      .van-cell { background: rgba(0, 0, 0, 0.04);border-radius: 6px;color: #999999; }
    }

    ::v-deep .van-tabs {
      .van-tab__text {
        font-size: 14px;
        font-weight: 400;
        color: #D0D0D0;
        line-height: 20px;
      }
      .van-tab--active .van-tab__text {
        font-size: 15px;
        font-weight: 500;
        color: #333333;
        line-height: 21px;
      }
    }
  }
</style>
