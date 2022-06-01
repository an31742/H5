<template>
  <span v-if="person && person.name">
    <PersonPopover
      :key="person.id"
      :person="{
        avatar: person.avatar,
        name: person.name,
        department: person.dep_node_name,
        role: person.role_name
      }"
      :placement="placement"
    >
    </PersonPopover>
  </span>
</template>

<script>
import PersonPopover from '../PersonPopover'

export default {
  name: 'PersonItem',
  components: {
    PersonPopover
  },
  props: {
    person: {
      type: Object,
      default () {
        return {}
      }
    },
    placement: {
      type: String,
      default: 'top-start'
    }
  }
}
</script>
