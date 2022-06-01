<template>
  <DescArea>
    <div class="linkUsers">
      <personItem :person="fromUser"></personItem>
      <span>催办</span>
      <personItem v-for="toUser in toUsers" :key="toUser.id" :person="toUser" placement="top"></personItem>
      <OptInfo :item="item"></OptInfo>
    </div>
    <div v-if="item.extra.content" class="detail">
      催办内容：{{ item.extra.content }}
    </div>
  </DescArea>
</template>

<script>
import PersonItem from './PersonItem'
import DescArea from './DescArea'
import OptInfo from './OptInfo'

export default {
  name: 'NodeRemind',
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
      return this.item.extra.remind_to || []
    }
  }
}
</script>
