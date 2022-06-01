<template>
  <div class="bgfff form feed-pop">
    <div class="">
      <h4 class="content">请描述您的使用问题</h4>
      <p class="content">功能异常/产品建议/体验问题等</p>
      <van-form
        ref="form"
        validate-first
        scroll-to-error
        :show-error-message="false"
        @submit="handleSubmit"
        @failed="formValidateToast"
      >
        <van-field
          v-model="form.content"
          class="fw-field bdn"
          rows="4"
          name="content"
          type="textarea"
          maxlength="200"
          placeholder="请输入反馈内容，最多200字。"
          :rules="[{ required: true, message: '请输入反馈内容' }]"
          show-word-limit
          style="padding-top: 0;padding-bottom: 0;"
        ></van-field>

        <div class="content" style="padding-top: 1px;">
          <upload
            ref="upload"
            class="bgfff bdn"
            :fileList="form.pictures"
            :max="5"
            uploadStyle="padding: 16px 0 0 0;"
            @change="changePictures"
          ></upload>
        </div>
      </van-form>
    </div>

    <div style="height: 2.5rem;"></div>
    <div class="fw-btm-wrap btn">
      <van-button
        class="round"
        size="large"
        :disabled="loading"
        :loading="loading"
        @click="handleSave"
      >提交</van-button>
    </div>
  </div>
</template>

<script>
import { minipUserFeedBackAdd } from '@/api/user'
import upload from '@/views/components/upload'
export default {
  name: 'FeedBack',
  components: { upload },
  data () {
    return {
      loading: false,

      form: {
        content: '',
        pictures: []
      }
    }
  },
  methods: {
    // 显示弹框
    show () {
      this.form.content = ''
      this.form.pictures = []
    },

    // 点击保存按钮
    handleSave (e) {
      e.preventDefault()
      this.$refs.form.submit()
    },

    // 图片列表
    changePictures (list = []) {
      this.form.pictures = list
    },

    // 保存
    handleSubmit (res) {
      if (this.$refs.upload.loading) {
        this.$toast('请等待图片上传完成')
        return
      }

      this.loading = true
      const params = { ...this.form }
      params.pictures = params.pictures.map(item => item.orgUrl)
      params.pictures = params.pictures.length ? JSON.stringify(params.pictures) : ''
      minipUserFeedBackAdd(params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 500)
        if (res.code === 200) {
          this.$toast('反馈已提交，我们会尽快处理')
          setTimeout(() => {
            this.$router.back()
          }, 2000)
        } else {
          this.$toast(res.msg || '反馈提交失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .feed-pop {
    padding: 16px 0;
    box-sizing: border-box;
    h4 {
      font-size: 17px;
      font-weight: 400;
      color: rgba(51,51,51,1);
      line-height: 24px;
      margin: 13px 0 5px;
    }
    .content {
      padding: 0 16px;
    }
    p {
      font-size: 12px;
      color: rgba(196,196,196,1);
      line-height: 17px;
      margin-bottom: 17px;
    }
  }
  .van-field__control {
    font-size: 14px;
    color: #666;
    padding: 0 10px;
  }
  .fw-btm-wrap {
    margin-bottom: 10px;
  }
</style>
