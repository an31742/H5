<template>
  <div>
    <div class="title">使用情况描述</div>
    <div class="goods-use-desc">
      <van-field
        class="desc-field"
        type="textarea"
        maxlength="200"
        name="useDesc"
        placeholder="请输入"
        v-model="text"
        :autosize="{ maxHeight: 200, minHeight: 74 } "
        show-word-limit
      />
    </div>
  </div>
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
<style lang="scss" scoped>
  .title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 16px;
    background: #fff;
  }
  .goods-use-desc {
    box-sizing: border-box;
    background: #F7F8FA;
    border-radius: 8px;
    padding: 0px 8px;
    .desc-field {
      background: #F7F8FA;
    }
  }
</style>
