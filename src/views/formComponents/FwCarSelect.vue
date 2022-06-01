<template>
  <div>
    <van-field
      v-model="selCar"
      clickable
      name="selCar"
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
          v-model="carName"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectRelatedCar"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择车辆弹层-->
    <van-popup v-model="popupCarShow" class="form-component" :get-container="getBodyContainer" position="bottom">
      <van-picker
        show-toolbar
        :loading="loading"
        :columns="objArray2StringArray(carList, 'name')"
        @cancel="popupCarShow=false"
        @confirm="(value, index) => { selectCar(value, index) }"
      >
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import { wfeWidgetVehicleList } from './api'
import { objArray2StringArray } from 'utils/index'

export default {
  name: 'FwCarSelect',
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
      carList: [],
      selCar: null,
      carName: '',
      loading: false,
      hasRequested: false,
      popupCarShow: false,
      objArray2StringArray
    }
  },
  mounted () {
    // this.getCarList()
  },
  methods: {
    // 车辆列表
    getCarList () {
      this.loading = true
      const params = {
        page: 1,
        page_size: 500
      }
      if (this.opt.user_id) {
        params['user_id'] = this.opt.user_id
      }

      wfeWidgetVehicleList(params).then(res => {
        this.loading = false
        this.hasRequested = true
        if (res.code === 200) {
          this.carList = (res.data || []).map(item => {
            item.name = item.brand || item['plate_number'] || ''
            return item
          })
          return
        }
        this.$toast(res.msg || '获取车辆信息失败')
      })
    },
    // 选择车辆弹框
    selectRelatedCar () {
      this.popupCarShow = true
      if (!this.hasRequested) {
        this.getCarList()
      }
    },
    // 选择车辆
    selectCar (location, index) {
      const car = this.carList[index]
      this.popupCarShow = false

      this.carName = car.name
      this.selCar = car.vehicle_id

      this.$set(this.model, this.opt.code, +car['vehicle_id'])
      this.$set(this.model, this.opt.code + '_desc', this.carName)
    }
  }
}
</script>
