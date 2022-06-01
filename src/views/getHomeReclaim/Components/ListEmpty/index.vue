<!--
  功能：列表--空状态
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月23日 16:31:42
-->
<template>
  <van-empty
    class="custom__image"
    :image="require('views/getHomeReclaim/Components/ListEmpty/images/bg.png')"
    :description="desc"
  />
</template>

<script>
export default {
  // 组件名称
  name: 'ListEmpty',
  props: {
    desc: {
      type: String,
      default: '暂无订单'
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep.custom__image {
    background-color: #f5f5f5;
    .van-empty__image {
      width: 200px;
      height: 116px;
      margin-top: 62px;
    }
  }
</style>
