<template>
  <launch @submit="$router.back()"></launch>
</template>

<script>
import launch from './launch'
// import { WorkOrderEntry } from '@/utils/const'

export default {
  name: 'WorkReport',
  components: { launch },
  data () {
    return {
      // groupId: 268,
      // entryId: 305
      // entryId: WorkOrderEntry.qualityGuard.value
    }
  }
}
</script>
