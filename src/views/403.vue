<template>
  <div class="fw-container bgfff tc">
    <svg-icon icon-class="404-o" />

    <div class="tips">
      呀～您无访问权限
    </div>
    <div>
      <div style="height: 1.92rem;"></div>
      <!-- <div class="van-submit-bar">
        <div class="fw-btm-wrap">
          <van-button size="large" type="primary" @click="$router.replace({path: '/'})">返回首页</van-button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page403'
}
</script>

<style lang="scss" scoped>
  .svg-icon {
    height: 112px;
    width: auto;
    padding: 140px 0 35px 0;
  }
  .tips {
    height:20px;
    line-height:20px;
    font-size:14px;
    padding-bottom: 100px;
    color: #E1AA6C;
  }
</style>
