<template>
  <van-popup v-model="showPopup" class="select" position="bottom" :get-container="getBodyContainer">
    <div class="service-num">
      共{{ data.length }}项材料
    </div>
    <div class="fw-tree-select" v-if="data.length">
      <div class="fw-tree-select__content">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="fw-tree-select__box"
        >
          <div class="fw-tree-select__box__item">
            <span style="width: 80px;">{{ item.name }}</span>
            <span class="number">
              <span style="color:#FF3B30;">{{ item.price / 100 + "元/" + item.unit }}</span>
              <van-stepper
                v-if="!readonly"
                v-model.number="item.number"
                :key="item.id"
                theme="round"
                default-value="0"
                min="0"
                max="9999.99"
                decimal-length="2"
                :integer="false"
                button-size="16"
                style="margin-left:10px;"
                @change="onServiceChange(item)"
              />
              <span v-if="readonly" style="margin-left:10px;">{{ `共${item.number}${item.unit}` }}</span>
            </span>
          </div>
          <div class="fw-tree-select__box__text" v-if="item.specification">
            规格型号： {{ item.specification }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="!data.length" class="empty-list h100 tc bgfff" style="height: calc(100% - 100px);">
      <div>
        <p>您还未选择材料</p>
      </div>
    </div>
    <div class="btns" v-if="!readonly">
      <div>
        <div class="fw-btm-wrap btn">
          <div
            type="primary"
            class="round"
            @click="closeSelected"
          >
            选择材料
          </div>
          <div
            type="primary"
            class="round"
            style="background:#E1AA6C;color:#ffffff;"
            @click="close()"
          >
            关闭
          </div>
        </div>
      </div>
    </div>
    <div class="btns" v-if="readonly">
      <div class="fw-btm-wrap btn">
        <div
          type="primary"
          class="round"
          @click="close"
          style="width:100%"
        >
          关闭
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import Template from '../approve/template.vue'
export default {
  name: 'SelectedService',
  components: { Template },
  props: {
    data: {
      type: Array,
      default () { return [] }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showPopup: false,
      active: 0,
      sideActive: 0,
      activeIndexes: []
    }
  },
  computed: {},
  watch: {},
  created () {
    console.log(this.data)
  },
  methods: {
    show () {
      this.showPopup = true
    },
    close () {
      this.showPopup = false
    },
    closeSelected () {
      this.showPopup = false
      this.$emit('closeSelected')
    },
    onServiceChange (detail) {
      const list = []
      console.log(this.data)
      this.data.forEach((e, index) => {
        if (e.number > 0) {
          list.push(e)
        }
      })
      console.log(list)
      this.$emit('change', list)
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
.select{
    width: 100%;
    height: 90%;
    z-index: 9999 !important;
}
.service-num{
    font-size: 13px;
    color: #999999;
    padding: 10px;
    border-bottom: 1px solid #F1F1F1;
    background: #ffffff;
    text-align: left;
}
.fw-tree-select {
  position: relative;
  display: flex;
  font-size: 14px;
  user-select: none;
    background: #ffffff;

  &__nav {
    //flex: 1;
    //width: 168px;
    flex-basis: 48%;
    overflow-y: auto;
    background-color: #fff;
    -webkit-overflow-scrolling: touch;

    &-item {
      padding: 14px 12px;
    }
  }

  &__content {
    //   display: flex;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  &__box {
    width: calc(100% - 40px);
    padding: 15px 20px 15px 20px;
    border-bottom: 1px solid #efefef;
    &__item {
      display: flex;
      justify-content: space-between;
    }
    &__text {
      font-size: 13px;
      color: #999999;
      margin-top: 10px;
      text-align: left;
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
    background-color: #f5f5f5;
    border-right-color: #f5f5f5;
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
.number{
  display: flex;
  align-items: center;
}
</style>
