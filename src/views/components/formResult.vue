<template>
  <div class="result-form-main">
    <!--{"label":"文本框","value":1},-->
    <!--{"label":"下拉框","value":2},-->
    <!--{"label":"判断框","value":3},-->
    <!--{"label":"单选框","value":4},-->
    <!--{"label":"复选框","value":5},-->
    <!--{"label":"图片","value":6},-->
    <!--{"label":"文本域","value":7}-->
    <div v-for="(answer, index) in answers" :key="index">
      <!--文本框-->
      <div v-if="answer.type === 1" class="result-form">
        <p class="result-title">
          {{ projectType }}{{ index + 1 }}：{{ answer.name }}
          <span v-if="answer.need_reply===0" class="type">(无需作答)</span>
        </p>
        <p v-if="answer.need_reply!==0" class="result-answer">{{ answer.answer }}</p>
      </div>

      <!--分值-->
      <div v-if="answer.type === 8" class="result-form">
        <p class="result-title">
          {{ projectType }}{{ index + 1 }}：{{ answer.name }}
          <span v-if="answer.need_reply===0" class="type">(无需作答)</span>
        </p>
        <p v-if="answer.need_reply!==0" class="result-answer">{{ answer.answer }}</p>
      </div>

      <!--文本域-->
      <div v-if="answer.type === 7" class="result-form">
        <p class="result-title result-between">
          {{ projectType }}{{ index + 1 }}：{{ answer.name }}
          <span v-if="answer.need_reply===0" class="type">(无需作答)</span>
          <span class="result-gray">{{ answer.answer.length }}/200</span>
        </p>
        <p v-if="answer.need_reply!==0" class="result-answer">{{ answer.answer }}</p>
      </div>

      <!--下拉框-->
      <div v-if="answer.type === 2" class="result-form">
        <p class="result-title">
          {{ projectType }}{{ index + 1 }}：{{ answer.name }}
          <span v-if="answer.need_reply===0" class="type">(无需作答)</span>
        </p>
        <p v-if="answer.need_reply!==0" class="result-answer">
          {{ answer.answer }}
        </p>
        <p v-if="answer.need_reply!==0" class="result-explain">正常：{{ getRightAnswer(answer.options) }}</p>
      </div>

      <!--判断框-->
      <div v-if="answer.type === 3" class="result-form">
        <p class="result-title">
          {{ projectType }}{{ index + 1 }}：{{ answer.name }}
          <span v-if="answer.need_reply===0" class="type">(无需作答)</span>
        </p>
        <van-radio-group v-if="answer.need_reply!==0" v-model="answer.answer" direction="horizontal" disabled class="result-answer">
          <van-radio v-for="(opt, optIdx) in answer.options" :key="optIdx" :name="opt.option" icon-size="17px">
            <span>{{ opt.option }}</span>
            <span v-if="opt.is_right_option" class="result-tags-normal">正常</span>
            <!-- <span v-else class="result-tags-abnormal">异常</span> -->
          </van-radio>
        </van-radio-group>
      </div>

      <!--单选框-->
      <div v-if="answer.type === 4" class="result-form">
        <p class="result-title">
          {{ projectType }}{{ index + 1 }}：{{ answer.name }}
          <span v-if="answer.need_reply===0" class="type">(无需作答)</span>
        </p>
        <van-radio-group v-if="answer.need_reply!==0" v-model="answer.answer" disabled class="result-selectbox">
          <van-radio v-for="(opt, optIdx) in answer.options" :key="optIdx" :name="opt.option" icon-size="17px">
            <span>{{ opt.option }}</span>
            <span v-if="opt.is_right_option" class="result-tags-normal">正常</span>
            <!-- <span v-else class="result-tags-abnormal">异常</span> -->
          </van-radio>
        </van-radio-group>
      </div>

      <!--复选框-->
      <div v-if="answer.type === 5" class="result-form">
        <p class="result-title">
          {{ projectType }}{{ index + 1 }}：{{ answer.name }}
          <span v-if="answer.need_reply===0" class="type">(无需作答)</span>
        </p>
        <van-checkbox-group v-if="answer.need_reply!==0" v-model="answer.answer" disabled class="result-selectbox">
          <van-checkbox v-for="(opt, optIdx) in answer.options" :key="optIdx" :name="opt.option" icon-size="17px" shape="square">
            <span>{{ opt.option }}</span>
            <span v-if="opt.is_right_option" class="result-tags-normal">正常</span>
            <!-- <span v-else class="result-tags-abnormal">异常</span> -->
          </van-checkbox>
        </van-checkbox-group>
      </div>

      <!--图片-->
      <div v-if="answer.type === 6" class="result-form">
        <p class="result-title result-between">
          {{ projectType }}{{ index + 1 }}：{{ answer.name }}
          <span v-if="answer.need_reply===0" class="type">(无需作答)</span>
          <span class="result-gray">{{ answer.answer.length }}/5</span>
        </p>
        <van-uploader v-if="answer.need_reply!==0 && answer.answer.length" v-model="answer.answer" :deletable="false" class="result-upload"></van-uploader>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanFormResult',
  props: {
    projectType: {
      type: String,
      default () {
        return ''
      }
    },
    answers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    getRightAnswer (arr) {
      const ans = arr.filter(item => item['is_right_option'])

      return ans && ans[0] ? ans[0].option : ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .result {
    &-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-form {
      margin-bottom: 8px;
      background: #fff;

      &-main {
        padding-bottom: 72px;
      }
    }

    &-title, &-answer, &-explain, &-gray, &-selectbox {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      font-weight: 400;
    }

    &-title, &-answer, &-explain {
      padding: 12px 16px;
      box-sizing: border-box;
    }

    &-explain {
      padding-top: 0;
    }

    &-gray, &-answer, &-selectbox {
      color: #999999;
    }

    &-explain {
      color: #64CCA8;
    }

    &-tags-normal, &-tags-abnormal {
      font-size: 12px;
      line-height: 16px;
      padding: 2px 6px;
      box-sizing: border-box;
      border-radius: 4px;
      margin-left: 8px;
      display: inline-block;
      width: 36px;
      height: 20px;
      min-width: 36px;
    }

    &-tags-normal {
      color: #64CCA8;
      background: rgba(100, 204, 168, 0.15);
    }

    &-tags-abnormal {
      color: #FA5151;
      background: rgba(250, 81, 81, 0.15);
    }

    &-upload {
      padding: 16px;
      box-sizing: border-box;
      padding-right: 0;
    }
  }

  ::v-deep {
    .van-uploader__preview-image {
      border-radius: 5px;
      background: #FAFBFD;
    }
  }
</style>
