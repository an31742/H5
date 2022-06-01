<template>
  <FwSelectDate :model="model" :opt="opt" />
</template>

<script>
import FwSelectDate from './common/FwSelectDate'

export default {
  name: 'FwDate',
  components: { FwSelectDate },
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
