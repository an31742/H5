<template>
  <div @click.stop>
    <van-field
      readonly
      required
      class="select-time fw-field"
      label="使用时长"
      placeholder="请选择"
      name="useDuration"
      right-icon="arrow"
      :value="key"
      :error="false"
      :rules="[{ validator, message: '请选择使用时长' }]"
      @click="showPicker = true"
    >
      <template #input>
        <div @click="showPicker = true">
          <span v-if="value">{{ value }}</span>
          <span v-else style="color: #CDCDCD;">请选择</span>
        </div>
      </template>
    </van-field>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        value-key="label"
        :columns="appConfig.ESTIMATE_GOODS_USE_TIME_LIST"
        @confirm="onConfirm"
        @cancel="changeShowStatus"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'SelectTime',
  components: {},
  data () {
    return {
      value: '',
      key: 0,
      showPicker: false
    }
  },
  methods: {
    validator () {
      return !!this.value
    },
    onConfirm (val) {
      this.value = val.label
      this.key = val.value
      this.changeShowStatus()
    },
    changeShowStatus () {
      this.showPicker = !this.showPicker
    }
  }
}
</script>

<style lang="scss" scoped>
  .select-time {
    border-bottom: 1px solid #eeeeee;
  }
</style>
