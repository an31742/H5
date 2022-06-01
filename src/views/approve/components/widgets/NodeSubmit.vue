<template>
  <DescArea>
    <div v-if="item.extra&&item.extra.from_user" class="linkUsers">
      <PersonItem :person="item.extra.from_user"></PersonItem>
      <span>提交审批</span>
      <OptInfo :item="item"></OptInfo>
    </div>
  </DescArea>
</template>

<script>
import PersonItem from './PersonItem'
import DescArea from './DescArea'
import OptInfo from './OptInfo'

export default {
  name: 'NodeSubmit',
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
  }
}
</script>
