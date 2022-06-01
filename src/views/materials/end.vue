<template>
  <div class="counted">
    <div class="workSearch">
      <!--筛选栏-->
      <div class="work-screen">
        <p
          v-for="(item, index) in screenList"
          :key="index"
          class="work-screen-item"
          :class="{'work-screen-light': (active === index || item.actived)}"
          @click="screenTabsClick(index)"
        >
          {{ item.label }}<span class="work-screen-arrow"></span>
        </p>
      </div>

      <!--    仓库名称-->
      <template v-if="active === 0 && countedName">
        <van-overlay :show="true" class="my-overlay" @click="overlayClose(countedName)" :lock-scroll="false">
          <template #default>
            <div class="filter-template" @click.stop>
              <div class="filter-template-main">
                <span
                  v-for="(item, index) in nameList"
                  :key="index"
                  class="filter-template-item"
                  :class="{'filter-template-actived': tempActived.ind === index}"
                  @click="tempActived.ind = index"
                >{{ item.WarehouseName }}</span>
              </div>
            </div>
            <div class="filter-bottom" @click.stop>
              <van-button
                round
                size="large"
                type="primary"
                color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
                style="height: 40px;"
                @click="templateConfirm"
              >确定</van-button>
            </div>
            <!--            <div class="work-status" @click.stop>
              <van-button
                v-for="(item, index) in nameList"
                :key="index"
                class="choice-button white"
                native-type="button"
                :class="isStatusSelected(item) ? 'active' : ''"
                size="small"
                @click="selectStatus(item, index)"
              >
                {{ item.label }}
                <svg-icon
                  v-if="isStatusSelected(item)"
                  class="corner"
                  icon-class="corner"
                />
              </van-button>
            </div>-->
          </template>
        </van-overlay>
      </template>

      <!--    资产类型-->
      <template v-if="active === 1 && countedType">
        <van-overlay :show="true" class="my-overlay" @click="overlayClose(countedType)" :lock-scroll="false">
          <template #default>
            <div class="work-status" @click.stop>
              <van-button
                v-for="(item, index) in typeList"
                :key="index"
                class="choice-button white"
                native-type="button"
                :class="(searchParams.assets_group_id || '') === item.id ? 'active' : ''"
                size="small"
                @click="selectType(item, index)"
              >
                {{ item.name }}
                <svg-icon
                  v-if="(searchParams.assets_group_id || '') === item.id"
                  class="corner"
                  icon-class="corner"
                />
              </van-button>
            </div>
          </template>
        </van-overlay>
      </template>

      <!--    状态-->
      <template v-if="active === 2 && countedStatus">
        <van-overlay :show="true" class="my-overlay" @click="overlayClose(countedStatus)">
          <template #default>
            <div class="work-status" @click.stop>
              <van-button
                v-for="(item, index) in statusList"
                :key="index"
                class="choice-button white"
                native-type="button"
                :class="((searchParams.status_status.length === 1 ? searchParams.status_status[0] : searchParams.status_status) || '' ) === item.value ? 'active' : ''"
                size="small"
                @click="selectStatus(item, index)"
              >
                {{ item.label }}
                <svg-icon
                  v-if="(searchParams.status || '') === item.value"
                  class="corner"
                  icon-class="corner"
                />
              </van-button>
            </div>
          </template>
        </van-overlay>
      </template>

      <!-- 选择开始时间 -->
      <!-- <template v-show="active === 3">
        <div class="top-calendar">
          <van-calendar
            ref="calendar"
            v-model="startTime"
            type="range"
            position="top"
            range-prompt="最多可选一年"
            :max-range="365"
            :min-date="minDate"
            :show-title="false"
            :allow-same-day="true"
            :show-mark="false"
            row-height="46"
            @confirm="onConfirm"
          >
            <template #footer>
              <div class="work-button">
                <van-button
                  type="default"
                  round
                  class="work-default-button cop-btn"
                  @click="calendarReset"
                >重置</van-button>
                <van-button
                  type="primary"
                  round
                  class="cop-btn"
                  color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
                  @click="calendarConfirm"
                >确定</van-button>
              </div>
            </template>
          </van-calendar>
        </div>
      </template> -->

      <!-- 选择开始时间 -->
      <!-- <template v-show="active === 4">
        <div class="top-calendar">
          <van-calendar
            ref="calendar1"
            v-model="endTime"
            position="top"
            range-prompt="最多可选一年"
            :max-range="365"
            :show-title="false"
            :allow-same-day="true"
            :show-mark="false"
            row-height="46"
            @confirm="onConfirm1"
          >
            <template #footer>
              <div class="work-button">
                <van-button
                  type="default"
                  round
                  class="work-default-button cop-btn"
                  @click="calendarReset1"
                >重置</van-button>
                <van-button
                  type="primary"
                  round
                  class="cop-btn"
                  color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
                  @click="calendarConfirm1"
                >确定</van-button>
              </div>
            </template>
          </van-calendar>
        </div>
      </template> -->

      <!-- 选择开始时间 -->
      <template v-show="active === 3">
        <div class="top-calendar">
          <van-calendar
            ref="calendar"
            v-model="startTime"
            position="top"
            range-prompt="最多可选一年"
            :show-title="false"
            :show-mark="false"
            :max-range="365"
            :min-date="minDate"
            row-height="46"
            @confirm="onConfirm"
          >
            <template #footer>
              <div class="work-button">
                <van-button
                  type="default"
                  round
                  class="work-default-button cop-btn"
                  @click="calendarReset"
                >重置</van-button>
                <van-button
                  type="primary"
                  round
                  class="cop-btn"
                  color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
                  @click="calendarConfirm"
                >确定</van-button>
              </div>
            </template>
          </van-calendar>
        </div>
      </template>

      <!-- 选择开始时间 -->
      <template v-show="active === 4">
        <div class="top-calendar">
          <van-calendar
            ref="calendar1"
            v-model="endTime"
            position="top"
            range-prompt="最多可选一年"
            :show-title="false"
            :show-mark="false"
            :max-range="365"
            :min-date="minDate"
            row-height="46"
            @confirm="onConfirm1"
          >
            <template #footer>
              <div class="work-button">
                <van-button
                  type="default"
                  round
                  class="work-default-button cop-btn"
                  @click="calendarReset1"
                >重置</van-button>
                <van-button
                  type="primary"
                  round
                  class="cop-btn"
                  color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
                  @click="calendarConfirm1"
                >确定</van-button>
              </div>
            </template>
          </van-calendar>
        </div>
      </template>
    </div>
    <EndList :searchParams="searchParams" ref="wl"/>
  </div>
</template>

<script>
import EndList from './components/endList'
import { getSearchTypeList, getWarehouseList } from 'api/materials'
import dayjs from 'dayjs'
import moment from 'moment'
export default {
  name: 'MaterialsEnd',
  components: {
    EndList
  },
  data () {
    return {
      screenList: [
        {
          label: '仓库名称',
          actived: false
        },
        {
          label: '资产类型',
          actived: false
        },
        {
          label: '状态',
          actived: false
        },
        // {
        //   label: '时间范围',
        //   actived: false
        // }
        // {
        //   label: '结束日期',
        //   actived: false
        // }
        {
          label: '开始日期',
          actived: false
        },
        {
          label: '结束日期',
          actived: false
        }
      ],
      active: null,
      searchParams: {
        status_status: [3, 4, 5]
      },
      nameList: [],
      typeList: [],
      statusList: [
        { label: '已完成', value: 3 },
        // { label: '待提交', value: 1 },
        // { label: '复核中', value: 2 },
        { label: '已过期', value: 4 },
        { label: '人工终止', value: 5 }
      ],
      tempActived: {
        ind: 0
      },
      minDate: new Date(dayjs(new Date()).add(-1, 'year')),
      maxDate: new Date(),
      countedName: false,
      countedType: false,
      countedStatus: false,
      startTime: false,
      endTime: false
    }
  },
  created () {
    this.getTypeList()
    this.getWarehouse()
  },
  methods: {
    // 筛选项 - 点击
    screenTabsClick (ind) {
      this.active = ind
      switch (ind) {
        case 0:
          this.countedName = true
          break
        case 1:
          this.countedType = true
          break
        case 2:
          this.countedStatus = true
          break
        case 3:
          this.startTime = true
          break
        case 4:
          this.endTime = true
          break
      }
    },
    // 筛选项高亮
    screenLight (val) {
      if (this.active) {
        this.screenList[this.active].actived = val
      }
      if (!val) {
        this.active = null
      }
    },
    getTypeList () {
      getSearchTypeList().then(res => {
        if (res.code === 200) {
          this.typeList = res.data.list
        } else {
          this.$toast(res.msg)
        }
      })
    },
    getWarehouse () {
      getWarehouseList().then(res => {
        if (res.code === 200) {
          this.nameList = res.data.data
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 状态
    screenDataHandle (val, ind) {
      this.active = null
      this.getList()
    },
    // 弹框关闭
    overlayClose (el) {
      el = false
      this.active = null
    },
    // 状态
    selectStatus (val, ind) {
      this.searchParams.status_status = [val.value]
      this.screenLight(ind !== 0)
      this.screenDataHandle(val, ind)
    },
    // 资产类型
    selectType (val, ind) {
      console.log(val)
      this.searchParams.assets_group_id = val.id
      this.screenLight(ind !== 0)
      this.screenDataHandle(val, ind)
    },
    // 仓库
    templateConfirm () {
      const { ind } = this.tempActived
      this.countedName = false
      if (ind === 0) {
        this.searchParams.warehouse_name = ''
      } else {
        this.searchParams.warehouse_name = this.nameList[ind].WarehouseName
      }
      this.screenLight(ind !== 0)
      this.getList()
    },
    formatDate (date) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    },
    // 开始时间 - 确认
    onConfirm (value) {
      this.startTime = false
      // this.searchParams.start_time = value.getTime()
      this.searchParams.begin_start_time = moment(moment(value.getTime()).startOf('day')).format()
      this.screenLight(true)
      this.getList()
    },
    calendarConfirm () {
      this.$refs.calendar.onConfirm()
    },
    calendarReset () {
      this.startTime = false
      if (this.$refs.calendar) {
        this.$refs.calendar.reset()
      }
      this.active = 3
      this.screenLight(true)
      this.getList()
    },
    // 结束时间 - 确认
    onConfirm1 (value) {
      this.endTime = false
      console.log(value.getTime())
      // this.searchParams.end_time = value.getTime()
      this.searchParams.begin_end_time = moment(moment(value.getTime()).startOf('day')).format()
      this.screenLight(true)
      this.getList()
    },
    calendarConfirm1 () {
      this.$refs.calendar1.onConfirm()
    },
    calendarReset1 () {
      this.endTime = false
      if (this.$refs.calendar1) {
        this.$refs.calendar1.reset()
      }
      this.active = 4
      this.screenLight(true)
      this.getList()
    },
    // 刷新列表
    getList () {
      this.$refs.wl && this.$refs.wl.onRefresh()
    }
  }
}
</script>

<style lang="scss">
.counted{
  .van-calendar__selected-day{
    background: linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%);
  }
}
</style>
<style scoped lang="scss">
.counted{
  .workSearch{
    background: #F6F8FA;
    padding-bottom: 4px;
    .my-overlay {
      height: calc(100% - 40px);
      bottom: 0;
      top: 40px;
    }
  }
  .work-search {
    flex: auto;
    .van-search__content {
      padding-left: 0;
      border-radius: 17px;
    }
    ::v-deep .van-field {
      padding: 5px 8px 5px 0;
      margin-bottom: 0;
      background: #F5F5F5;
      text-indent: 6px;
      border-radius: 17px;
      color: #999;
      .van-field__body {
        height: 24px;
      }
    }
  }
  .work-screen {
    background: #fff;
    padding: 10px 4px;
    display: flex;
    justify-content: space-around;

    &-item {
      font-size: 14px;
      color: #333;
      display: flex;
      align-items: center;
      &.disabled {
        color: #C1C1C1;
      }
    }

    &-arrow {
      display: block;
      border: 4px solid transparent;
      border-top-color: #282828;
      margin-left: 4px;
      margin-top: 4px;
    }
    .disabled &-arrow {
      border-top-color: #C1C1C1;
    }

    &-light {
      color: #BC8D58;

      .work-screen-arrow {
        border-top-color: #BC8D58;
      }

      &.disabled {
        .work-screen-arrow {
          border-top-color: #C1C1C1;
        }
      }
    }
  }
  .work-status {
    padding: 12px;
    box-sizing: border-box;
    border-top: 1px solid #EFEFEF;
    background: #fff;
    margin-right: -12px;
  }
  .work-button {
    width: 100%;
    padding: 10px 21px;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
  }
  .work-default-button {
    border-color: #E1AA6C;
    color: #E1AA6C;
  }
  .cop-btn {
    width:141px;
    height:40px;
    font-size: 15px;
    border-radius: 10px;
  }
  .filter-template {
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
  .filter-bottom {
    padding: 16px 34px;
    box-sizing: border-box;
    background: #fff;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
