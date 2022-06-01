<template>
  <div>
    <van-field
      v-model="serviceStr"
      clickable
      name="serviceStr"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择')"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="serviceStr"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectRelatedService"
        />
      </template>

      <!--右侧icon-->
      <template #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择服务弹层-->
    <van-popup v-model="popupServiceShow" class="form-component fake-popup" :get-container="getBodyContainer" position="bottom">
      <SelectService ref="ss" :apiParams="requestParams" @cancel="popupServiceShow=false" @confirm="selectService" />
    </van-popup>
  </div>
</template>

<script>
import mixin from '@/views/formComponents/mixin'
import { WorkOrderEntry, AppWorkOrderEntry } from '@/utils/const'
import { isApp } from '@/utils/index'
import SelectService from './SelectService'
import { wfeInstanceServiceList } from '@/api/wfe'

export default {
  name: 'FwSelectService',
  components: { SelectService },
  mixins: [mixin],
  props: {
    entryId: {
      type: [String, Number],
      default: () => isApp() ? AppWorkOrderEntry.repairHome.value : WorkOrderEntry.repairHome.value
    },
    groupId: {
      type: Number,
      default: () => undefined
    },
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      serviceStr: '',
      popupServiceShow: false,
      serviceList: [],
      serviceId: undefined,
      subServiceId: undefined,
      serviceItem: null,
      subServiceItem: null
    }
  },
  computed: {
    requestParams () {
      return {
        entry_id: this.entryId,
        group_id: this.groupId
      }
    }
  },
  methods: {
    // 选择服务弹框
    selectRelatedService () {
      this.popupServiceShow = true
      this.$nextTick(() => {
        this.$refs.ss.show(this.serviceItem, this.subServiceItem, this.sonServiceItem)
      })
    },
    // 选择服务
    selectService (res) {
      this.popupServiceShow = false
      if (!res) { return }
      this.serviceItem = res.item
      this.subServiceItem = res.subItem
      this.sonServiceItem = res.sonItem
      this.serviceStr = `${res.subItem['service_name']} / ${res.sonItem['service_name']}`
      // 这里延迟500ms派发事件，防止弹出框没完全消失前引起的卡顿
      setTimeout(() => {
        this.onUpdate()
      }, 500)
    },

    /**
     * 当从外边带入serviceId和subServiceId的时候需要进行回填操作，这里是回填逻辑
     * @param bizServiceId
     * @param bizSubserviceId
     */
    getAllServiceList (serviceId, subServiceId) {
      wfeInstanceServiceList({}).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.serviceList = (res.data || []).filter(item => item.children && item.children.length)
          this.getService(serviceId, subServiceId)
        } else {
          this.serviceList = []
        }
      })
    },

    getService (serviceId, subServiceId) {
      this.serviceList.map((item, idx) => {
        if (item.service_id === serviceId) {
          this.serviceItem = item
        }
      })
      if (this.serviceItem) {
        this.serviceItem.children.map((item, idx) => {
          if (item.service_id === subServiceId) {
            this.subServiceItem = item
          }
        })
      }
      this.serviceStr = `${this.serviceItem['service_name']} / ${this.subServiceItem['service_name']}`
      this.onUpdate()
    },

    onUpdate () {
      const obj = {
        item: this.serviceItem,
        subItem: this.subServiceItem,
        sonItem: this.sonServiceItem
      }
      this.$emit('confirm', obj)
    }
  }
}
</script>

<style scoped lang="scss">
  .fake-popup {
    height: 100%;
    width: 100%;
    font-family: PingFangSC-Regular, PingFang SC;
    position: fixed;
    left: 0;
    overflow: hidden;
    bottom: 0;
    border-radius: 0 !important;
  }
  .van-field {
    padding: 16px 15px;
  }
</style>
