<template>
  <FwDesc :model="model" :opt="option" />
</template>

<script>
import FwDesc from '../FwTextArea'

export default {
  name: 'FwOrderDesc',
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
      return Object.assign(this.opt, { name: '提单描述' })
    }
  }
}
</script>
