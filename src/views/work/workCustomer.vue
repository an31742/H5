<template>
  <div class="searchCustomer h100">
    <van-tabs v-model="active" class="work-tabs cuntomer-work-tabs" :border="false" color="#E1AA6C">
      <!-- 详情 -->
      <van-tab title="选择客户" class="">
        <template v-if="!selectedUser">
          <!-- 查找客户 -->
          <div v-if="!suggestList || !suggestList.length" class="work-customer">
            <div class="work-customer-content">
              <van-form>
                <van-field
                  v-model="searchValue"
                  class="work-customer-field"
                  placeholder="输入姓名/电话查找客户"
                ></van-field>
                <van-field
                  v-model="selectedRoomName"
                  readonly
                  clickable
                  name="picker"
                  class="work-customer-field"
                  placeholder="按照房屋查找"
                  @click="showRoomPicker = true"
                >
                  <template #right-icon><span class="work-customer-arrow"></span></template>
                </van-field>
              </van-form>
            </div>
            <div class="work-customer-button fixed-bottom">
              <van-button
                round
                block
                type="info"
                native-type="submit"
                color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
                @click="getSuggestList"
              >
                查找
              </van-button>
            </div>
            <van-popup v-model="showRoomPicker" round position="bottom">
              <van-picker show-toolbar value-key="name" :columns="estateList" @cancel="showRoomPicker=false" @confirm="selectRoom" />
            </van-popup>
          </div>

          <!-- 客户列表 -->
          <div v-else class="work-list-main">
            <div class="work-list">
              <div v-for="(item, index) in suggestList" :key="index" class="work-list-item" @click="selectedUser=item">
                <!--头像-->
                <van-image fit="cover" round class="work-list-icon" :src="item.avatar || require('@/assets/ui-prettify/user_default.png')"></van-image>
                <!--基础信息-->
                <div class="work-list-info">
                  <!--姓名电话-->
                  <p class="work-list-info-name">{{ item.user_name }} {{ item.user_mobile }}</p>
                  <!--房屋-->
                  <p class="work-list-info-room">{{ item.room_name }}</p>
                  <div v-if="getCareLevel(item) || getDisabledLevel(item) || getDisableCategory(item)" class="work-list-info-tags">
                    <!--客户等级-->
                    <span v-if="getCareLevel(item)" class="work-list-info-tag">{{ getCareLevel(item) }}</span>
                    <!--是否残障-->
                    <span v-if="getDisabledLevel(item) || getDisableCategory(item)" class="work-list-info-disability">
                      {{ getDisabledLevel(item) }}
                      <span>/</span>
                      {{ getDisableCategory(item) }}
                    </span>
                    <!--家属残障-->
                    <span v-if="item.disabled_member && item.disabled_member.length" class="work-list-info-disability">家属残障</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!--表单-->
        <template v-else>
          <launch
            :entryId="entryId"
            :source="2"
            :roomId.sync="selectedUser.room_id"
            :launcherName.sync="selectedUser.user_name + '' + selectedUser.user_mobile"
            :launcher.sync="'C#' + selectedUser.user_id"
            @submit="$router.back()"
            @selectUser="reSelectUser"
          ></launch>
        </template>
      </van-tab>

      <!-- 进度 -->
      <van-tab title="临客代报">
        <GuestAgent
          :entryId="entryId"
          :source="2"
        />
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import { wfeUseSuggestList, wfeEstateTree } from '@/api/wfe'
import { getItemByValue } from '@/utils/index'
import { WorkOrderEntry, AppWorkOrderEntry } from '@/utils/const'
import launch from '@/views/work/launch'
import GuestAgent from '@/views/work/guestAgent'
import { isApp } from '@/utils/index'

export default {
  name: 'SearchWorkCustomer',
  components: { launch, GuestAgent },
  data () {
    return {
      entryId: isApp() ? AppWorkOrderEntry.takePlace.value : WorkOrderEntry.takePlace.value,

      searchValue: '',
      searchRoomId: '',
      selectedRoomName: '',

      suggestList: [],
      estateList: [],

      showRoomPicker: false,

      selectedUser: '', // 选择的客户
      active: 0
    }
  },
  watch: {
    selectedUser (val) {
      this.changeTitle(val ? '代客录单' : '选择客户')
    }
  },
  created () {
    this.getEstateTree()
  },
  methods: {
    // 重要等级
    getCareLevel (item) {
      const level = item.care_level

      return level ? getItemByValue(this.appConfig.USER_V2_CARE_LEVEL_LIST, level) : ''
    },

    // 残障等级
    getDisabledLevel (item) {
      const level = item.disabled_level

      return level ? getItemByValue(this.appConfig.USER_V2_DISABLED_LEVEL_LIST, level) : ''
    },

    // 残障部位
    getDisableCategory (item) {
      const level = item.disabled_category

      return level ? getItemByValue(this.appConfig.USER_V2_DISABLED_CATEGORY_LIST, level) : ''
    },

    // 获取房屋树
    getEstateTree () {
      wfeEstateTree().then(res => {
        if (res.code === 200) {
          this.estateList = this.filterEstate(res.data || [])
          return
        }
        this.$toast(res.msg || '房屋查询失败')
      })
    },

    // 筛选没有房屋的单元
    filterEstate (list) {
      return list.filter(item => {
        if (!item.children || !item.children.length) {
          return false
        }

        item.children = item.children.filter(child => {
          return (child.children && child.children.length)
        })

        return item.children && item.children.length
      })
    },

    // 选择房屋
    selectRoom (names, index) {
      this.showRoomPicker = false
      const build = this.estateList[index[0]]
      const unit = build && build.children[index[1]]
      const room = unit && unit.children[index[2]]

      if (build && unit && room) {
        this.searchRoomId = room.id
        this.selectedRoomName = `${build.name}${unit.name}${room.name}`
      }
    },

    // 获取客户列表
    getSuggestList () {
      wfeUseSuggestList({
        room_id: this.searchRoomId,
        key: this.searchValue
      }).then(res => {
        if (res.code === 200) {
          this.suggestList = res.data || []
          if (!this.suggestList.length) {
            this.$toast('没有查询到客户')
          }
          return
        }
        this.$toast(res.msg || '客户查询失败')
      })
    },

    // 重新选择客户
    reSelectUser () {
      this.selectedUser = ''
      this.suggestList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.cuntomer-work-tabs{
  ::v-deep .van-tab{
    border-bottom: none;
  }
}
  .work {
    font-family: PingFangSC-Regular, PingFang SC;

    &-customer {
      width: 100vw;
      height: 100vh;
      background: url('~@/assets/image/customers-bg.png') no-repeat;
      background-size: cover;
      background-color: #f6f8fa;
      background-position: bottom;
      background-position-y: 10px;

      &-content {
        padding: 30px 35px 0;
        box-sizing: border-box;
      }

      &-field {
        width: 100%;
        border-radius: 20px;
        padding: 10px 20px;
        background: rgba(0, 0, 0, 0.04);
        margin-bottom: 16px;
      }

      &-arrow {
        width: 0;
        height: 0;
        display: block;
        border: 4px solid transparent;
        border-top-color: #999;
        margin-top: 4px;
      }

      &-button {
        padding: 16px 34px;
        button {
          font-size: 18px;
        }
      }
    }

    &-list {
      &-main {
        min-height: 100vh;
        background: #F6F8FA;
        padding-top: 12px;
        box-sizing: border-box;
      }

      &-item {
        padding: 12px 21px;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }

      &-icon {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        margin-right: 21px;
        border: 1px solid #f5f5f5;
        box-sizing: border-box;
      }

      &-info {
        &-name, &-room {
          font-size: 14px;
          color: #333;
          line-height: 20px;
        }

        &-name {
          font-size: 15px;
          margin-bottom: 8px;
          font-weight: 400;
        }

        &-room {
          color: #999;
        }

        &-tags {
          display: flex;
          align-items: center;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        &-tag, &-disability {
          font-size: 12px;
          padding: 2px 6px;
          font-weight: 500;
          line-height: 16px;
          color: #FFAB2D;
          background: rgba(255, 171, 45, 0.15);
          border-radius: 4px;
          margin-right: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
        }

        &-disability {
          color: #BC8D58;
          min-width: 74px;
          text-align: center;
          background: rgba(225, 170, 108, 0.15);
          margin-bottom: 2px;
        }
      }
    }
  }
</style>
