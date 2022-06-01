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

    <!-- 模板分组 -->
    <template v-if="active === 'template' && workTemplateShow">
      <van-overlay :show="true" class="filter-overlay" @click="overlayClose('template')">
        <template #default>
          <div class="filter-template" @click.stop>
            <div class="filter-template-main">
              <span
                v-for="(item, index) in workTemplateList"
                :key="index"
                class="filter-template-item"
                :class="{'filter-template-actived': tempActivedRecord.ind === index}"
                @click="tempActivedRecord.ind = index"
              >{{ item.name }}</span>
            </div>
            <!--<div class="filter-template-main">-->
            <!--  <template v-if="workTemplateList[tempActivedRecord.ind].tpl_list.length">-->
            <!--    <span-->
            <!--      v-for="(item, index) in workTemplateList[tempActivedRecord.ind].tpl_list"-->
            <!--      :key="index"-->
            <!--      class="filter-template-item"-->
            <!--      :class="{'filter-template-actived': tempActivedRecord.childInd === index}"-->
            <!--      @click="tempActivedRecord.childInd = index"-->
            <!--    >{{ item.name }}</span>-->
            <!--  </template>-->
            <!--  <span v-else></span>-->
            <!--</div>-->
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
  </div>
</template>

<script>
import { deepClone } from 'utils/index'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { FLOW_INSTANCE_STATUS } from './const'
import { flowtplList } from '@/api/approve'

export default {
  name: 'FilterColumn',
  props: {
    pendingApprove: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 筛选项
      active: null,
      screenList: [],
      // 状态
      workStatusShow: false,
      workStatus: FLOW_INSTANCE_STATUS,
      workStatusRecord: [],
      // 模板
      workTemplateShow: false,
      tempActived: {
        ind: 0
        // childInd: 0
      },
      tempActivedRecord: null,
      workTemplateList: [
        {
          // tpl_group_name: '全部',
          name: '全部',
          group_id: 0
          // tpl_list: []
        }
      ],
      // 日期
      workCalendarShow: false,
      minDate: new Date(dayjs(new Date()).add(-1, 'year')),
      maxDate: new Date(),
      defaultDate: [new Date(dayjs(new Date()).add(-2, 'day')), new Date()],
      // 筛选项选择
      filterParams: {
        status: '',
        template: '',
        start_time: '',
        end_time: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  created () {
    this.init()
  },
  methods: {
    // 数据初始化
    init () {
      if (this.pendingApprove) {
        this.screenList = [
          {
            label: '审批状态',
            actived: false,
            name: 'status'
          },
          {
            label: '模板分组',
            actived: false,
            name: 'template'
          },
          {
            label: '申请日期',
            actived: false,
            name: 'date'
          }
        ]
      } else {
        this.screenList = [
          {
            label: '模板分组',
            actived: false,
            name: 'template'
          },
          {
            label: '申请日期',
            actived: false,
            name: 'date'
          }
        ]
      }
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
      if (ind === 0) {
        this.workStatusRecord.map(item => {
          item.actived = false
        })
      } else {
        this.workStatusRecord[0].actived = false
      }
      this.workStatusRecord[ind].actived = !val.actived
    },

    // 状态选择确认
    statusConfirm () {
      const selectedArr = this.workStatusRecord.filter(item => item.actived === true)
      const selectedVal = selectedArr.map(item => item.value)
      this.filterParams.status = selectedVal.join(',')
      this.workStatus = deepClone(this.workStatusRecord)
      this.workStatusShow = false
      this.screenLight(selectedVal[0] !== undefined)
      this.$emit('screenSelect', this.filterParams)
    },

    // 模板选择确认
    templateConfirm () {
      // const { ind, childInd } = this.tempActivedRecord
      const { ind } = this.tempActivedRecord
      this.tempActived = deepClone(this.tempActivedRecord)
      this.workTemplateShow = false
      if (ind === 0) {
        this.filterParams.template = ''
      } else {
        // this.filterParams.template = this.workTemplateList[ind].tpl_list[childInd].name
        this.filterParams.template = this.workTemplateList[ind].name
      }
      this.$emit('screenSelect', this.filterParams)
      this.screenLight(ind !== 0)
    },

    // 申请日期
    onCalendarConfirm (date) {
      const [start, end] = date
      this.filterParams.start_time = this.formatStartTime(start)
      if (date[1]) {
        this.filterParams.end_time = this.formatEndTime(end)
      } else {
        this.filterParams.end_time = this.formatEndTime(start)
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

    // 获取模板分组列表
    getTemplateGroupList () {
      const params = {
        page: 1,
        page_size: 500,
        status: 1,
        platform_ids: 3, // 可见平台为员工H5
        role_ids: this.userData && this.userData['role_list'] && this.userData['role_list'][0] && this.userData['role_list'][0].id
      }
      flowtplList(params).then(res => {
        if (res.code === 200) {
          if (res.data && res.data.list) {
            this.workTemplateList = [...this.workTemplateList, ...res.data.list]
          }
        } else {
          this.$toast(res.msg)
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
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  ::v-deep .van-tabs__line {
    display: none;
  }
  ::v-deep .van-calendar__popup {
    top: 96px !important;
  }
  ::v-deep .van-overlay {
    top: 96px !important;
    height: calc(100% - 96px) !important;
  }
</style>
