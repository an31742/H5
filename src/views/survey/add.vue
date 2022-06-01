<template>
  <div class="fw-container bgmain">
    <div>
      <!--图片-->
      <van-image
        v-if="surveyObj.background_image"
        class="radius"
        style="margin-bottom: 0.3rem;"
        lazy-load
        fit="cover"
        :src="cosImage(surveyObj.background_image)"
      ></van-image>

      <!--描述-->
      <ul class="img_wrap bgfff">
        <li v-if="surveyObj.description || surveyObj.title" class="inner">
          <div class="title">
            <div class="van-multi-ellipsis--l2 pr">
              <span v-html="surveyObj.title"></span>
              <MsgTypeTip style="float:right" :noticeType="3"></MsgTypeTip>
            </div>
          </div>
          <div class="sub-time">
            {{ dayjs(surveyObj.create_time).format('YYYY-MM-DD HH:mm:ss') }}
            <span v-if="isExprie">
              已过期
            </span>
          </div>
          <div class="ql-editor time" v-html="surveyObj.description"></div>
        </li>
      </ul>

      <!--表单-->
      <van-form
        ref="form"
        class="form"
        validate-first
        scroll-to-error
        :show-error-message="false"
        @submit="handleSubmit"
        @failed="formValidateToast"
      >
        <van-panel
          v-for="(item, index) in questions"
          :key="index"
          class="survey-form"
          :desc="item.description"
          :title="getTitleContent(index, item)"
          :class="item.is_required===1?'van-cell--required':'van-cell--no-required'"
        >
          <!--单选-->
          <div
            v-if="item.type === 1||
              item.type === 4||
              item.type === 6"
            class="van-cell bdn pd0"
          >
            <van-field
              class="err-field pd0"
              :name="item.id + ''"
              :rules="[{ required: 1===item.is_required, message: '请选择' + item.title.replace(/^\d{1,2}、/, '') }]"
            >
              <template #input>
                <van-radio-group v-model="item.user_selected" :disabled="!!commit">
                  <div v-for="(cho, ind) in item.choices" :key="ind" class="choice-c">
                    <div class="choice">
                      <van-image
                        v-if="cho.image"
                        class="thumb"
                        lazy-load
                        fit="cover"
                        :src="cosImage(cho.image)"
                        @click="imagePreview($event,cho.image)"
                      >
                      </van-image>
                      <van-radio class="choice-input" :name="cho.id" icon-size="16">
                        <template #icon="props">

                          <svg-icon v-if="props.checked" icon-class="ckb-on" />
                          <svg-icon v-else icon-class="ckb" />

                        </template>
                        <div class="flex van-cell--center">
                          <div v-if="cho.title || cho.description" class="left_col">
                            {{ cho.title }}
                            <div v-if="cho.description" class="van-cell__label">{{ cho.description }}</div>
                          </div>
                        </div>
                      </van-radio>
                    </div>
                    <div v-if="item.stst" class="flex stst-c" >
                      <Progress
                        :percentage="item.stst[ind].choice_percentage*100"
                        pivot-color="#7232dd"
                        :show-pivot="false"
                        color="#E1AA6C"
                      />
                      <span class="number-c">
                        {{ item.stst[ind].choice_count }}票
                      </span>
                      <span class="number-c number">
                        {{
                          Number(item.stst[ind].choice_percentage*100).toFixed(0)
                        }}%
                      </span>
                    </div>
                  </div>
                </van-radio-group>
              </template>
            </van-field>
          </div>

          <!--多选-->
          <div
            v-if="item.type === 2||
              item.type === 5"
            class="van-cell bdn pd0"
          >
            <van-field class="err-field pd0" :name="item.id + ''" :rules="[{ required: 1===item.is_required, message: '请选择' + item.title.replace(/^\d{1,2}、/, '') }]">
              <template #input>
                <van-checkbox-group v-model="item.user_selected" :disabled="!!commit">
                  <div v-for="(cho, ind) in item.choices" :key="ind" class="choice-c" >
                    <div class="choice">
                      <van-image
                        v-if="cho.image"
                        class="thumb"
                        lazy-load
                        fit="cover"
                        :src="cosImage(cho.image)"
                        @click="imagePreview($event,cho.image)"
                      >
                      </van-image>
                      <van-checkbox
                        class="choice-input"
                        :name="cho.id"
                        icon-size="16"
                      >
                        <template #icon="props">
                          <svg-icon v-if="props.checked" icon-class="checkbox-on" />
                          <svg-icon v-else icon-class="checkbox" />
                        </template>
                        <div class="flex van-cell--center">
                          <div v-if="cho.title || cho.description" class="left_col" style="width:100%">
                            <span>
                              {{ cho.title }}
                            </span>
                            <div v-if="cho.description" class="van-cell__label">{{ cho.description }}</div>
                          </div>
                        </div>
                      </van-checkbox>
                    </div>
                    <div v-if="item.stst" class="flex stst-c" >
                      <Progress
                        :percentage="item.stst[ind].choice_percentage*100"
                        pivot-color="#7232dd"
                        :show-pivot="false"
                        color="#E1AA6C"
                      />
                      <span class="number-c">
                        {{ item.stst[ind].choice_count }}票
                      </span>
                      <span class="number-c number">
                        {{
                          Number(item.stst[ind].choice_percentage*100).toFixed(0)
                        }}%
                      </span>
                    </div>
                  </div>
                </van-checkbox-group>
              </template>
            </van-field>
          </div>

          <!-- // 填空 -->
          <div v-if="item.type === 3">
            <van-field
              v-model="item.user_content"
              class="fw-field inner-textarea"
              placeholder="请输入内容(不超过200字)"
              :name="item.id + ''"
              :readonly="!!commit"
              maxlength="200"
              rows="4"
              type="textarea"
              show-word-limit
              :rules="[{ required: 1===item.is_required, message: '请输入' + item.title.replace(/^\d{1,2}、/, '') }]"
            ></van-field>
          </div>

          <!-- //图片 -->
          <div v-if="item.type === 7">
            <div class="van-cell__value van-field__value">
              <div class="inner-field pr">
                <van-field
                  class="fw-field pr no-bg"
                  :rules="[{ required:1===item.is_required, message: '请上传图片' }]"
                >
                  <template #input>
                    <upload
                      ref="upload"
                      :fileList="item.fileList"
                      :disabled="!!commit"
                      :max="5"
                      uploadStyle="padding: 0;"
                      @change="(fileList)=>changePictures(fileList,item)"
                    >
                    </upload>
                  </template>
                </van-field>
              </div>
            </div>
          </div>
        </van-panel>
      </van-form>

      <!--操作-->
      <div style="height:100px">

      </div>
      <div
        v-if="!commit&&!isExprie"
        style="padding-top: 10px;width: 100%;background: #f5f5f5;z-index: 1001;"
        class="fixed-bottom"
      >
        <div class="fw-button-wrap bgmain btn">
          <div >
            <van-button
              class="round"
              size="large"
              type="primary"
              @click="$refs.form.submit()"
            >提交问卷</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { minipSurveyTopic, minipSurveyCommitAdd, minipSurveyGetChoiceQuestionStats } from 'api/survey'
import { changeTitle } from 'utils/index'
import dayjs from 'dayjs'
import { ImagePreview, Progress } from 'vant'
import { getSurveyQuestionTypeText, TypeObj } from './utility'
import upload from '@/views/components/upload'
import MsgTypeTip from '@/views/message/components/MsgTypeTip.vue'

export default {
  name: 'SurveyAdd',
  components: {
    upload,
    Progress,
    MsgTypeTip
  },
  data () {
    return {
      dayjs,
      surveyId: '',
      commit: null,
      surveyObj: {},
      questions: [],
      choices: [] // 答案
    }
  },
  computed: {
    isExprie () {
      return dayjs(this.surveyObj.end_time) < new Date()
    }
  },
  created () {
    this.surveyId = this.$route.query.id || ''

    if (!this.surveyId) {
      this.$toast('参数错误')
      this.$router.back()
      return
    }

    this.getSurveyTopic()
  },
  async mounted () {
    this.$store.dispatch('message/minipNoticeRead', [Number(this.$route.query.msgId)])
  },
  methods: {

    changePictures (list = [], item) {
      item.fileList = list
      item.user_content = list.map(t => t.url).join(',')

      this.$forceUpdate()
    },

    // 根据是date还是datetime来格式化时间
    formatDateTime (time, type) {
      if (!time) { return '' }
      if (['date', 'datetime'].indexOf(type) < 0) {
        return time
      }
      const fmt = type === 'datetime' ? ' HH:mm:ss' : ''
      return dayjs(time).format(`YYYY-MM-DD${fmt}`)
    },
    imagePreview (e, url) {
      e.stopPropagation()

      ImagePreview({
        images: [ url ],
        closeable: true
      })
    },
    // title展示内容
    getTitleContent (index, item) {
      let str = item.title
      str = str.replace(/^\d{1,2}、/, '')
      str = (index + 1) + '、' + str
      const typeText = getSurveyQuestionTypeText(item.type)
      if (typeText) {
        str += '（' + typeText + '）'
      }

      return str
    },
    // 获取投票详情
    async getSurveyTopic () {
      const res = await minipSurveyTopic({ id: this.surveyId })
      if (res.code === 200) {
        const data = res.data || {}
        this.commit = data.commit
        this.surveyObj = data.topic || {}
        this.questions = data.questions || []
        this.choices = []
        // 过期的不可操作
        if (this.isExprie) {
          this.commit = {}
        }
        for (let i = 0; i < this.questions.length; i++) {
          const q = this.questions[i]
          q.key = Math.floor(Math.random() * 999999)
          q._isEdit = true

          if (q.user_content) {
            q._isEdit = false
            // 多图片
            if (q.type === TypeObj.SurveyQuestionTypeImage.value) {
              q.fileList = q.user_content.split(',').map(url => {
                return {
                  uid: Math.floor(Math.random() * 999999),
                  url: url }
              })
            }
          }
          if (q.user_selected) {
            q._isEdit = false
            /// 单选 结果取值【0】
            if (
              [ TypeObj.SurveyQuestionTypeSingle.value,
                TypeObj.SurveyQuestionTypeJudegement.value,
                TypeObj.SurveyQuestionTypeSingleInstant.value]
                .includes(q.type)) {
              q.user_selected = q.user_selected[0]
            }

            // 投票类 显示统计结果

            if (
              [ TypeObj.SurveyQuestionTypeMultipleInstatnt.value,
                TypeObj.SurveyQuestionTypeSingleInstant.value]
                .includes(q.type)) {
              const r = await minipSurveyGetChoiceQuestionStats({ question_id: q.id })
              q.stst = r.data
            }
          }
        }

        this.$forceUpdate()

        changeTitle(this.surveyObj.title || this.$route.meta.title)
      }
    },

    // 格式化choices
    formatChoices (questions) {
      const answers = []
      questions.forEach(question => {
        if (question.user_selected) {
          if (Array.isArray(question.user_selected)) {
            question.user_selected.forEach(choiceId => {
              answers.push({
                'question_id': question.id,
                'choice_id': choiceId,
                'content': ''
              })
            })
          } else {
            answers.push({
              'question_id': question.id,
              'choice_id': question.user_selected,
              'content': ''
            })
          }
        } else if (question.user_content) {
          answers.push({
            'question_id': question.id,
            'content': question.user_content
          })
        }
      })

      return answers
    },

    // 提交申请
    async handleSubmit () {
      const params = {
        topic_id: this.surveyObj.id,
        choices: this.formatChoices(this.questions)
      }

      try {
        const res = await minipSurveyCommitAdd(params)
        if (res.code === 200) {
          this.$toast('提交成功')

          if (Number(this.$route.query.goback) === 1) {
            this.$router.back()
          } else {
            this.$router.push({ name: 'MessageNotice' })
          }
        } else { this.$toast(res.msg || '提交失败') }
      } catch (e) {

      }
    },
    // 未开始判断
    noStart (survey) {
      return dayjs(survey.start_time) > new Date()
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .title{
    margin-bottom: 5px!important;
  }

  .fw-container { padding: 12px 16px;box-sizing: border-box; }
  .img_wrap {
    border-radius: 4px;padding: 12px;
    .van-image__img { width: 170px;border-radius: 4px 4px 0 0; }
  }

  .desc { font-size: 14px;color: $minor-text-color;line-height: 20px;padding: 16px 16px 4px; }
  .extra { flex: unset !important;padding-left: 10px; }
  .ql-editor {
    margin-top:13px;
    padding: 0;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8C8C8C;
    line-height: 21px;
  }

  .van-checkbox-group, .van-radio-group { width: 100%;margin-left: 13px; }
  .choice-c {
    position: relative;
    padding: 11px 0;

  }
  .choice {
    position: relative;
    padding: 11px 0;
    display: flex;
    justify-items: flex-start;
    flex-wrap:warp;

  }
  .choice-input{
    flex:1;
    margin-left:10px;
  }

.stst-c{
  flex: 2;
  min-height: 10px;
  padding-right:14px ;
  height: 20px;
  align-self:flex-start;
}

  .choice.van-radio, .choice.van-checkbox { padding: 11px 0;width: 100%; min-height: 32px; }
  .left_col { padding: 0 13px 0 0;color: rgba(102,102,102,1); }
  .right_col { flex: unset;width: 115px;height: 66px; }

  ::v-deep .van-cell--required::before {
    left: 15px;z-index: 100;top: 15px;
  }

  .van-cell__title{

    font-size: 17px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 24px;

    span{
      margin-left: 14px;
    }
  }
  ::v-deep .thumb{
    position: relative;
    width: 50px;
      height:50px;
    .van-image__img{
      width: 50px;
      height:50px;
    }
    .svg-icon{
      bottom: 1px;
      right: 1px;
      position: absolute;
    }
  }
  ::v-deep .van-radio__icon{
      height: auto;
  }
  ::v-deep .van-checkbox__icon{
      height: auto;
  }

  ::v-deep .van-radio{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 23px;
  }

 .van-submit-bar{
    background:#f5f5f5 !important

  }

.number-c{
  text-align: right;
  display: inline-block;
  width: 45px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
}
.number{
  width: 45px;
}
.form{
  margin-top:10px;
}

.sub-time{

font-size: 12px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #8C8C8C;
line-height: 17px;
}
.van-cell--no-required{
  .van-cell__title{
    span{margin-left:0}
  }
}
</style>
