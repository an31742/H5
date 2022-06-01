<template>
  <div class="empty-list tc" :class="className" style="height: calc(100vh - 44px);">
    <slot name="content">
      <div style="margin-bottom:18px;">
        <svg-icon icon-class="empty-o" />
        <slot name="text">
          <p>暂无数据</p>
        </slot>
      </div>
    </slot>
  </div>
</template>

<script>
/**
 * 支持slot插槽自定义展示内容
 *  示例：<empty-list><div slot="content">自定义内容，可以是htmls</div></empty-list>
 */
export default {
  name: 'EmptyList',
  props: {
    className: {
      type: String,
      default: ''
    }
  }
}
</script>
