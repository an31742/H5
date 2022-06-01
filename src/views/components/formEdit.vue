<template>
  <div class="plan-form">
    <van-form ref="qf" scroll-to-error @submit="onSubmit">
      <!--{"label":"文本框","value":1},-->
      <!--{"label":"下拉框","value":2},-->
      <!--{"label":"判断框","value":3},-->
      <!--{"label":"单选框","value":4},-->
      <!--{"label":"复选框","value":5},-->
      <!--{"label":"图片","value":6},-->
      <!--{"label":"文本域","value":7}-->
      <!--{"label":"分值","value":8}-->
      <div v-for="(question, index) in questions" :key="index" class="plan-form-item">
        <!--文本框-->
        <van-field
          v-if="question.type===1"
          v-model="question.answer"
          placeholder="请输入"
          :name="question.answer"
          :rules="[{ required: question.need_reply!==0, message: '请输入' }]"
          class="plan-form-input"
          :class="{'plan-form-need_reply': question.need_reply===0}"
        >
          <template #label>
            <p class="result-title">
              {{ projectType }}{{ index + 1 }}：{{ question.name }}
              <span v-if="question.need_reply===0" class="type">（无需作答）</span>
            </p>
          </template>
        </van-field>

        <!--下拉框-->
        <subSelect v-if="question.type===2" :question="question" :pre="projectType + (index + 1)"></subSelect>

        <!--判断框-->
        <van-field
          v-if="question.type===3"
          v-model="question.answer"
          name="radio"
          :rules="[{ required: question.need_reply!==0, message: '请选择' }]"
        >
          <template #label>
            <p class="result-title">
              {{ projectType }}{{ index + 1 }}：{{ question.name }}
              <span v-if="question.need_reply===0" class="type">（无需作答）</span>
            </p>
          </template>
          <template v-if="question.need_reply!==0" #input>
            <van-radio-group v-model="question.answer" direction="horizontal">
              <van-radio name="是" icon-size="17px" checked-color="#E1AA6C">是</van-radio>
              <van-radio name="否" icon-size="17px" checked-color="#E1AA6C">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <!--单选框-->
        <div v-if="question.type===4" class="plan-form-select">
          <van-field
            v-model="question.answer"
            name="radio"
            :rules="[{ required: question.need_reply!==0, message: '请选择' }]"
          >
            <template #label>
              <p class="result-title">
                {{ projectType }}{{ index + 1 }}：{{ question.name }}
                <span v-if="question.need_reply===0" class="type">（无需作答）</span>
              </p>
            </template>
            <template v-if="question.need_reply!==0" #input>
              <van-radio-group v-model="question.answer" class="radio-column">
                <van-radio
                  v-for="(opt, idx) in question.options"
                  :key="idx"
                  :name="opt.option"
                  icon-size="17px"
                  checked-color="#E1AA6C"
                >{{ opt.option }}</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </div>

        <!--复选框-->
        <div v-if="question.type===5" class="plan-form-select">
          <van-field name="checkbox" :rules="[{ required: question.need_reply!==0, message: '请选择' }]">
            <template #label>
              <p class="result-title">
                {{ projectType }}{{ index + 1 }}：{{ question.name }}
                <span v-if="question.need_reply===0" class="type">（无需作答）</span>
              </p>
            </template>
            <template v-if="question.need_reply!==0" #input>
              <van-checkbox-group v-model="question.answer" class="checkbox-column">
                <van-checkbox
                  v-for="(opt, optIdx) in question.options"
                  :key="optIdx"
                  :name="opt.option"
                  icon-size="17px"
                  checked-color="#E1AA6C"
                  shape="square"
                >
                  {{ opt.option }}
                </van-checkbox>
              </van-checkbox-group>
            </template>
          </van-field>
        </div>

        <!--图片-->
        <div v-if="question.type===6" class="plan-form-select value-indent">
          <van-field
            name="uploader"
            :rules="[{ required: question.need_reply!==0, message: '请上传' }]"
          >
            <template #label>
              <div class="plan-form-content">
                <p class="result-title">
                  {{ projectType }}{{ index + 1 }}：{{ question.name }}
                  <span v-if="question.need_reply===0" class="type">（无需作答）</span>
                </p>
                <p class="plan-form-picture">
                  {{ question.answer ? question.answer.length : 0 }}/5
                </p>
              </div>

            </template>
            <template v-if="question.need_reply!==0" #input>
              <upload
                ref="upload"
                :max="5"
                :fileList="question.answer"
                :uploadStyle="uploadStyle"
                :checkTimeStamp="30"
                :capture="!isIos() ? null : 'camera'"
                @change="(list) => { changeFiles(list, question) }"
              >
                <slot>
                  <div class="van-uploader__upload">
                    <i class="van-icon van-icon-plus van-uploader__upload-icon"></i>
                    <span class="van-uploader__upload-text">上传图片</span>
                  </div>
                </slot>

                <template #preview-cover="{ item }">
                  <slot name="preview-cover" :item="item"></slot>
                </template>
              </upload>
            </template>
          </van-field>
        </div>

        <!--文本域-->
        <van-field
          v-if="question.type===7"
          v-model="question.answer"
          show-word-limit
          type="textarea"
          rows="5"
          placeholder="请输入"
          maxlength="200"
          style="position: relative;"
          :rules="[{ required: question.need_reply!==0, message: '请输入' }]"
          class="plan-form-input plan-form-limit"
          :class="{'plan-form-need_reply': question.need_reply===0}"
        >
          <template #label>
            <p class="result-title">
              {{ projectType }}{{ index + 1 }}：{{ question.name }}
              <span v-if="question.need_reply===0" class="type">（无需作答）</span>
            </p>
          </template>
        </van-field>

        <!--文本框-->
        <van-field
          v-if="question.type===8"
          v-model="question.answer"
          placeholder="请输入"
          type="number"
          :name="question.answer"
          :rules="[{ required: question.need_reply!==0, message: '请输入' },{ validator:(val)=>validatorScore(val,question), message: '请输入正确的数' }]"
          class="plan-form-input"
          :class="{'plan-form-need_reply': question.need_reply===0}"
        >
          <template #label>
            <p class="result-title">
              {{ projectType }}{{ index + 1 }}：{{ question.name }}
              <span v-if="question.need_reply===0" class="type">（无需作答）</span>
            </p>
          </template>
        </van-field>
      </div>

      <!--底部按钮-->
      <slot name="button"></slot>
    </van-form>
  </div>
</template>

<script>
import { isIos } from '@/utils/index'
import subSelect from './modules/select'
import upload from '@/views/components/upload_form'

export default {
  name: 'PlanFormEdit',
  components: {
    subSelect,
    upload
  },
  props: {
    questions: {
      type: Array,
      default: () => []
    },
    projectType: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      isIos,
      uploadStyle: 'padding: 0px 2px 8px 0px;'
    }
  },
  methods: {
    validatorScore (val, item) {
      const max = Number(item.options[0].option)
      if (val < 0) {
        this.$toast('不能小于0')
        return false
      } else if (val > max) {
        this.$toast(`最大不能超过${max}`)
        return false
      }
      if (!/^(0|[1-9][0-9]*)+(.[0-9]{1})?$/.test(val)) {
        this.$toast('只能输入1位小数')
        return false
      }
    },
    // 图片列表
    changeFiles (list = [], question) {
      const arr = list.length ? list.map(item => item['url'] || item['orgUrl']) : ''

      this.$set(question, 'answer', arr)
    },
    // 表单提交
    onSubmit () {
      // 判断是否有图片在上传中
      let comps = this.findChildren(this.$children)
      comps = comps.filter(item => item.$options.name === 'UploadComponent' && item.loading)
      if (comps && comps.length) {
        this.$toast('请等待图片上传完成')
        return
      }

      const checklist = this.getCheckList() // submit前再做一次校验
      for (let i = 0; i < checklist.length; i++) {
        if (checklist[i].need_reply === 1 && !checklist[i].answer) {
          this.$toast('请填写完整表单')
          return
        }
      }

      console.log('onSubmit', this.questions)
      this.$emit('onSubmit')
    },
    // 获取格式化后的表单项
    getCheckList () {
      const checkList = []

      this.questions.map(item => {
        if ([1, 2, 3, 4, 7, 8].includes(item.type)) {
          checkList.push({
            id: item.id,
            answer: item.answer || '',
            need_reply: item.need_reply
          })
        } else if (item.type === 6) {
          checkList.push({
            id: item.id,
            need_reply: item.need_reply,
            answer: item.answer && item.answer.length ? JSON.stringify(item.answer) : ''
          })
        } else if (item.type === 5) {
          checkList.push({
            id: item.id,
            need_reply: item.need_reply,
            answer: item.answer && item.answer.length ? JSON.stringify(item.answer) : ''
          })
        }
      })

      return checkList
    }
  }
}
</script>

<style lang="scss" scoped>
  .plan-form {
    padding-bottom: 72px;

    &-item, &-select {
      position: relative;
    }

    &-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-picture {
      font-size: 14px;
      line-height: 18px;
      color: #999999;
    }
  }

  ::v-deep .value-indent {
    .van-field__value {
      padding-left: 16px;
    }
  }

  ::v-deep .van-field__word-limit {
    position: absolute;
    right: 16px;
    top: -32px;
  }

  .van-field--error .result-title {
    padding-right: 50px;
  }

  .plan-form-input .result-title {
    padding-right: 0;
  }

  .plan-form-limit .result-title {
    padding-right: 52px;
  }

  .van-field--error .plan-form-content {
    padding-right: 50px;
    .result-title {
      padding-right: 0;
    }
  }
</style>
