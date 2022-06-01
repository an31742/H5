<template>
  <div
    v-if="showText"
    class="split-item"
  >
    <div>{{ opt.name }}:</div>

    <div class="text">
      {{ showText }}
    </div>
  </div>
</template>

<script>
import mixin from '../mixin'

export default {
  name: 'FwTextView',
  mixins: [mixin],
  props: {
    keyName: {
      type: String,
      default: () => ''
    },
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    showText () {
      let str = this.model[this.opt.code + '_desc'] || this.model[this.opt.code]
      if (this.keyName) {
        str = this.model[this.keyName] || str
      }

      return str
    }
  }
}
</script>

<style lang="scss" scoped>
  .split-item {
    display: flex;
    .text {
      flex: 1;padding-left: 10px;
    }
  }
</style>
