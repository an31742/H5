<template>
  <DescArea>
    <div class="linkUsers">
      <PersonItem :person="fromUser"></PersonItem>
      <span>结束了审批流程</span>
      <OptInfo :item="item"></OptInfo>
    </div>
  </DescArea>
</template>

<script>
import PersonItem from './PersonItem'
import DescArea from './DescArea'
import OptInfo from './OptInfo'

export default {
  name: 'NodeCloseByPerson',
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
    fromUser () {
      return this.item.extra.from_user
    }
  }
}
</script>
