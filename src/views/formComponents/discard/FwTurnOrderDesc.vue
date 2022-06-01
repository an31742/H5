<template>
  <FwDesc :model="model" :opt="option" />
</template>

<script>
import FwDesc from '../FwTextArea'

export default {
  name: 'FwTurnOrderDesc',
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
      return Object.assign(this.opt, { name: '转单备注' })
    }
  }
}
</script>
