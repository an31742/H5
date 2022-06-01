<template>
  <div class="fw-container bgmain room">
    <van-sticky v-if="loading" z-index="999">
      <van-tabs v-model="active" color="#E1AA6C">
        <van-tab title="基础信息"> </van-tab>
        <van-tab title="入住人员"> </van-tab>
      </van-tabs>

    </van-sticky>
    <div v-if="active === 0" class="room-main">
      <div class="room-content">
        <div class="room-info">
          <p class="room-info-name">{{ roomName }}</p>
          <!-- 房屋面积信息 - 宫格展示 -->
          <div class="room-info-grid">
            <div class="room-info-grid-item">
              <p class="room-info-grid-main">
                <span class="room-info-grid-num">{{
                  baseInfo.area_construction
                }}</span>
                <span class="room-info-grid-unit">m²</span>
              </p>
              <p class="room-info-grid-desc">建筑面积</p>
            </div>
            <div class="room-info-grid-item">
              <p class="room-info-grid-main">
                <span class="room-info-grid-num">{{
                  baseInfo.area_inner
                }}</span>
                <span class="room-info-grid-unit">m²</span>
              </p>
              <p class="room-info-grid-desc">套内面积</p>
            </div>
            <div class="room-info-grid-item">
              <p class="room-info-grid-main">
                <span class="room-info-grid-num">{{
                  baseInfo.sold_area
                }}</span>
                <span class="room-info-grid-unit">m²</span>
              </p>
              <p class="room-info-grid-desc">销售面积</p>
            </div>
            <div class="room-info-grid-item">
              <p class="room-info-grid-main">
                <span class="room-info-grid-num">{{
                  baseInfo.charge_area
                }}</span>
                <span class="room-info-grid-unit">m²</span>
              </p>
              <p class="room-info-grid-desc">计费面积</p>
            </div>
          </div>
          <!-- 房屋信息 - 列表展示 -->
          <p class="room-info-item room-between">
            <span>
              <span class="room-info-explain">房屋状态：</span>
              <span class="room-info-desc">{{
                getNameByValue(
                  appConfig["ESTATE_ROOM_STATUS"],
                  baseInfo.status,
                  "label"
                ) || "无"
              }}</span>
            </span>
            <span v-if="baseInfo.direct" class="room-info-tag">{{
              baseInfo.direct
            }}</span>
          </p>
          <p class="room-info-item">
            <span class="room-info-explain">房屋业态：</span>
            <span class="room-info-desc">{{
              baseInfo.product_category_name || "无"
            }}</span>
          </p>
          <p v-if="baseInfo.delivery_time" class="room-info-item">
            <span class="room-info-explain">交付日期：</span>
            <span class="room-info-desc">{{
              dayjs(baseInfo.delivery_time).format("YYYY-MM-DD")
            }}</span>
          </p>
          <p v-if="baseInfo.accept_time" class="room-info-item">
            <span class="room-info-explain">入伙日期：</span>
            <span class="room-info-desc">{{
              dayjs(baseInfo.accept_time).format("YYYY-MM-DD")
            }}</span>
          </p>
          <p v-if="baseInfo.first_checkin_time" class="room-info-item">
            <span class="room-info-explain">入住日期：</span>
            <span class="room-info-desc">{{
              dayjs(baseInfo.first_checkin_time).format("YYYY-MM-DD")
            }}</span>
          </p>
          <p v-if="baseInfo.layout_name" class="room-info-item room-between">
            <span>
              <span class="room-info-explain">户型信息：</span>
              <span class="room-info-desc">{{ baseInfo.layout_name }}</span>
            </span>
            <span
              v-if="baseInfo.layout_url"
              class="room-info-view"
              @click="viewPictures"
            >查看户型图</span>
          </p>
          <!-- 户型图 -->
          <div class="room-info-image">
            <img v-if="baseInfo.layout_url" :src="baseInfo.layout_url" />
            <img v-else :src="require('@/assets/image/empty_room_layout.png')" />
          </div>
          <!-- 产权人信息 -->
          <p class="room-info-name room-info-people">
            产权人信息（{{ ownerList.length }}）
          </p>
          <p
            v-for="(item, index) in ownerList"
            :key="index"
            class="room-info-item room-between"
          >
            <span>
              <span class="room-info-desc">{{ item.name }}</span>
              <span v-if="item.mobile" class="room-info-phone">{{
                phoneEncryption(item.mobile)
              }}</span>
            </span>
            <span
              v-if="item.is_master === 1"
              class="room-info-host master"
            >主产权人</span>
          </p>
        </div>
      </div>

    </div>
    <div v-if="active === 1">
      <template v-if="userOwnerList">
        <p class="room-title">家庭成员（{{ userOwnerList.length }}）</p>
        <div class="room-member">
          <p
            v-for="(item, index) in userOwnerList"
            :key="index"
            class="room-member-item"
          >
            <span>
              <span class="room-info-desc">{{ item.name }}</span>
              <span v-if="item.basic_mobile" class="room-info-phone">{{
                phoneEncryption(item.basic_mobile)
              }}</span>
            </span>
            <span
              class="room-info-host master"
            >{{
              item.checkin_role === 1 ? "业主" : item.relationship
            }}</span>
          </p>
        </div>
      </template>
      <template v-if="tenantList">
        <p class="room-title">租户成员（{{ tenantList.length }}）</p>
        <div class="room-member">
          <p
            v-for="(item, index) in tenantList"
            :key="index"
            class="room-member-item"
          >
            <span>
              <span class="room-info-desc">{{ item.name }}</span>
              <span v-if="item.basic_mobile" class="room-info-phone">{{
                phoneEncryption(item.basic_mobile)
              }}</span>
            </span>
            <span
              class="room-info-host host"
            >{{
              item.checkin_role === 3 ? "租户" : item.relationship
            }}</span>
          </p>
        </div>
      </template>
    </div>
    <van-image-preview
      v-model="showPreview"
      :images="previewImages"
    ></van-image-preview>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { gmanagerRoomInfo, gmanagerRoomUser } from '@/api/management'
import { getNameByValue, phoneEncryption } from '@/utils'

export default {
  name: 'ManagementRoomDetail',
  data () {
    return {
      loading: false,
      roomId: '',
      active: 0,
      showPreview: false,
      previewImages: [],
      baseInfo: {},
      ownerList: [],
      userOwnerList: [],
      tenantList: [],
      roomName: '',
      // 方法
      getNameByValue,
      phoneEncryption,
      dayjs
    }
  },
  activated () {
    this.roomId = this.$route.query.id
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.getGmanagerRoomInfo()
      this.getGmanagerRoomUser()
    },
    // 房屋基础信息
    getGmanagerRoomInfo () {
      gmanagerRoomInfo({ id: this.roomId }).then((res) => {
        this.loading = true
        if (res.code === 200) {
          this.baseInfo = res.data.base_info || {}
          this.ownerList = res.data.owner_list || {}
          this.roomName = `${this.baseInfo.belong_building_name}${this.baseInfo.belong_unit_name}${this.baseInfo.name}`
          this.previewImages = [this.baseInfo.layout_url]
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 房屋入住人员
    getGmanagerRoomUser () {
      gmanagerRoomUser({ id: this.roomId }).then((res) => {
        if (res.code === 200) {
          this.userOwnerList = res.data.owner_list
          this.tenantList = res.data.tenant_list
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 查看图片
    viewPictures () {
      this.showPreview = true
    }
  }
}
</script>

<style lang="scss" scoped>
.room {
  min-height: 100vh;
  font-family: PingFangSC-Regular, PingFang SC;

  &-content {
    padding: 8px 10px;
    box-sizing: border-box;
    height: calc(100vh - 44px);
    overflow: scroll;
  }

  &-info {
    padding: 12px 15px;
    background: #fff;
    border-radius: 6px;

    &-name {
      font-size: 16px;
      color: #282828;
      font-weight: 500;
      line-height: 22px;
      font-family: PingFangSC-Medium, PingFang SC;
      margin-bottom: 25px;
    }

    &-grid {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;

      &-main {
        text-align: center;
      }

      &-num {
        font-size: 20px;
        color: #333;
        line-height: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
      }

      &-unit {
        font-size: 10px;
        color: #8c8c8c;
        font-weight: 300;
        font-family: PingFangSC-Light, PingFang SC;
        // transform: scale(0.84, 0.84);
        display: inline-block;
      }

      &-desc {
        font-size: 12px;
        color: #8c8c8c;
        font-weight: 300;
        line-height: 16px;
        margin-top: 2px;
      }
    }

    &-item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    &-explain,
    &-desc,
    &-view,
    &-phone,
    &-host {
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      color: #8c8c8c;
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
      color: #64cca8;
      font-family: PingFangSC-Medium, PingFang SC;
      background: rgba(100, 204, 168, 0.14);
      border-radius: 4px;
    }

    &-view {
      font-size: 14px;
      color: #bc8d58;
      line-height: 20px;
      font-weight: 400;
    }

    &-image {
      width: 100%;
      margin: 4px 0 30px;
    }

    &-people {
      margin-bottom: 20px;
    }

    &-phone {
      color: #999;
      margin-left: 12px;
    }

    &-host {
      color: #64cca8;
    }
  }
  .master{
    background: #E4F2FD;
    color: #058DFD;
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 3px;
  }
  .host{
    background: #DAF2E8;
    color: #0AB069;
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 3px;
  }

  &-between {
    justify-content: space-between;
  }

  &-title {
    font-size: 12px;
    color: #999;
    line-height: 16px;
    padding: 12px 22px 4px;
    box-sizing: border-box;
  }

  &-member {
    background: #fff;

    &-item {
      padding: 18px 22px;
      box-sizing: border-box;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>
