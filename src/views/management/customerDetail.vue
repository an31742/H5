<template>
  <div class="fw-container bgmain customer">
    <div v-if="loading">
      <!-- 客户信息 -->
      <div class="customer-content mg8-b">
        <p class="customer-between mg8-b">
          <span class="customer-name customer-flex">
            {{ baseInfo.name }}
            <span v-if="baseInfo.basic_gender">
              <svg-icon v-if="baseInfo.basic_gender === 1" icon-class="sex-boy" />
              <svg-icon v-else icon-class="sex-girl" />
            </span>
          </span>
          <span v-if="baseInfo.care_level" class="customer-tag" :class="{'customer-vip': baseInfo.care_level === 2}">{{ getNameByValue(appConfig['USER_V2_CARE_LEVEL_LIST'], baseInfo.care_level, 'label') }}客户</span>
        </p>
        <p class="customer-flex">
          <span class="customer-explain">手机号：</span>
          <span class="customer-desc">{{ baseInfo.basic_mobile ? phoneEncryption(baseInfo.basic_mobile) : '无' }}</span>
          <svg-icon v-if="baseInfo.basic_mobile" icon-class="call" style="font-size: 27px;" @click="callPhone(baseInfo.basic_mobile)"/>
        </p>
        <van-divider style="margin-top:12px;margin-bottom:14px;" />
        <p class="mg8-b customer-info">
          <span class="customer-explain">职业:</span>
          <span class="customer-desc">{{ baseInfo.job || '无' }}</span>
        </p>
        <p class="mg8-b customer-info">
          <span class="customer-explain">民族：</span>
          <span class="customer-desc">{{ baseInfo.extra_nation || '无' }}</span>
        </p>
        <!-- 业主有残障 -->
        <template v-if="baseInfo.disabled_level">
          <p class="customer-info mg8-b">
            <span class="customer-explain">是否残障：</span>
            <span class="customer-desc">{{ baseInfo.disabled_level ? '是' : '否' }}</span>
          </p>
          <p class="customer-info mg8-b">
            <span class="customer-explain">残障等级：</span>
            <span class="customer-desc">{{ getNameByValue(appConfig['USER_V2_DISABLED_LEVEL_LIST'], baseInfo.disabled_level, 'label') }}</span>
          </p>
          <p class="customer-info mg8-b">
            <span class="customer-explain">残障分类：</span>
            <span class="customer-desc">{{ getNameByValue(appConfig['USER_V2_DISABLED_CATEGORY_LIST'], baseInfo.disabled_category, 'label') }}</span>
          </p>
        </template>
        <p class="customer-info">
          <span class="customer-explain">籍贯：</span>
          <span class="customer-desc">{{ baseInfo.extra_native_place || '无' }}</span>
        </p>
      </div>
      <!-- 房屋 -->
      <div class="customer-content customer-between mg8-b" @click="onRoomClick">
        <span class="customer-desc">房屋</span>
        <svg-icon icon-class="arrow" style="font-size:13px;"/>
      </div>
      <van-popup v-model="roomShow" position="bottom">
        <van-picker show-toolbar :columns="objArray2StringArray(baseInfo.room_list || [], 'room_name')" @confirm="onRoomConfirm" @cancel="roomShow = false"/>
      </van-popup>
      <!-- 车位 -->
      <div class="customer-content customer-between mg8-b" @click="onParkingClick">
        <span class="customer-desc">车位</span>
        <svg-icon icon-class="arrow" style="font-size:13px;"/>
      </div>
      <van-popup v-model="parkingShow" position="bottom">
        <van-picker show-toolbar :columns="parkingDataHandle(baseInfo.parking_list, 'parking_name')" @confirm="onParkingConfirm" @cancel="parkingShow = false"/>
      </van-popup>
      <!-- 车辆 -->
      <div class="customer-content customer-between mg8-b" @click="onVehicleClick">
        <span class="customer-desc">车辆</span>
        <svg-icon icon-class="arrow" style="font-size:13px;"/>
      </div>
      <van-popup v-model="vehicleShow" position="bottom">
        <van-picker show-toolbar :columns="objArray2StringArray(baseInfo.vehicle_list || [], 'plate_number')" @confirm="onVehicleConfirm" @cancel="vehicleShow = false"/>
      </van-popup>
      <!-- 报事记录 -->
      <!-- <div class="customer-content customer-between mg8-b">
        <span class="customer-desc">报事记录</span>
        <svg-icon icon-class="arrow" style="font-size:13px;"/>
      </div> -->
    </div>
  </div>
</template>

<script>
import { gmanagerUserInfo } from '@/api/management'
import { objArray2StringArray, getNameByValue, callPhone, phoneEncryption } from '@/utils'

export default {
  name: 'ManagementCustomerDetail',
  data () {
    return {
      loading: false,
      uid: '',
      baseInfo: null,
      roomShow: false,
      parkingShow: false,
      vehicleShow: false,
      // 公共方法
      objArray2StringArray,
      getNameByValue,
      callPhone,
      phoneEncryption
    }
  },
  activated () {
    this.uid = this.$route.query.id
    this.init()
  },
  methods: {
    // 初始化
    init () {
      gmanagerUserInfo({ id: this.uid }).then(res => {
        console.log(res, 'res')
        this.loading = true
        if (res.code === 200) {
          this.baseInfo = res.data
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 车位选择器数据处理
    parkingDataHandle (list = []) {
      console.log(list)
      return (list || []).map(item => `${item.parking_name || ''}${item.parking_area_name || ''}${item.name}`)
    },
    // 房屋 点击 - 跳转 / 显示选择器
    onRoomClick () {
      const list = this.baseInfo.room_list || []
      if (list.length > 1) {
        this.roomShow = true
      } else if (list.length === 1) {
        this.$router.push({
          name: 'ManagementRoomDetail',
          query: {
            id: list[0].room_id
          }
        })
      } else {
        this.$toast('客户名下暂无房屋哦～')
      }
    },
    // 房屋 选择器 确认
    onRoomConfirm (val, ind) {
      console.log(val)
      this.roomShow = false
      this.$router.push({
        name: 'ManagementRoomDetail',
        query: {
          id: this.baseInfo.room_list[ind].room_id
        }
      })
    },
    // 车位 点击 - 跳转 / 显示选择器
    onParkingClick () {
      const list = this.baseInfo.parking_list || []
      if (list.length > 1) {
        this.parkingShow = true
      } else if (list.length === 1) {
        this.$router.push({
          name: 'ManagementParkingDetail',
          query: {
            id: list[0].id
          }
        })
      } else {
        this.$toast('客户名下暂无车位哦～')
      }
    },
    // 车位 选择器 确认
    onParkingConfirm (val, ind) {
      console.log(val)
      this.parkingShow = false
      this.$router.push({
        name: 'ManagementParkingDetail',
        query: {
          id: this.baseInfo.parking_list[ind].id
        }
      })
    },
    // 车辆 点击 - 跳转 / 显示选择器
    onVehicleClick () {
      const list = this.baseInfo.vehicle_list || []
      if (list.length > 1) {
        this.vehicleShow = true
      } else if (list.length === 1) {
        this.$router.push({
          name: 'ManagementVehicleDetail',
          query: {
            id: list[0].id
          }
        })
      } else {
        this.$toast('客户名下暂无车辆哦～')
      }
    },
    // 车辆 选择器 确认
    onVehicleConfirm (val, ind) {
      console.log(val)
      this.vehicleShow = false
      this.$router.push({
        name: 'ManagementVehicleDetail',
        query: {
          id: this.baseInfo.vehicle_list[ind].id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .customer {
    min-height: 100vh;
    padding: 8px 10px;
    box-sizing: border-box;
    font-family: PingFangSC-Regular, PingFang SC;

    &-content {
      background: #fff;
      border-radius: 6px;
      padding: 15px 18px;
      box-sizing: border-box;
    }

    &-flex, &-info {
      display: flex;
      align-items: center;
    }

    &-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-name, &-tag {
      font-family: PingFangSC-Medium, PingFang SC;
    }

    &-name {
      font-size: 16px;
      color: #333;
      font-weight: 500;
      line-height: 22px;
    }

    &-tag {
      font-size: 12px;
      line-height: 16px;
      color: #fff;
      font-weight: 500;
      background: #64CCA8;
      border-radius: 4px;
      padding: 2px 5px;
    }

    &-vip {
      background: #FFAB2D;
    }

    &-explain, &-desc {
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      color: #8C8C8C;
    }

    &-desc {
      color: #333;
    }

    &-info {
      .customer-explain {
        min-width: 43px;
        display: block;
      }
    }
  }

  .svg-icon {
    font-size: 16px;
    margin-left: 10px;
  }

  .mg8-b {
    margin-bottom: 8px;
  }
</style>
