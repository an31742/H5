<template>
  <van-popup
    v-model="isShowModal"
    class="suspend feed-pop"
    close-on-popstate
    closeable
    :showConfirmButton="false"
  >
    <div class="content">
      <svg-icon style="font-size:54px" icon-class="close"></svg-icon>
      <div class="title">
        无法完成操作
      </div>
      <p class="tip">因为调查问卷还没有下线，不能删除</p>
    </div>
  </van-popup>

</template>

<script>

export default {
  name: 'AlertModal',

  components: { },
  data () {
    return {
      isShowModal: false
    }
  },

  methods: {
    show () {
      this.isShowModal = true
    },
    hide () {
      this.isShowModal = false
    }
  }
}
</script>

<style scoped lang="scss">
.feed-pop {
    padding: 10px 10px 15px;
    width: 300px;
    background: transparent;
    .content {
      display: flex;
      background: #fff;
      border-radius: 8px;
      flex-direction: column;
      justify-content: center;
      justify-items: center;
      align-items: center;

      padding: 45px 15px 40px  15px;
      .around-item { margin: 0; }
    }
}

.van-submit-bar {
  position: static !important;
}
.bgmain {
  background-color: #fff !important;
}
.form {
  padding: 0 20px;
}
.van-field__control {
  height: 30px;
  background-color: #f5f5f5;
}
.tip {
  padding-left: 18px;
  text-align: center;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 19px;
}

.feed-pop {
  padding: 10px 10px 15px;
  width: 300px;
  background: transparent;
  .content {
    background: #fff;
    border-radius: 8px;
    .around-item {
      margin: 0;
    }
  }
}
.btn{
  border-radius: 20px;
  margin-top: 10px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  .disabled{
    background: linear-gradient(176deg, #F4F4F4 0%, #C4C4C4 100%)!important;
  }
}
.title{
  padding: 24px 0 10px 0;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 25px;
}
</style>
