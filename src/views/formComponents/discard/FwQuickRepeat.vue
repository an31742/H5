<template>
  <FwDesc :model="model" :opt="option" />
</template>

<script>
import FwDesc from '../FwTextArea'

export default {
  name: 'FwQuickRepeat',
  components: { FwDesc },
  props: {
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
    option () {
      return Object.assign(this.opt, { name: '快捷回复' })
    }
  }
}
</script>
