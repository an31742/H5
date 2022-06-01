<!--
 * @Author: your name
 * @Date: 2022-04-06 16:19:07
 * @LastEditTime: 2022-05-05 15:11:17
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /staff_h5/src/views/work/report.vue
-->
<template>
  <launch :entryId="entryId" :source="1" @submit="$router.back()"></launch>
</template>

<script>
import launch from '@/views/work/launch'
import { WorkOrderEntry, AppWorkOrderEntry } from '@/utils/const'
import { isApp } from '@/utils/index'

export default {
  name: 'WorkReport',
  components: { launch },
  data () {
    return {
      entryId: isApp() ? AppWorkOrderEntry.selfReport.value : WorkOrderEntry.selfReport.value
    }
  }
}
</script>
