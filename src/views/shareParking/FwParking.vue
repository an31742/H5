<template>
  <div>
    <van-field
      v-model="model[opt.code]"
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
      <template v-if="!formReadonly(opt)" #right-icon @click="selectRelatedParking">
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择车位弹层-->
    <van-popup v-model="popupParkingShow" class="form-component" :get-container="getBodyContainer" position="bottom">
      <van-picker
        show-toolbar
        :loading="loading"
        :columns="objArray2StringArray(parkingList, 'label')"
        @cancel="popupParkingShow=false"
        @confirm="(value, index) => { selectParking(value, index) }"
      >
      </van-picker>
    </van-popup>
    <van-popup v-model="popupParkingShow1" class="form-component" :get-container="getBodyContainer" position="bottom">
      <van-picker
        show-toolbar
        :loading="loading"
        :columns="objArray2StringArray(parkingChildren, 'name')"
        @cancel="popupParkingShow1=false"
        @confirm="(value, index) => { selectParking1(value, index) }"
      >
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
import mixin from '../formComponents/mixin'
import { getLocationTree, getLocationTreeList } from '@/api/shareparking'
import { getGroupId, setGroupId } from '@/utils/auth'
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
    },
    groupid: {
      type: Number,
      default: () => null
    }
  },
  data () {
    return {
      parkingList: [],
      parkingList1: [],
      parkingList2: [],
      parkingChildren: [],
      location: 'location',
      selPark: null,
      parkingName: '',
      loading: false,
      hasRequested: false,
      popupParkingShow: false,
      popupParkingShow1: false,
      objArray2StringArray,
      curGid: ''
    }
  },
  mounted () {
    this.curGid = getGroupId()
    setGroupId(this.groupid)
    this.getParkingList(2)
    this.getParkingList(3)
  },
  beforeRouteLeave (to, from, next) {
    setGroupId(this.curGid)
    next()// 一定不要忘记写
  },
  methods: {
    // 车位列表
    getParkingList (value) {
      this.loading = true
      const params = {
        category: value
      }
      getLocationTree(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          if (value === 2) {
            this.parkingList1 = res.data
          }
          if (value === 3) {
            this.parkingList2 = res.data
          }
          this.parkingList = [...this.parkingList1, ...this.parkingList2]
        } else {
          this.$toast(res.msg)
        }
      })
    },
    getLocationChildren (data) {
      this.loading = true
      const that = this
      const params = {
        category: data.category,
        parent_level: data.level,
        parent_id: data.id
      }
      getLocationTreeList(params).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.parkingChildren = res.data.list
          if (that.parkingChildren && that.parkingChildren.length) {
            that.popupParkingShow = false
            that.popupParkingShow1 = true
          } else {
            this.location = data.label
            this.parkingName = this.location
            this.$set(this.model, this.opt.code, this.parkingName)
          }
        } else {
          that.$toast(res.msg)
        }
      })
    },
    getChildren (data) {
      this.parkingChildren = data
      this.popupParkingShow1 = true
    },
    // 选择车位弹框
    selectRelatedParking () {
      this.popupParkingShow = true
      this.getParkingList()
    },
    // 选择车位
    selectParking (location, index) {
      const parking = this.parkingList[index]
      this.location = location
      console.log(parking)
      this.getLocationChildren(parking)
    },
    selectParking1 (location, index) {
      this.location = this.location + '/' + location
      this.parkingName = this.location
      this.$set(this.model, this.opt.code, this.parkingName)
      this.popupParkingShow1 = false
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .van-cell {
    padding-left: 28px;
    &::before{
      left: 19px;
    }
  }
}

</style>
