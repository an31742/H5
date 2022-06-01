<template>
  <span class="desc-area">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'DescArea'
}
</script>

<style scoped lang="scss">
  .desc-area {
    ::v-deep {
      >div {
        margin-bottom: 7px;
      }
    }
  }
</style>
