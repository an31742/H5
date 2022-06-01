<template>
  <div>
    <van-popup v-model="showPopup" class="select" position="bottom" @click-overlay="closePopup" :get-container="getBodyContainer">
      <div class="bgmain fixed-popup">
        <van-search
          v-model="searchValue"
          shape="round"
          class="search tl"
          placeholder="搜索服务"
          @search="onSearch"
          @cancel="onSearch"
          @clear="onSearch"
          @input="onSearch"
        ></van-search>
      </div>
      <div class="fw-tree-select" v-if="!isSearch">
        <!--第一级-->
        <div class="fw-sidebar fw-tree-select__nav">
          <a
            v-for="(item, index) in classData"
            :key="item.id"
            class="fw-sidebar-item fw-tree-select__nav-item"
            :class="{ 'fw-sidebar-item--select': activeIndexes[0] === index }"
            @click="navClick(item, index)"
          >
            <slot name="title" :item="item">
              <div class="van-ellipsis fw-sidebar-item__text">
                {{ item.name }}
              </div>
            </slot>
          </a>
        </div>

        <!--子级树-->
        <div class="fw-tree-select__content">
          <van-checkbox-group v-model="checked" @change="onServiceChange">
            <div
              v-for="(item) in childData"
              :key="item.id"
              class="fw-tree-select__box"
            >
              <div class="fw-tree-select__box__item">
                <span class="text">{{ item.name }}</span>
                <span class="number">
                  <span class="text" style="color:#FF3B30;">{{ item.rates }}</span>
                  <van-field style="width:18px;display:inline-block;padding:0;background: #f5f5f5;margin-left:10px;">
                    <template #input>
                      <van-checkbox :name="item.id" style=""icon-size="16px"></van-checkbox>
                    </template>
                  </van-field>
                </span>
              </div>
            </div>
          </van-checkbox-group>
        </div>
      </div>
      <template v-else>
        <div v-if="searchData.length">
          <van-checkbox-group v-model="checked" @change="onServiceChange">
            <div class="service-num">
              共{{ searchTotal }}项服务
            </div>
            <div v-for="(item) in searchData" :key="item.id" class="search-content">
              <div class="fw-tree-select__box__item">
                <span>{{ item.name }}</span>
                <span class="number">
                  <span class="text" style="color:#FF3B30;">{{ item.rates }}</span>
                  <van-field style="width:18px;display:inline-block;padding:0;background: #f5f5f5;margin-left:10px;">
                    <template #input>
                      <van-checkbox :name="item.id" icon-size="16px"></van-checkbox>
                    </template>
                  </van-field>
                </span>
              </div>
            </div>
          </van-checkbox-group>
        </div>
        <div v-if="!searchData.length" class="empty-list h100 tc bgfff">
          <div>
            <svg-icon icon-class="position-empty" class="position-empty" />
            <p>未找到服务，换个关键词试试吧</p>
          </div>
        </div>
      </template>
      <div class="btns">
        <div>
          <div class="fw-btm-wrap btn">
            <div
              type="primary"
              class="round"
              @click="selected"
            >
              已选（{{ checked.length }}）
            </div>
            <div
              type="primary"
              class="round"
              style="background:#E1AA6C;color:#ffffff;"
              @click.stop="submit"
            >
              完成
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <SelectedService
      ref="selectedS"
      :data="selectedData"
      @change="changeSelectedData"
      @closeSelected="reset"
    />
  </div>
</template>

<script>
import { calssList, serviceList } from '@/api/wfe'
import SelectedService from './selectedService'
export default {
  name: '',
  components: { SelectedService },
  props: {
    propsData: {
      type: Array,
      default () {
        return []
      }
    },
    groupId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      activeIndexes: [0],
      showPopup: false,
      isSearch: false,
      classData: [],
      childData: [],
      searchValue: '',
      searchTotal: '',
      checked: [],
      searchData: [],
      selectedData: [],
      allData: []
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getClassList()
  },
  methods: {
    onServiceChange (values) {
      let temp = []
      this.classData.forEach(e => {
        if (e.subjects) {
          temp = [...e.subjects, ...temp]
        }
      })
      this.allData = temp
      const list = []
      values.forEach(e => {
        const obj = this.allData.find(item => item && (item.id === e))
        list.push(obj)
      })
      this.checked = values
      this.selectedData = list
    },
    changeSelectedData (values, ids) {
      this.selectedData = values
      this.checked = ids
    },
    onSearch () {
      if (!this.searchValue) {
        this.isSearch = false
        return
      }
      this.isSearch = true
      serviceList({
        size: 10,
        name: this.searchValue
      }).then((res) => {
        if (res.code === 200) {
          const list = res.data.list || []
          this.searchData = list
          this.searchTotal = res.data.total || 0
        } else {
          this.searchData = []
        }
      })
    },
    getClassList () {
      calssList({
        type: 2,
        name: this.searchValue,
        group_id: this.groupId
      }).then((res) => {
        if (res.code === 200) {
          const list = res.data.list || []
          list.forEach(e => {
            e.subjects && e.subjects.forEach(item => {
              item.classification_id = e.id
              item.classification_name = e.name
              item.type = 2
            })
          })
          this.classData = res.data.list
          this.childData = this.classData[0].subjects || []
        } else {
          this.classData = []
        }
      })
    },
    show () {
      this.showPopup = true
    },
    closePopup () {
      this.checked = []
      this.selectedData = []
      this.propsData.forEach((item, index) => {
        this.checked.push(item.id)
        this.selectedData.push(item)
      })
      this.reset()
      this.showPopup = false
    },
    // 第一级菜单点击
    navClick (item, index) {
      this.activeIndexes = [index]
      this.childData = this.classData[index].subjects
    },
    reset () {
      this.activeIndexes = [0]
      this.isSearch = false
      this.childData = this.classData[0].subjects
      this.searchValue = ''
      this.searchTotal = ''
      this.searchData = []
    },
    selected () {
      this.$refs.selectedS.show()
    },
    submit () {
      this.showPopup = false
      this.$emit('submit', this.selectedData)
      this.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-sidebar-item--select::before {
  width: 2px;
  background: #e1aa6c;
  height: 20px;
}
::v-deep .van-tab--active .van-tab__text {
  color: #333333;
}
::v-deep .van-tab__text {
  color: #999999;
  font-size: 15px;
}
.select {
  height: 92%;
}
.form-component .van-field {
  margin: 0;
}
.form-component .van-search .van-cell {
  border-radius: 34px;
  background: #f6f8fa;
}
::v-deep .search .van-field__body {
  height: 100%;
}
.form-component .van-search {
  background: #ffffff;
}
.service-num {
  font-size: 13px;
  color: #999999;
  padding: 0px 10px 4px;
  border-bottom: 1px solid #f1f1f1;
  background: #ffffff;
  text-align: left;
}
.search-content {
  padding: 15px 10px;
  font-size: 14px;
}
::v-deep .search-content .van-field .van-field__control {
  background: #ffffff;
}

.fw-tree-select {
  position: relative;
  display: flex;
  font-size: 14px;
  user-select: none;
  height: calc(100% - 70px);

  &__nav {
    flex-basis: 48%;
    overflow-y: auto;
    background-color: #fff;
    -webkit-overflow-scrolling: touch;

    &-item {
      padding: 14px 12px;
    }
  }

  &__content {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    background-color: #f6f8fa;
    -webkit-overflow-scrolling: touch;
  }
  &__box {
    width: calc(100% - 40px);
    padding: 15px 20px 15px 20px;
    background: #F6F8FA;
    border-bottom: 1px solid #efefef;
    &__item {
      display: flex;
      justify-content: space-between;
      .text{
        display: inline-block;
        width: 100px;
        text-align: left;
      }
    }
    &__text {
      font-size: 13px;
      color: #999999;
      margin-top: 10px;
    }
  }

  &__selected {
    position: absolute;
    top: 50%;
    right: 16px;
    margin-top: -8px;
    font-size: 16px;
  }
}

.fw-sidebar-item {
  position: relative;
  display: block;
  box-sizing: border-box;
  padding: 15px 0px 15px 16px;
  overflow: hidden;
  color: #333;
  font-size: 14px;
  line-height: 20px;
  background-color: #fff;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;

  &:active {
    background-color: #f2f3f5;
  }

  &__text {
    position: relative;
    word-break: break-all;
  }

  &:not(:last-child)::after {
    border-bottom-width: 1px;
  }

  &--select {
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #e1aa6c;
  }

  &--select,
  &--select:active {
    background-color: #F6F8FA;
  }

  &--select::before {
    position: absolute;
    top: 50%;
    left: 0;
    width: 2px;
    height: 24px;
    background-color: #e1aa6c;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    content: "";
  }

  &--disabled {
    color: #c8c9cc;
    cursor: not-allowed;
  }

  &--disabled:active {
    background-color: #f7f8fa;
  }
}
.btns {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  &__standard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    border-bottom: 1px solid #e8e8e8;
    padding: 12px 20px;
  }
  .fw-btm-wrap {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
  }
  .round{
    width: 160px;
    color: rgb(225, 170, 108);
    background: rgb(255, 255, 255);
    border: 1px solid rgb(225, 170, 108);
    height: 35px;
    border-radius: 35px;
    text-align: center;
    line-height: 35px;
    font-size: 16px;
  }
}
.popup {
  padding: 0 20px 20px;
  border-radius: 10px;
  width: 80%;
  div {
    margin-bottom: 10px;
  }
}
.number {
  display: flex;
  align-items: center;
}
</style>
