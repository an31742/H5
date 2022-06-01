<template>
  <div class="history-detail">
    <div class="detail-cont">
      <p class="title-upload">问题描述</p>
      <div class="question-text">{{ detail.content }}
      </div>
      <p class="title-upload">上传资料</p>
      <div class="img-list" v-if="detail.images_path &&detail.images_path.length">
        <img v-for="(img,index) in detail.images_path" :key="index" :src="img" alt="" @click="view(index)">
      </div>
      <div v-else class="empty">
        <img src="@/assets/image/decoration/empty.png" alt="" class="empty-img">
      </div>
    </div>
    <div class="button-box">
      <van-button color="#E1AA6C" plain size="large" @click="$router.go(-1)">返回</van-button>
    </div>
  </div>
</template>

<script>
import { questionGet } from '@/api/decoration'
import { ImagePreview } from 'vant'
export default {
  name: 'HistoryDetail',
  data () {
    return {
      questionId: Number(this.$route.query.id),
      detail: {}
    }
  },
  created () {
    this.questionDetail()
  },
  methods: {
    view (index) {
      ImagePreview({
        images: this.detail.images_path,
        startPosition: index
      })
    },
    questionDetail () {
      const data = {
        question_id: this.questionId
      }
      questionGet(data).then(res => {
        console.log(res)
        if (res.code === 200) {
          res.data.images_path = res.data.images_path && JSON.parse(res.data.images_path)
          this.detail = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.history-detail{
  .detail-cont{
    height: calc(100vh - 60px);
  }
  .title-upload{
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    padding: 12px 16px;
    box-sizing: border-box;
  }
  .question-text{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #282828;
    padding: 8px 16px;
    box-sizing: border-box;
    background: #fff;
  }
  .img-list{
    padding: 16px;
    box-sizing: border-box;
    background: #fff;
    img{
      width: 80px;
      height: 80px;
      border-radius: 8px;
      margin-right: 5px;
    }
  }
  .button-box{
    padding: 10px 16px;
    background: #fff;
    position: fixed;
    width: 100vw;
    box-sizing: border-box;
    bottom: 0;
    .van-button{
      border-radius: 10px;
    }
  }
  .empty{
    text-align: center;
    padding-top: 20px;
    .empty-img{
      width: 200px;
      height: 106px;
    }
  }
}
</style>
