<template>
  <div :style="{flex: 1}">
    <div
      v-for="(sub, idx) in subItems"
      :key="idx"
      class="van-ellipsis fw-tree-select__item"
      :class="{'fw-tree-select__item--active': activeIds[depth] === (sub.value || sub.id)}"
      @click="subClick(sub, idx, !sub.children || !sub.children.length)"
    >
      <slot name="sub" :item="sub">
        {{ sub.label || sub.name }}
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubTree',
  props: {
    // 数据
    subItems: {
      type: Array,
      default: () => []
    },
    // 当前子树所处层级
    depth: {
      type: Number,
      default: 1
    },
    // 选中的values
    activeIds: {
      type: Array,
      default: () => []
    },
    // 选中的下标
    activeIndexes: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // subTree click事件，isLeaf：是否是叶子节点
    subClick (sub, idx, isLeaf) {
      const ids = JSON.parse(JSON.stringify(this.activeIds))
      const indexes = JSON.parse(JSON.stringify(this.activeIndexes))

      ids.length = this.depth
      indexes.length = this.depth
      ids.splice(this.depth, 1, sub.value || sub.id)
      indexes.splice(this.depth, 1, idx)

      this.$emit('changeIds', ids, indexes)
      this.$emit('click-item', sub, idx, isLeaf)
    }
  }
}
</script>

<style scoped lang="scss">
  .fw-tree-select {
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
      border-right: 1px solid #EFEFEF;

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
  }
</style>
