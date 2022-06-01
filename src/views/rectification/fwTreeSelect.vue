<template>
  <div :class="className" class="fw-tree-select" :style="{height: height + 'px'}">
    <!--第一级-->
    <div class="fw-sidebar fw-tree-select__nav" :style="navStyle">
      <a
        v-for="(item, index) in items"
        :key="index"
        class="fw-sidebar-item fw-tree-select__nav-item"
        :class="{'fw-sidebar-item--select': activeIndexes[0] === index}"
        @click="navClick(item, index)"
      >
        <slot name="title" :item="item">
          <div class="van-ellipsis fw-sidebar-item__text">
            {{ item.label || item.name }}
          </div>
        </slot>
      </a>
    </div>

    <!--子级树-->
    <div class="fw-tree-select__content" :style="{flex: depth - 1}">
      <subTree
        @click-item="subClick"
        v-for="dep in depth - 1"
        :key="dep"
        :subItems="findSubItems(dep)"
        :depth="dep"
        :activeIds="activeIds"
        :activeIndexes="activeIndexes"
        @changeIds="changeIds"
      >
        <!--传递slot到subTree-->
        <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
        <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="item">
          <slot :name="name" v-bind="item" />
        </template>
      </subTree>
    </div>
  </div>
</template>

<script>
import subTree from './subTree'

export default {
  name: 'TreeSelect',
  components: { subTree },
  props: {
    // 自定义类名
    className: {
      type: String,
      default: ''
    },
    // tree的高度，跟className互相影响
    height: {
      type: [Number, String],
      default: 300
    },
    // 第一级导航样式
    navStyle: {
      type: [Object, String],
      default: 'flex: 1;'
    },
    // 数据
    items: {
      type: Array,
      default: () => []
    },
    // 选中的values
    activeIds: {
      type: [Array],
      default: () => []
    },
    // 选中的下标
    activeIndexes: {
      type: Array,
      default: () => []
    },
    // 树的渲染深度
    depth: {
      type: Number,
      default: 2
    }
  },
  methods: {
    // 循环下标数组，找到对应的list
    loopArray (list, indexes) {
      list = JSON.parse(JSON.stringify(list))
      if (!indexes || !indexes.length) {
        return []
      }

      let index = ''
      while (indexes.length > 0) {
        index = indexes.splice(0, 1)
        list = list[index] && list[index].children || []
      }

      return list
    },
    // 子树的数据
    findSubItems (depth) {
      const arr = JSON.parse(JSON.stringify(this.activeIndexes))
      arr.length = depth

      return this.loopArray(this.items, arr)
    },
    // 第一级菜单点击
    navClick (item, index) {
      this.$emit('update:activeIds', [item.value || item.id])
      this.$emit('update:activeIndexes', [index])
      this.$emit('click-nav', item, index)
    },
    // 子级树点击
    subClick (sub, index, isLeaf) {
      this.$emit('click-item', sub, index, isLeaf)
    },
    // 更新 activeIds 和 activeIndexes
    changeIds (ids, indexes) {
      this.$emit('update:activeIds', ids)
      this.$emit('update:activeIndexes', indexes)
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
      //width: 168px;
      overflow-y: auto;
      background-color: #fff;
      -webkit-overflow-scrolling: touch;
      border-right: 1px solid #EFEFEF;

      &-item {
         padding: 14px 12px;
      }
    }

    &__content {
      display: flex;
      overflow-y: auto;
      background-color: #F6F8FA;
      -webkit-overflow-scrolling: touch;
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
