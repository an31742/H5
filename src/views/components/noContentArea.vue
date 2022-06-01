<template>
  <div class="container">
    <div class="center">
      <img class="nodataimg" src="~assets/nodata.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoContentArea'
}
</script>

<style scoped lang="scss">
  .container {
    text-align: center;
    .center {
      padding-top: 25vh;
      .nodataimg {
        height: 3rem;
      }
      p {
        font-size: 0.8em;
      }
    }
  }
</style>
