<template>
  <launch
    :entryId.sync="entryId"
    :source="source"
    :roomId="0"
    :serviceId="serviceId"
    :subServiceId="subServiceId"
    :groupId="groupId"
    :commitId="commitId"
    :deviceId="deviceId"
    :type="type"
    @submit="onSubmitOk"
  />
</template>

<script>
import launch from '@/views/work/launch'
import { WorkOrderEntry, AppWorkOrderEntry } from '@/utils/const'
import {
  minipCleaningRepairAdd,
  minipDeviceRecordQrcodeReport,
  minipDeviceRepairAdd,
  minipGuardianRepairAdd,
  minipQualityRepairAdd } from '../../api/task'
import { WorkOrderType } from '../../utils/const'
import { isApp } from '@/utils/index'

const guardMap = {
  1: WorkOrderEntry.safeGuard.value,
  2: WorkOrderEntry.cleanGuard.value,
  3: WorkOrderEntry.guardianGuard.value,
  4: WorkOrderEntry.safeGuard.value,
  5: WorkOrderEntry.qualityGuard.value
}

const appGuardMap = {
  1: AppWorkOrderEntry.safeGuard.value,
  2: AppWorkOrderEntry.cleanGuard.value,
  3: AppWorkOrderEntry.guardianGuard.value,
  4: AppWorkOrderEntry.safeGuard.value,
  5: AppWorkOrderEntry.qualityGuard.value
}

export default {
  name: 'WorkBrokenReport',
  components: { launch },
  data () {
    return {
      type: Number(this.$route.query.type) || undefined, // 1工程 2环境 3秩序 4二维码 5 品质
      entryId: isApp() ? appGuardMap[this.$route.query.type] : guardMap[this.$route.query.type],
      commitId: Number(this.$route.query.commitId) || undefined,
      source: Number(this.$route.query.source) || undefined,
      roomId: '0',
      taskId: Number(this.$route.query.taskId) || undefined,
      serviceId: '',
      subServiceId: '',
      groupId: Number(this.$route.query.groupId) || undefined,
      deviceId: Number(this.$route.query.deviceId) || undefined,
      pointId: Number(this.$route.query.pointId) || undefined,
      nextIndex: Number(this.$route.query.nextIndex) || undefined,
      groupType: Number(this.$route.query.group_type) || undefined
    }
  },
  created () {
    console.log(this.$route.query, 'this.$route.query')
  },
  methods: {
    onSubmitOk (resData) {
      const data = {
        work_order_id: resData.id,
        work_order_record_id: resData.record_id
      }
      switch (this.type) {
        case WorkOrderType.device:
          data.device_id = this.deviceId
          data.commit_id = this.commitId
          minipDeviceRepairAdd(data).then(res => {
            if (res.code === 200) {
              if (this.nextIndex && this.nextIndex !== -1) {
                this.$router.replace({
                  name: 'PlanFacility',
                  query: { id: this.taskId }
                })
              } else {
                this.$router.back()
              }
            }
          })
          break
        case WorkOrderType.clean:
          data.location_point_id = this.pointId
          data.commit_id = this.commitId
          minipCleaningRepairAdd(data).then(res => {
            if (res.code === 200) {
              if (this.nextIndex && this.nextIndex !== -1) {
                this.$router.replace({
                  name: 'PlanFacilityClean',
                  query: { id: this.taskId }
                })
              } else {
                this.$router.back()
              }
            }
          })
          break
        case WorkOrderType.squence:
          data.location_point_id = this.pointId
          data.commit_id = this.commitId
          minipGuardianRepairAdd(data).then(res => {
            if (res.code === 200) {
              if (this.nextIndex && this.nextIndex !== -1) {
                this.$router.replace({
                  name: 'PlanFacilitySequence',
                  query: { id: this.taskId }
                })
              } else {
                this.$router.back()
              }
            }
          })
          break
        case WorkOrderType.quality:
          data.location_point_id = this.pointId
          data.commit_id = this.commitId
          data.group_type = this.groupType
          minipQualityRepairAdd(data).then(res => {
            if (res.code === 200) {
              if (this.nextIndex && this.nextIndex !== -1) {
                this.$router.replace({
                  name: 'WorkDetail',
                  query: { id: resData.record_id }
                })
              } else {
                this.$router.back()
              }
            }
          })
          break
        case WorkOrderType.qrcode:
          data.id = this.deviceId
          minipDeviceRecordQrcodeReport(data).then(res => {
            if (res.code === 200) {
              this.$router.back()
            }
          })
      }
    }
  }
}
</script>
