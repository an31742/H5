<template>
  <DescArea>
    <div class="linkUsers">
      <PersonItem :person="fromUser"></PersonItem>
      <span>抄送给</span>
      <PersonItem v-for="toUser in toUsers" :key="toUser.id" :person="toUser" placement="top"></PersonItem>
      <OptInfo :item="item"></OptInfo>
    </div>
  </DescArea>
</template>

<script>
import PersonItem from './PersonItem'
import DescArea from './DescArea'
import OptInfo from './OptInfo'

export default {
  name: 'NodeCc',
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
    },
    toUsers () {
      return this.item.extra.to_users
    }
  }
}
</script>
