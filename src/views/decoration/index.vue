<template>
  <div class="decoration">
    <ul>
      <li @click="$router.push('/decoration/question')">
        <p>
          <img src="@/assets/image/decoration/wentitibao.png" alt="">
          <span>问题提报</span>
        </p>
        <p>
          <van-icon name="arrow" />
        </p>
      </li>
      <li @click="$router.push('/decoration/material')">
        <p>
          <img src="@/assets/image/decoration/ziliaobuchong.png" alt="">
          <span>资料补充</span>
        </p>
        <p>
          <van-icon name="arrow" />
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style scoped lang="scss">
.decoration{
  ul{
    padding: 16px;
    box-sizing: border-box;
    li{
      width: 343px;
      height: 78px;
      background: #fff;
      border-radius: 10px;
      margin-bottom: 20px;
      padding: 30px 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      img{
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
      }
    }
  }
}
</style>
