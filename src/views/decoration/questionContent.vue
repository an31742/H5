<template>
  <div class="question-content">
    <div class="cont">
      <van-row>
        <van-col span="15" class="row-one">
          <span class="red-text">*</span>
          <span class="title">问题描述</span>
        </van-col>
        <van-col span="8">
          <van-cell is-link @click="showQuick">快速选择</van-cell>
          <van-action-sheet v-model="show" title="快速选择">
            <div class="content">
              <div class="check-box">
                <van-checkbox-group v-model="result">
                  <van-cell v-for="(item,index) in quickList" :key="index">
                    <van-checkbox :name="item.id" checked-color="#E1AA6C" shape="square">{{ item.desc }}</van-checkbox>
                  </van-cell>
                </van-checkbox-group>
              </div>
              <div class="btn">
                <van-button size="large" color="#E1AA6C" @click="sure">确认</van-button>
              </div>
            </div>
          </van-action-sheet>
        </van-col>
      </van-row>
      <van-form ref="form" validate-first scroll-to-error :show-error-message="false" @submit="handleSubmit">
        <van-field
          v-model="message"
          rows="8"
          autosize
          type="textarea"
          maxlength="200"
          :rules="formRules({required:true}, '请输入')"
          placeholder="请详细说明问题，有利于客服更快的帮您处理"
          show-word-limit
        />
      </van-form>
      <p class="title-upload">资料上传</p>
      <div class="upload-box">
        <upload
          ref="upload"
          :max="30"
          uploadText="上传图片"
          :uploadStyle="'padding: 15px 10px 5px 5px;'"
          @change="changePictures"
        ></upload>
        <!--      <p>请上传不超过20M的jpg/png格式图片，不超过30张</p>-->
      </div>
    </div>
    <div class="button-box">
      <van-button color="#E1AA6C" plain @click="$router.back()">取消</van-button>
      <van-button color="#E1AA6C" @click="$refs.form.submit()">提报</van-button>
    </div>
  </div>
</template>

<script>
import Upload from 'views/components/upload'
import { questionQuickList, questionCreate } from '@/api/decoration'
import { patrolChecklistCommitGet } from '@/api/task'
import mixin from '@/views/formApprove/mixin.js'
import { string2obj } from '@/utils/index'
export default {
  name: 'QuestionContent',
  mixins: [mixin],
  components: {
    Upload
  },
  data () {
    return {
      message: '',
      show: false,
      pictures: [],
      result: [],
      quickList: [],
      loading: false,
      apply_id: Number(this.$route.query.id),
      commit_id: Number(this.$route.query.commit_id),
      source: 2,
      selectQuestion: [2, 3, 4, 5]
    }
  },
  created () {
    this.questionQuickList()
    if (this.commit_id) {
      this.getCommitDetail()
    }
  },
  methods: {
    showQuick () {
      this.show = true
      this.result = []
    },
    // 处理数据
    dealData (arr) {
      return arr.map(item => {
        if (item.type === 6) {
          item.answer = this.formatPictures(item.answer)
        }
        if (item.type === 5) {
          item.answer = string2obj(item.answer)
        }
        return item
      })
    },
    // 图片格式
    formatPictures (str) {
      str = string2obj(str) || []

      return str.map(item => {
        return {
          url: item,
          status: 'done'
        }
      })
    },
    // 获取提交记录
    getCommitDetail () {
      this.source = 1
      patrolChecklistCommitGet({
        id: this.commit_id
      }).then(res => {
        if (res.code === 200) {
          this.commitDetail = res.data || {}
          this.taskInfo = this.commitDetail.task || {}
          this.answers = this.dealData(this.commitDetail.answers || [])
          this.apply_id = this.commitDetail.apply_id
          console.log(this.answers)
          this.answers.forEach(e => {
            if (this.selectQuestion.includes(e.type) && !e.is_right) {
              this.message += `${e.name}:${e.answer};`
            }
          })
        }
      })
    },
    handleSubmit () {
      const data = {
        apply_id: this.apply_id,
        content: this.message,
        images_path: this.pictures,
        source: this.source,
        commit_id: this.commit_id
      }
      this.loading = true
      questionCreate(data).then(res => {
        console.log(res)
        this.loading = false
        if (res.code === 200) {
          this.$toast('问题提报成功')
          if (this.commit_id) {
            this.$router.replace({
              name: 'DecorationPlanResult',
              query: {
                id: this.commit_id
              }
            })
            return
          }
          this.$router.back()
        }
      })
    },
    questionQuickList () {
      questionQuickList().then(res => {
        console.log(res)
        if (res.code === 200) {
          this.quickList = res.data.list || []
        }
      })
    },
    changePictures (list = []) {
      this.pictures = list.map(item => item.url)
      console.log(this.pictures, 'pictures')
    },
    sure () {
      this.show = false
      console.log(this.result)
      let str = ''
      this.result.forEach(id => {
        const obj = this.quickList.find(q => id === q.id)
        if (obj && obj.desc) {
          str += `${obj.desc};`
        }
      })
      this.message += str
    }
  }
}
</script>

<style scoped lang="scss">
.question-content{
  .cont{
    height: calc(100vh - 64px);
  }
  .van-cell--clickable{
    background: transparent;
  }
  .row-one{
    padding: 12px 8px;
    box-sizing: border-box;
    .red-text{
      color: #FF4D4F;
    }
    .title{
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
  }
  .title-upload{
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    padding: 12px 16px;
    box-sizing: border-box;
  }
  .upload-box{
    padding: 16px;
    box-sizing: border-box;
    background: #fff;
    p{
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #CDCDCD;
    }
  }
  .button-box{
    background: #fff;
    position: fixed;
    text-align: center;
    width: 100vw;
    padding: 10px;
    box-sizing: border-box;
    bottom: 0;
    .van-button{
      width: 115px;
      height: 44px;
      border-radius: 6px;
      margin-right: 13px;
    }
  }
  .van-popup{
    .title-quick{
      color: #333;
      padding: 18px;
      box-sizing: border-box;
      text-align: center;
    }
    .check-box{
      padding-bottom: 70px;
      box-sizing: border-box;
    }
    .van-checkbox{
      padding: 8px 16px 0;
      box-sizing: border-box;
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
    .btn{
      padding: 10px 16px;
      box-sizing: border-box;
      border-radius: 12px;
      position: fixed;
      bottom: 0;
      width: 100vw;
    }
  }
}
</style>
