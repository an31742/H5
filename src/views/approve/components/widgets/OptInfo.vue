<template>
  <span v-if="config[item.extra.opt_mode]">
    <span>(</span>
    <PersonItem :person="item.extra.raw_user"></PersonItem>
    <span> {{ config[item.extra.opt_mode] }}</span>
    <span>)</span>
  </span>
</template>

<script>
import PersonItem from './PersonItem'
export default {
  name: 'OptInfo',
  components: {
    PersonItem
  },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      config: {
        2: '授权',
        3: '抄送人',
        4: '转办人操作',
        6: '加签'
      }
    }
  }
}
</script>
