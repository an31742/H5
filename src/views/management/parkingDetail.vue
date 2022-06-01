<template>
  <div class="fw-container bgmain parking">
    <div v-if="loading" class="parking-content">
      <p class="parking-name">{{ parkingName }}</p>
      <p class="parking-info parking-between">
        <span>
          <span class="parking-explain">车位面积：</span>
          <span class="parking-desc">{{ parkingData.area }}平米</span>
        </span>
        <span class="parking-tag">{{ getNameByValue(appConfig['PARKING_SPACE_STATUS_LIST'], parkingData.status, 'label') }}</span>
      </p>
      <p class="parking-info">
        <span class="parking-explain">车位类型：</span>
        <span class="parking-desc">{{ getNameByValue(appConfig['PARKING_SPACE_TYPE_LIST'], parkingData.type, 'label') }}</span>
      </p>
      <p v-if="parkingData.tenantry_user_type" class="parking-info">
        <span class="parking-explain">租赁人：</span>
        <span class="parking-desc">{{ getNameByValue(userTypeList, parkingData.tenantry_user_type, 'label') }}</span>
      </p>
      <p v-if="parkingData.owner_user_name" class="parking-info">
        <span class="parking-explain">产权人：</span>
        <span v-if="parkingData.owner_user_id" class="parking-desc" style="color:#BC8D58" @click="$router.push(`/management/detail/customer?id=${parkingData.owner_user_id}`)">{{ parkingData.owner_user_name }}</span>
        <span v-else class="parking-desc" >{{ parkingData.owner_user_name }}</span>
        <span v-if="parkingData.owner_user_contact">
          <span class="phone">{{ phoneEncryption(parkingData.owner_user_contact) }}</span>
          <svg-icon icon-class="call" @click="callPhone(parkingData.owner_user_contact)" />
        </span>
      </p>
      <p v-if="parkingData.tenantry_user_name" class="parking-info">
        <span class="parking-explain">承租人：</span>
        <span v-if="!parkingData.tenantry_user_id" class="parking-desc">{{ parkingData.tenantry_user_name }} {{ phoneEncryption(parkingData.tenantry_user_contact) }}</span>
        <span v-else class="parking-desc" style="color:#BC8D58" @click="$router.push(`/management/detail/customer?id=${parkingData.tenantry_user_id}`)">{{ parkingData.tenantry_user_name }}</span>
        <span v-if="parkingData.tenantry_user_contact">
          <span class="phone">{{ phoneEncryption(parkingData.tenantry_user_contact) }}</span>
          <svg-icon icon-class="call" @click="callPhone(parkingData.tenantry_user_contact)" />
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { gmanagerParkingInfo } from '@/api/management'
import { getNameByValue, callPhone, phoneEncryption } from '@/utils'

export default {
  name: 'ManagementParkingDetail',
  data () {
    return {
      loading: false,
      parkingId: '',
      parkingName: '',
      parkingData: null,
      userTypeList: [
        {
          value: 1,
          label: '住户'
        },
        {
          value: 2,
          label: '外部人员'
        },
        {
          value: 3,
          label: '无'
        }
      ],
      // 公共方法
      callPhone,
      phoneEncryption,
      getNameByValue
    }
  },
  activated () {
    this.parkingId = this.$route.query.id
    this.init()
  },
  methods: {
    // 初始化
    init () {
      gmanagerParkingInfo({ id: this.parkingId }).then(res => {
        this.loading = true
        if (res.code === 200) {
          this.parkingData = res.data
          this.parkingName = `${res.data.parking_area_name}-${res.data.parking_name}${res.data.name}`
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .parking {
   min-height: 100vh;
   padding: 8px 10px;
   box-sizing: border-box;
   font-family: PingFangSC-Regular, PingFang SC;

   &-content {
     background: #fff;
     border-radius: 6px;
     padding: 12px 15px;
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

     &:last-child {
       margin-bottom: 0;
     }
   }

   &-between {
     justify-content: space-between;
   }

   &-explain, &-desc {
     font-size: 14px;
     line-height: 20px;
     font-weight: 400;
     color: #8C8C8C;
   }

   &-explain {
     min-width: 75px;
   }

   &-desc {
     color: #282828;
   }

   &-tag {
     padding: 2px 6px;
     font-size: 12px;
     font-weight: 500px;
     line-height: 16px;
     color: #64CCA8;
     font-family: PingFangSC-Medium, PingFang SC;
     background: rgba(100, 204, 168, 0.14);
     border-radius: 4px;
   }
 }

 .svg-icon {
   font-size: 27px;
   margin-left: 10px;
 }
 .phone{
  vertical-align: text-bottom;
  margin-left: 12px;
  display: inline-block;
 }
</style>
