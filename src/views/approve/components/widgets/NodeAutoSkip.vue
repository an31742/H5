<template>
  <DescArea>
    <div class="linkUsers">
      <span v-if="item.extra.skip_type===2">自动跳过</span>
      <span v-else>超时跳过</span>
    </div>
    <div v-if="item.extra.reason" class="detail">
      跳过原因：{{ item.extra.reason }}
    </div>
  </DescArea>
</template>

<script>
import DescArea from './DescArea'

export default {
  name: 'NodeAutoSkip',
  components: {
    DescArea
  },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
