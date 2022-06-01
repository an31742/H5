<template>
  <DescArea>
    <div v-for="(candidateItem, idx) in candidates" :key="idx" style="display: flex;justify-content: space-between;align-items: center;">
      <div class="linkUsers">
        <PersonItem :person="candidateItem"></PersonItem>
        <span>未审批</span>
      </div>
    </div>
  </DescArea>
</template>

<script>
import PersonItem from './PersonItem'
import DescArea from './DescArea'
export default {
  name: 'NodeTodo',
  components: {
    DescArea,
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
  computed: {
    candidates () {
      return this.item.extra.candidates
    }
  }
}
</script>
