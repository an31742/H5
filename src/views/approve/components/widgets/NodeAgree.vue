<template>
  <DescArea>
    <div class="linkUsers">
      <PersonItem :person="agreeUser"></PersonItem>
      <span>同意</span>
      <OptInfo :item="item"></OptInfo>
    </div>
    <div v-if="item.extra.content" class="detail">
      理由：{{ item.extra.content }}
    </div>
  </DescArea>
</template>

<script>
import PersonItem from './PersonItem'
import DescArea from './DescArea'
import OptInfo from './OptInfo'
export default {
  name: 'NodeAgree',
  components: {
    DescArea,
    PersonItem,
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
    agreeUser () {
      return this.item.extra.agree_user
    }
  }
}
</script>
