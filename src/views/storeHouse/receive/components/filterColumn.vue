<template>
  <div class="filter workSearch">
    <div class="filter-screen">
      <p
        v-for="(item, index) in screenList"
        :key="index"
        class="filter-screen-item"
        :class="{'filter-screen-light': (active === item.name || item.actived)}"
        :name="item.name"
        @click="screenTabsClick(item.name)"
      >
        {{ item.label }}<span class="filter-screen-arrow"></span>
      </p>
    </div>
    <!-- 审批状态 -->
    <template v-if="active === 'status' && workStatusShow">
      <van-overlay :show="true" class="filter-overlay" @click="overlayClose('status')">
        <template #default>
          <div class="filter-status" @click.stop>
            <van-button
              v-for="(item, index) in workStatusRecord"
              :key="index"
              class="choice-button white"
              native-type="button"
              :class="item.actived ? 'active' : ''"
              size="small"
              @click="selectStatus(item, index)"
            >
              {{ item.label }}
              <svg-icon
                v-if="item.actived"
                class="corner"
                icon-class="corner"
              />
            </van-button>
          </div>
          <div class="filter-bottom" @click.stop>
            <van-button
              round
              size="large"
              type="primary"
              color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
              style="height: 40px;"
              @click="statusConfirm"
            >确定</van-button>
          </div>
        </template>
      </van-overlay>
    </template>
    <!-- 申请日期 -->
    <template v-if="active === 'date' && workCalendarShow">
      <div class="top-calendar">
        <van-calendar
          ref="calendar"
          v-model="workCalendarShow"
          type="range"
          position="top"
          range-prompt="最多可选一年"
          class="scrollCalendar"
          :max-range="366"
          :min-date="minDate"
          :max-date="maxDate"
          :default-date="defaultDate"
          :show-title="false"
          :allow-same-day="true"
          :show-mark="false"
          row-height="46"
          @confirm="onCalendarConfirm"
        >
          <template #footer>
            <div class="filter-bottom" @click.stop>
              <van-button
                round
                size="large"
                type="primary"
                color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
                style="height: 40px;"
                @click="calendarConfirm"
              >确定</van-button>
            </div>
          </template>
        </van-calendar>
      </div>
    </template>
    <!-- 物资选择 -->
    <template v-if="active === 'assets' && assetsShow">
      <van-popup v-model="assetsShow" position="bottom" :style="{ height: '80%' }" >
        <SearchList
          :searchId="searchId"
          ref="sl"
          emptyText="没有搜索到物资"
          placeholder="输入物资名称查找物资"
          :apiParams="apiParams"
          :api="assetsList"
          @cancel="cancelAssets"
        >
          <template #item="{ item }">
            <div @click="selectAssets(item)" style="width: 100%">
              <span class="user-name">
                {{ item.name }} {{ item.mobile }}
              </span>
              <span class="item-extra">
                {{ (item.role_list&& item.role_list.length&& item.role_list[0].name) || '' }}
              </span>
            </div>
          </template>
        </SearchList>
      </van-popup>
    </template>
    <!-- 仓库名称 -->
    <template v-if="active === 'template' && workTemplateShow">
      <van-popup v-model="workTemplateShow" position="bottom" :style="{ height: '50%' }" >
        <van-picker
          :columns="objArray2StringArray(storeHouseList, 'WarehouseName')"
          :show-toolbar="true"
          @confirm="onHouseConfirm"
          @cancel="onHouseCancel"
          :default-index="defaultHouse"
          cancel-button-text="重置"
        >
          <template #title>
            <span>选择仓库</span>
          </template>
        </van-picker>
      </van-popup>
    </template>
  </div>
</template>

<script>
import { deepClone, objArray2StringArray } from 'utils/index'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { RECEIVE_STATUS } from './const'
import { wareHouseList } from '@/api/storeHouse'
import SearchList from '@/views/storeHouse/receive/components/searchAssetsList'
import { assetsList } from '@/api/storeHouse.js'

export default {
  name: 'FilterColumn',
  components: {
    SearchList
  },
  props: {
    pendingApprove: {
      type: Boolean,
      default: true
    },
    screenList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      // 筛选项
      active: null,
      // 状态
      workStatusShow: false,
      workStatus: RECEIVE_STATUS,
      workStatusRecord: [],
      // 模板
      workTemplateShow: false,
      assetsShow: false,
      tempActived: {
        ind: 0
        // childInd: 0
      },
      tempActivedRecord: null,
      storeHouseList: [],
      // 日期
      workCalendarShow: false,
      minDate: new Date(dayjs(new Date()).add(-1, 'year')),
      maxDate: new Date(),
      defaultDate: [new Date(dayjs(new Date()).add(-2, 'day')), new Date()],
      // 筛选项选择
      filterParams: {
        assets_version_id: undefined, // 物资名称
        apply_start_time: '', // 申请开始时间，如果没有时间筛选条件，这个条件的key不要提交
        apply_end_time: '', // 申请结束时间
        status: 0, // 1 审核中 2 拒绝 3 撤回 4 待出库 5 完成
        apply_user_id: 0, // 申请人员工id
        warehouse_id: undefined, // 仓库id
        is_self_create: 1 // 当为1则是 我的申请
      },
      assetsList,
      apiParams: {},
      searchId: '',
      defaultHouse: ''
    }
  },
  computed: {
    ...mapGetters([
      'userPermissions'
    ])
  },
  created () {
    this.init()
  },
  methods: {
    objArray2StringArray,
    cancelAssets () {
      this.assetsShow = false
      this.searchId = ''
      this.filterParams.assets_version_id = ''
      this.screenLight(false)
      this.$emit('screenSelect', this.filterParams)
    },
    selectAssets (res) {
      console.log(res)
      this.filterParams.assets_version_id = res.assets_version_id
      this.searchId = res.id
      this.assetsShow = false
      this.$emit('screenSelect', this.filterParams)
    },
    onHouseCancel () {
      console.log('quxiao')
      this.filterParams.warehouse_id = undefined
      this.workTemplateShow = false
      this.defaultHouse = 0
      this.screenLight(false)
      this.$emit('screenSelect', this.filterParams)
    },
    onHouseConfirm (value, index) {
      this.filterParams.warehouse_id = this.storeHouseList[index].WarehouseId
      this.defaultHouse = index
      this.workTemplateShow = false
      this.screenLight(true)
      this.$emit('screenSelect', this.filterParams)
    },
    // 数据初始化
    init () {
      this.workStatus.forEach(item => { item.actived = false })
      this.workStatus = [{ label: '全部', actived: true }, ...this.workStatus]
      this.workStatusRecord = deepClone(this.workStatus)
      this.tempActivedRecord = deepClone(this.tempActived)
      this.getTemplateGroupList()
    },
    // 筛选项 - 点击
    screenTabsClick (name, ind) {
      this.active = name
      switch (name) {
        case 'status':
          this.workStatusShow = true
          break
        case 'template':
          this.workTemplateShow = true
          break
        case 'assets':
          this.assetsShow = true

          this.$nextTick(() => {
            this.$refs.sl.show()
          })
          break
        case 'date':
          this.workCalendarShow = true
          // 起因：当maxDate设置为当天，最小日期跨度超过3个月时，需要滑动下屏幕才能展示内容
          // 我也不知道tmd日历组件需要上下滑动下屏幕才会展示日期，啥破组件...
          // 为啥这样能解决问题？别问，问就是奇技淫巧...
          setTimeout(() => {
            const el = document.querySelector('.scrollCalendar .van-calendar__body')
            el.scrollBy(0, -1)
          }, 10)
          break
      }
    },

    // 选择状态
    selectStatus (val, ind) {
      this.workStatusRecord.map(item => {
        item.actived = false
      })
      this.workStatusRecord[ind].actived = true
      this.filterParams.status = val.value
    },

    // 状态选择确认
    statusConfirm () {
      const selectedArr = this.workStatusRecord.filter(item => item.actived === true)
      const selectedVal = selectedArr.map(item => item.value)
      this.filterParams.status = Number(selectedVal.join(','))
      this.workStatus = deepClone(this.workStatusRecord)
      this.workStatusShow = false
      this.screenLight(selectedVal[0] !== undefined)
      this.$emit('screenSelect', this.filterParams)
    },

    // 申请日期
    onCalendarConfirm (date) {
      const [start, end] = date
      this.filterParams.apply_start_time = this.formatStartTime(start)
      if (date[1]) {
        this.filterParams.apply_end_time = this.formatEndTime(end)
      } else {
        this.filterParams.apply_end_time = this.formatEndTime(start)
      }
      this.defaultDate = date
      this.$emit('screenSelect', this.filterParams)
      this.screenLight(true)
      this.workCalendarShow = false
    },

    calendarConfirm () {
      this.$refs.calendar.onConfirm()
    },

    // 筛选项高亮
    screenLight (val) {
      const ind = this.screenList.findIndex(item => item.name === this.active)
      this.screenList[ind].actived = val
      if (!val) {
        this.active = null
      }
    },

    // 弹框关闭
    overlayClose (name) {
      switch (name) {
        case 'status':
          this.workStatusShow = false
          this.workStatusRecord = deepClone(this.workStatus)
          break
        case 'template':
          this.workTemplateShow = false
          this.tempActivedRecord = deepClone(this.tempActived)
          break
        case 'date':
          this.workCalendarShow = false
          break
      }
      this.active = null
    },

    // 获取仓库列表
    getTemplateGroupList () {
      wareHouseList({ page_size: 500, page_index: 1 }).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.storeHouseList = res.data.data || []
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter {
    &-overlay {
      height: calc(100% - 96px);
      bottom: 0;
      top: 96px;
      >div {
        max-height: 450px;
        overflow: auto;
      }
    }

    &-status {
      padding: 12px;
      box-sizing: border-box;
      border-top: 1px solid #EFEFEF;
      background: #fff;
      margin-right: -12px;
    }

    &-screen {
      background: #fff;
      padding: 10px 4px;
      display: flex;
      justify-content: space-around;

      &-item {
        font-size: 14px;
        color: #333;
        display: flex;
        align-items: center;
      }

      &-arrow {
        display: block;
        border: 4px solid transparent;
        border-top-color: #282828;
        margin-left: 4px;
        margin-top: 4px;
      }

      &-light {
        color: #BC8D58;

        .filter-screen-arrow {
          border-top-color: #BC8D58;
        }
      }
    }

    &-template {
      padding-bottom: 20px;
      background: #fff;
      display: flex;

      &-main {
        //width: 50%;
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      &-item {
        padding: 12px 20px;
        box-sizing: border-box;
        font-size: 15px;
        font-weight: 400;
        line-height: 21px;
        color: #333;
      }

      &-actived {
        background: #FAF7F4;
      }
    }

    &-bottom {
      padding: 16px 34px;
      box-sizing: border-box;
      background: #fff;
      position: sticky;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  ::v-deep .van-tabs__line {
    display: none;
  }
  ::v-deep .van-calendar__popup {
    top: 44px !important;
  }
  ::v-deep .van-overlay {
    top: 44px !important;
    height: 100%;
  }
</style>
