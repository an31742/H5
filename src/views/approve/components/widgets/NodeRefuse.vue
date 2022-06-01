<template>
  <DescArea>
    <div class="linkUsers">
      <PersonItem :person="fromUser"></PersonItem>
      <span>审批不通过</span>
      <template v-if="item.extra.to_node">
        <span>，回退到</span>
        <span style="color:#5D6EA4;">{{ item.extra.to_node }}</span>
        <span>节点</span>
      </template>
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
  name: 'NodeRefuse',
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
