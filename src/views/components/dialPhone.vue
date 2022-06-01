<template>
  <!--拨打电话-->
  <van-action-sheet
    v-model="showSheet"
    :round="false"
    :actions="sheetActions"
    :get-container="getBodyContainer"
    cancel-text="取消"
    close-on-click-action
    @cancel="handleCancel"
    @select="selectAction"
    @click-overlay="handleCancel"
  ></van-action-sheet>
</template>

<script>
export default {
  name: 'DialPhone',
  data () {
    return {
      sheetActions: [],
      showSheet: false
    }
  },
  methods: {
    // 拨打电话
    handleDial (tels) {
      if (!tels || !tels.length) { return }

      this.sheetActions = tels
      this.showSheet = true
    },
    // 拨打电话
    selectAction (item) {
      window.location.href = `tel://${item.name}`
    },
    // 取消
    handleCancel () {
      this.showSheet = false
      this.$emit('cancel')
    }
  }
}
</script>
