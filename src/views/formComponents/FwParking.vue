<template>
  <div>
    <van-field
      v-model="selPark"
      clickable
      name="selPark"
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
          v-model="parkingName"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectRelatedParking"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择车位弹层-->
    <van-popup v-model="popupParkingShow" class="form-component" :get-container="getBodyContainer" position="bottom">
      <van-picker
        show-toolbar
        :loading="loading"
        :columns="objArray2StringArray(parkingList, 'name')"
        @cancel="popupParkingShow=false"
        @confirm="(value, index) => { selectParking(value, index) }"
      >
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import { wfeWidgetParkingList } from './api'
import { objArray2StringArray } from 'utils/index'

export default {
  name: 'FwParking',
  mixins: [mixin],
  props: {
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
      parkingList: [],
      selPark: null,
      parkingName: '',
      loading: false,
      hasRequested: false,
      popupParkingShow: false,
      objArray2StringArray
    }
  },
  mounted () {
    // this.getParkingList()
  },
  methods: {
    // 车位列表
    getParkingList () {
      this.loading = true
      const params = {
        page: 1,
        page_size: 500
      }
      if (this.opt.user_id) {
        params['user_id'] = this.opt.user_id
      }

      wfeWidgetParkingList(params).then(res => {
        this.loading = false
        this.hasRequested = true
        if (res.code === 200) {
          this.parkingList = res.data || []
          return
        }
        this.$toast(res.msg || '获取车位信息失败')
      })
    },
    // 选择车位弹框
    selectRelatedParking () {
      this.popupParkingShow = true
      if (!this.hasRequested) {
        this.getParkingList()
      }
    },
    // 选择车位
    selectParking (location, index) {
      const parking = this.parkingList[index]
      this.popupParkingShow = false

      this.selPark = parking['id'] || ''
      this.parkingName = parking['name'] || ''

      this.$set(this.model, this.opt.code, +parking['id'])
      this.$set(this.model, this.opt.code + '_desc', this.parkingName)
    }
  }
}
</script>
