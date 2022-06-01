<template>
  <div :class="className" class="fw-tree-select" :style="{height: height + 'px'}">
    <div class="fw-sidebar fw-tree-select__nav">
      <a
        v-for="(item, index) in items"
        :key="index"
        class="fw-sidebar-item fw-tree-select__nav-item"
        :class="{'fw-sidebar-item--select': mainActiveIndex === index}"
        @click="navClick(item, index)"
      >
        <slot name="title" :item="item">
          <div class="van-ellipsis fw-sidebar-item__text">
            {{ item.label }}
          </div>
        </slot>
      </a>
    </div>
    <div class="fw-tree-select__content">
      <div
        v-for="(sub, idx) in subItems"
        :key="idx"
        class="van-ellipsis fw-tree-select__item"
        :class="{'fw-tree-select__item--active': activeId === sub.value}"
        @click="subClick(sub, idx)"
      >
        <slot name="content" :item="sub">
          {{ sub.label }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeSelect',
  props: {
    className: {
      type: String,
      default: ''
    },
    height: {
      type: [Number, String],
      default: 300
    },
    max: {
      type: [Number, String],
      default: Infinity
    },
    items: {
      type: Array,
      default: () => []
    },
    activeId: {
      type: [Number, String, Array],
      default: 0
    },
    mainActiveIndex: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    subItems () {
      return this.items[this.mainActiveIndex] && this.items[this.mainActiveIndex].children || []
    }
  },
  methods: {
    navClick (item, index) {
      this.$emit('click-nav', index)
    },
    subClick (sub, idx) {
      this.$emit('update:activeId', sub.value)
      this.$emit('click-item', sub, idx)
    }
  }
}
</script>

<style scoped lang="scss">
  .fw-tree-select {
    position: relative;
    display: flex;
    font-size: 14px;
    user-select: none;

    &__nav {
      //flex: 1;
      width: 168px;
      overflow-y: auto;
      background-color: #fff;
      -webkit-overflow-scrolling: touch;
      border-right: 1px solid #EFEFEF;

      &-item {
        padding: 14px 12px;
      }
    }

    &__content {
      flex: 2;
      overflow-y: auto;
      background-color: #F6F8FA;
      -webkit-overflow-scrolling: touch;
    }

    &__item {
      position: relative;
      padding: 15px 16px;
      font-weight: 500;
      cursor: pointer;
      background: #fff;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #333333;
      line-height: 20px;
      border-top: 1px solid #EFEFEF;

      &:last-child {
        border-bottom: 1px solid #EFEFEF;
      }

      &--active {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #E1AA6C;
        background: #F7EDE0;
      }

      &--disabled {
        color: #c8c9cc;
        cursor: not-allowed;
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
    padding: 15px 16px;
    overflow: hidden;
    color: #333;
    font-size: 14px;
    line-height: 20px;
    background-color: #fff;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
    border-top: 1px solid #EFEFEF;

    &:last-child {
      border-bottom: 1px solid #EFEFEF;
    }

    &:active {
      background-color: #f2f3f5
    }

    &__text {
      position: relative;
      display: inline-block;
      word-break: break-all
    }

    &:not(:last-child)::after {
      border-bottom-width: 1px
    }

    &--select {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #E1AA6C;
    }

    &--select, &--select:active {
      background-color: #F7EDE0;
    }

    //&--select::before {
    //  position: absolute;
    //  top: 50%;
    //  left: 0;
    //  width: 4px;
    //  height: 16px;
    //  background-color: #ee0a24;
    //  -webkit-transform: translateY(-50%);
    //  transform: translateY(-50%);
    //  content: ''
    //}

    &--disabled {
      color: #c8c9cc;
      cursor: not-allowed
    }

    &--disabled:active {
      background-color: #f7f8fa
    }
  }
</style>
