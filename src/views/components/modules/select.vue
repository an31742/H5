<template>
  <div>
    <van-field
      v-model="question.answer"
      :label="pre + '：' + question.name"
      placeholder="请选择"
      readonly
      name="picker"
      :rules="[{ required: question.need_reply!==0, message: '请选择' }]"
      :class="{'plan-form-need_reply': question.need_reply===0}"
      class="plan-form-input"
      @click="showPicker = true"
    >
      <template #label>
        <p class="result-title">
          {{ pre }}：{{ question.name }}
          <span v-if="question.need_reply===0" class="type">（无需作答）</span>
        </p>
      </template>
      <template #right-icon>
        <svg-icon icon-class="arrow-right-gray" style="font-size:14px;" />
      </template>
    </van-field>

    <van-popup v-if="question.need_reply!==0" v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="(question.options || []).map(item => item.option)"
        @confirm="damageOnConfirm"
        @cancel="showPicker = false"
      ></van-picker>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'Select',
  props: {
    pre: {
      type: String,
      default: () => ''
    },
    question: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showPicker: false
    }
  },
  methods: {
    // 选择器-确认
    damageOnConfirm (val) {
      this.question.answer = val
      this.showPicker = false
    }
  }
}
</script>
