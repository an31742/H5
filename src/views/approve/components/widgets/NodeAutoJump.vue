<template>
  <DescArea>
    <div class="linkUsers">
      <span>自动跳过</span>
      <PersonItem :person="skipUser"></PersonItem>
    </div>
    <div class="linkUsers">
      <span v-if="item.extra.skip_type===2">连续节点审批过的审批人跳过</span>
      <span v-if="item.extra.skip_type===3">之前节点审批过的审批人跳过</span>
    </div>
  </DescArea>
</template>

<script>
import PersonItem from './PersonItem'
import DescArea from './DescArea'
import OptInfo from './OptInfo'
export default {
  name: 'NodeAutoJump',
  components: {
    PersonItem,
    DescArea,
    OptInfo
  },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    skipUser () {
      return this.item.extra.skip_user
    }
  }
}
</script>
