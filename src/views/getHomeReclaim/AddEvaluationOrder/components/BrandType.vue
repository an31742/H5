<template>
  <van-field
    v-model="text"
    class="fw-field"
    maxlength="50"
    name="brandText"
    label="品牌及机型"
    placeholder="请输入"
  />
</template>

<script>
export default {
  data () {
    return {
      text: ''
    }
  }
}
</script>
