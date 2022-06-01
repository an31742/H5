<template>
  <div class="fw-container bgmain vehicle">
    <div v-if="loading" class="vehicle-content">
      <p class="vehicle-name">{{ vehicleData.plate_number }}</p>
      <p class="vehicle-info">
        <span class="vehicle-explain">车主姓名：</span>
        <span class="vehicle-desc">
          <span class="parking-desc" style="color:#BC8D58" @click="$router.push(`/management/detail/customer?id=${vehicleData.user_id}`)">{{ vehicleData.owner_name }}</span>
          {{ phoneEncryption(vehicleData.owner_mobile) }}</span>
        <svg-icon icon-class="call" @click="callPhone(vehicleData.owner_mobile)" />
      </p>
      <p class="vehicle-info">
        <span class="vehicle-explain">车位：</span>
        <span class="vehicle-desc">{{ parkingName }}</span>
      </p>
      <p class="vehicle-info">
        <span class="vehicle-explain">型号：</span>
        <span class="vehicle-desc">{{ vehicleData.model_number }}</span>
      </p>
      <p class="vehicle-info">
        <span class="vehicle-explain">品牌：</span>
        <span class="vehicle-desc">{{ vehicleData.brand }}</span>
      </p>
      <p class="vehicle-info">
        <span class="vehicle-explain">颜色：</span>
        <span class="vehicle-desc">{{ vehicleData.color }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { gmanagerCarInfo } from '@/api/management'
import { callPhone, phoneEncryption } from '@/utils'

export default {
  name: 'ManagementVehicleDetail',
  data () {
    return {
      loading: false,
      carId: '',
      vehicleData: null,
      parkingName: '',
      // 公共方法
      callPhone,
      phoneEncryption
    }
  },
  activated () {
    this.carId = this.$route.query.id
    this.init()
  },
  methods: {
    // 初始化
    init () {
      gmanagerCarInfo({ id: this.carId }).then(res => {
        this.loading = true
        if (res.code === 200) {
          this.vehicleData = res.data
          this.parkingName = `${res.data.parking_area_name}${res.data.parking_name}${res.data.parking}`
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.vehicle {
  min-height: 100vh;
  padding: 8px 10px;
  box-sizing: border-box;
  font-family: PingFangSC-Regular, PingFang SC;

  &-content {
    background: #fff;
    border-radius: 6px;
    padding: 15px;
    box-sizing: border-box;
  }

  &-name {
    font-size: 16px;
    color: #282828;
    line-height: 22px;
    font-weight: 500;
    font-family: PingFangSC-Medium, PingFang SC;
    margin-bottom: 25px;
  }

  &-info {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    &:first-child {
      margin-bottom: 13px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &-explain, &-desc {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: #8C8C8C;
    display: inline-block;
  }

  &-explain {
    min-width: 75px;
  }

  &-desc {
    color: #282828;
  }
}

.svg-icon {
  font-size: 27px;
  margin-left: 10px;
}
</style>
