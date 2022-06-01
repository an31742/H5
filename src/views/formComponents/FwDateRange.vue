<template>
  <FwSelectDate :model="model" :opt="opt" calendar-type="range" />
</template>

<script>
import FwSelectDate from './common/FwSelectDate'

export default {
  name: 'FwDateRange',
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
