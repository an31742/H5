<template>
  <div class="flex-column h100">
    <div class="search-containe workSearch">
      <!--搜索框-->
      <div class="work-screen work-group">
        <p
          class="work-screen-item"
          v-show="!searchFocus"
          :class="{'work-screen-light': selectedGroup.labels.length}"
          @click="selectGroup"
        >
          <span class="van-ellipsis">
            {{ (selectedGroup.isAll || selectedGroup.labels.length === 0) ? '全部项目' : (selectedGroup.labels.length === 1 ? selectedGroup.labels[0] : `已选${selectedGroup.labels.length}个项目`) }}
          </span>
          <span class="work-screen-arrow"></span>
        </p>

        <van-search
          v-if="!showInput"
          v-model="searchName"
          shape="round"
          class="work-search bgfff"
          placeholder="输入姓名/电话查找工单"
          @cancel="cancelSearch"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
          @click="showInput=true"
        >
        </van-search>
        <van-search
          v-else
          ref="search"
          v-model="searchName"
          shape="round"
          class="work-search bgfff"
          placeholder="输入姓名/电话查找工单"
          clearable
          @search="onSearch"
          @input="onSearch"
          @clear="cancelSearch"
          @blur="onSearchBlur"
          @cancel="cancelSearch"
        >
        </van-search>
      </div>
      <van-overlay :show="launcherShow" :lock-scroll="false" class="large my-overlay">
        <template #default>
          <div class="search-main">
            <p v-if="launcherList.length" class="search-sum">共{{ launcherList.length }}个客户</p>
            <ul v-if="launcherList.length">
              <li
                v-for="(item,index) in launcherList"
                :key="index"
                class="search-item"
                @click="confirmSelect(item)"
              >
                {{ item.label }}
              </li>
            </ul>
            <!--空状态-->
            <div v-else class="search-empty">
              <div class="empty-list tc">
                <p>没有搜索结果</p>
              </div>
            </div>
          </div>
        </template>
      </van-overlay>

      <!--筛选栏-->
      <div class="work-screen">
        <p
          v-for="(item, index) in screenList"
          :key="index"
          class="work-screen-item"
          :class="{'work-screen-light': (active === index || item.actived), 'disabled': index === 3 && selectedGroup.labels.length !== 1}"
          @click="screenTabsClick(index)"
        >
          {{ item.label }}<span class="work-screen-arrow"></span>
        </p>
      </div>

      <!--选择服务-->
      <template v-if="active === 0 && popupServiceShow">
        <van-overlay :show="active === 0 && popupServiceShow" :lock-scroll="false" class="service-lay my-overlay" @click="overlayClose(popupServiceShow)">
          <template #default>
            <div @click.stop>
              <SelectService
                ref="ss"
                cancelText="重置"
                :apiParams="{}"
                @cancel="cancelService"
                @confirm="selectService"
              ></SelectService>
            </div>
          </template>
        </van-overlay>
      </template>

      <!--选择状态-->
      <template v-if="active === 1 && workStatusShow">
        <van-overlay :show="true" class="my-overlay" @click="overlayClose(workStatusShow)">
          <template #default>
            <div class="work-status" @click.stop>
              <van-button
                v-for="(item, index) in workStatus"
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
            </div>
          </template>
        </van-overlay>
      </template>

      <!--选择节点-->
      <template v-if="active === 2 && workNodeShow">
        <van-overlay :show="true" class="my-overlay" @click="overlayClose(workNodeShow)">
          <template #default>
            <div class="work-status" @click.stop>
              <van-button
                v-for="(item, index) in workNode"
                :key="index"
                class="choice-button white"
                native-type="button"
                :class="isNodeSelected(item) ? 'active' : ''"
                size="small"
                @click="selectNodeStatus(item, index)"
              >
                {{ item.label }}
                <svg-icon
                  v-if="isNodeSelected(item)"
                  class="corner"
                  icon-class="corner"
                />
              </van-button>
            </div>
          </template>
        </van-overlay>
      </template>

      <!-- 选择房屋 -->
      <template v-if="active === 3 && workRoomShow">
        <van-overlay :show="true" :lock-scroll="false" class="my-overlay" @click="overlayClose(workRoomShow)">
          <template #default>
            <div @click.stop>
              <!--<van-picker ref="vp" value-key="name" :columns="estateList" @confirm="selectRoom"></van-picker>-->
              <fwTreeSelect
                class="h100"
                :depth="3"
                :items="estateList"
                :active-indexes.sync="selectedRoom"
                :active-ids.sync="selectedRoomIds"
              >
              </fwTreeSelect>
              <div class="work-button">
                <van-button
                  type="default"
                  round
                  class="work-default-button cop-btn"
                  @click="cancelSelectRoom"
                >重置</van-button>
                <van-button
                  type="primary"
                  round
                  class="cop-btn"
                  color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
                  @click="selectRoom"
                >确定</van-button>
              </div>
            </div>
          </template>
        </van-overlay>
      </template>

      <!-- 选择来源 -->
      <template v-if="active === 4 && workSourceShow">
        <van-overlay :show="true" :lock-scroll="false" class="my-overlay" @click="overlayClose(workSourceShow)">
          <template #default @click.stop>
            <div class="work-status">
              <van-button
                v-for="(item, index) in workSource"
                :key="index"
                class="choice-button white"
                native-type="button"
                :class="(searchParams.source || '') === item.value ? 'active' : ''"
                size="small"
                @click="selectSource(item, index)"
              >
                {{ item.label }}
                <svg-icon
                  v-if="(searchParams.source || '') === item.value"
                  class="corner"
                  icon-class="corner"
                />
              </van-button>
            </div>
          </template>
        </van-overlay>
      </template>

      <!-- 选择时间 -->
      <template v-if="active === 5">
        <div class="top-calendar">
          <van-calendar
            ref="calendar"
            v-model="workCalendarShow"
            type="range"
            position="top"
            range-prompt="最多可选一年"
            :max-range="365"
            :min-date="minDate"
            :max-date="maxDate"
            :show-title="false"
            :allow-same-day="true"
            :default-date="defaultDate"
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
      </template>
    </div>

    <!--筛选列表-->
    <work-list ref="wl" class="expand" :api="wfeFlowInstanceList" :params.sync="searchParams"></work-list>

    <!--项目筛选-->
    <selectGroup ref="selectGroup" @confirm="confirmGroup"></selectGroup>
  </div>
</template>

<script>
import { wfeFlowInstanceLauncherSearch, wfeFlowInstanceList, wfeEstateTree } from '@/api/wfe'
import SelectService from '@/components/SelectAllService'
import selectGroup from './components/selectGroup'
import fwTreeSelect from '@/views/components/fwTreeSelect'
import workList from './components/workList'
import dayjs from 'dayjs'

export default {
  name: 'SearchWork',
  components: {
    SelectService,
    selectGroup,
    fwTreeSelect,
    workList
  },
  data () {
    return {
      active: null,
      searchName: '',
      searchFocus: false,
      launcherList: [],
      tagList: ['服务', '状态', '节点', '房屋', '来源', '时间'],
      screenList: [
        {
          label: '服务',
          actived: false
        },
        {
          label: '状态',
          actived: false
        },
        {
          label: '节点',
          actived: false
        },
        {
          label: '房屋',
          actived: false
        },
        {
          label: '来源',
          actived: false
        },
        {
          label: '时间',
          actived: false
        }
      ],
      // 项目选择
      selectedGroup: {
        labels: [],
        values: []
      },
      // 房屋选择
      selectedRoom: [],
      selectedRoomIds: [],
      // 弹框 显示show // 可根据后续使用改动
      showInput: false,
      launcherShow: false,
      workStatusShow: false,
      workCalendarShow: false,
      popupServiceShow: false,
      workSourceShow: true,
      workRoomShow: false,
      // 公共方法
      orderList: [],
      searchParams: {},
      wfeFlowInstanceList,
      estateList: [],
      // statusOptions: [],
      minDate: new Date(dayjs(new Date()).add(-1, 'year')),
      maxDate: new Date(),
      defaultDate: [new Date(dayjs(new Date()).add(-30, 'day')), new Date()]
    }
  },
  computed: {
    // 状态
    workStatus () {
      const other = []
      //   const done = [{ label: '已完成', status: 9 }]
      let nodes = this.appConfig ? this.appConfig['WFE_FLOW_INSTANCE_STATUS'] : []

      nodes = JSON.parse(JSON.stringify(nodes))
      return other.concat(nodes)
    },
    // 节点
    workNode () {
      const other = []
      //   const done = [{ label: '已完成', status: 9 }]
      let nodes = this.appConfig ? this.appConfig['WFE_BIZ_NODE_CODE'] : []

      nodes = JSON.parse(JSON.stringify(nodes))

      nodes = nodes.filter(item => {
        return item.value !== 'NODE_CODE_SUBMIT'
      })

      return other.concat(nodes)
    },
    // 来源
    workSource () {
      const source = [{ label: '全部', value: '' }]
      const wfeSource = this.appConfig['WFE_FLOW_INSTANCE_SOURCE']

      wfeSource.forEach(item => {
        source.push(item)
      })

      return source
    }
  },
  created () {
    const query = this.$route.query
    if (query['launcher_name'] && query['launcher_id']) {
      this.searchName = query['launcher_name']
      this.searchParams.launcher = 'C#' + query['launcher_id']
    }

    this.calendarReset()
    // this.getNodes()
  },
  activated () {
    this.getList()
    // this.getNodes()
  },
  deactivated () {
    this.launcherShow = false
  },
  mounted () {
    // this.getEstateTree()
  },
  methods: {
    // 筛选项 - 点击
    screenTabsClick (ind) {
      this.active = ind
      switch (ind) {
        case 0:
          this.popupServiceShow = true
          this.$nextTick(() => {
            this.$refs.ss.show()
          })
          break
        case 1:
          this.workStatusShow = true
          break
        case 2:
          this.workNodeShow = true
          break
        case 3:
          if (this.selectedGroup.labels.length === 1) {
            this.workRoomShow = true
            // this.$nextTick(() => {
            //   this.$refs.vp.setIndexes(this.selectedRoom)
            // })
          }
          break
        case 4:
          this.workSourceShow = true
          break
        case 5:
          this.workCalendarShow = true
          break
      }
    },

    // 筛选没有房屋的单元
    filterEstate (list = []) {
      const all = [
        { id: '',
          name: '全部',
          children: [
            { id: '', name: '全部' }
          ]
        }
      ]

      return list.filter(item => {
        if (!item.children || !item.children.length) {
          return false
        }

        item.children = all.concat(item.children)
        item.children = item.children.filter(child => {
          if (!child.children || !child.children.length) {
            return false
          }

          if (child.id !== '') {
            child.children = [
              { id: '', name: '全部' }
            ].concat(child.children)
          }
          return true
        })

        return true
      })
    },

    // 获取所有使用中的节点
    // getNodes () {
    //   wfeFlowInstanceUsedBizNodeList().then(res => {
    //     if (res.code === 200) {
    //       this.statusOptions = (res.data || []).map(item => item.code)
    //     } else {
    //       this.statusOptions = []
    //     }
    //   })
    // },

    // 获取房屋树
    getEstateTree (id) {
      wfeEstateTree({ group_id: id }).then(res => {
        if (res.code === 200) {
          this.estateList = this.filterEstate(res.data || [])
          return
        }
        this.$toast(res.msg || '房屋查询失败')
      })
    },

    // 选择房屋
    selectRoom (names, index) {
      console.log('this.selectedRoomIds', this.selectedRoomIds)
      console.log('this.selectedRoom', this.selectedRoom)
      // this.selectedRoom = index
      // this.workRoomShow = false
      // this.searchParams.room_id = ''
      // this.searchParams.unit_id = ''
      // this.searchParams.building_id = ''

      // const build = this.estateList[index[0]]
      // const unit = build.children[index[1]]
      // const room = unit.children[index[2]]
      // this.searchParams.room_id = room.id
      // this.searchParams.unit_id = unit.id
      // this.searchParams.building_id = build.id

      this.workRoomShow = false

      this.searchParams.room_id = this.selectedRoomIds[2]
      this.searchParams.unit_id = this.selectedRoomIds[1]
      this.searchParams.building_id = this.selectedRoomIds[0]

      this.screenLight(true)
      this.getList()
    },

    // 重置房屋选择
    cancelSelectRoom () {
      this.selectedRoom = []
      this.workRoomShow = false
      this.searchParams.room_id = ''
      this.searchParams.unit_id = ''
      this.searchParams.building_id = ''

      this.screenLight(false)
      this.getList()
    },

    // 搜索
    onSearch () {
      this.launcherShow = true
      this.getLauncherList()
    },

    // 搜索聚焦
    onSearchBlur () {
      this.searchFocus = false
      // this.onSearch()
    },
    // 搜索失焦
    onSearchFocus () {
      this.searchFocus = true
    },

    // 取消搜索
    cancelSearch () {
      this.searchParams.launcher = ''
      this.launcherShow = false
      this.showInput = false
      this.searchName = ''

      this.getList()
    },

    // 获取提单人列表
    getLauncherList () {
      if (!this.searchName) {
        this.launcherList = []
        return
      }

      wfeFlowInstanceLauncherSearch({ key: this.searchName }).then(res => {
        if (res.code === 200) {
          this.launcherList = res.data || []
        }
      })
    },

    // 选择提单人
    confirmSelect (item) {
      this.searchParams.launcher = item.value
      this.searchName = item.label
      this.launcherShow = false
      this.showInput = false
      this.getList()
    },

    // 日历 - 确认
    onConfirm (date) {
      this.workCalendarShow = false

      this.searchParams.start_time = this.formatStartTime(date[0])
      if (date[1]) {
        this.searchParams.end_time = this.formatEndTime(date[1])
      } else {
        this.searchParams.end_time = this.formatEndTime(date[0])
      }
      this.screenLight(true)
      this.getList()
    },
    calendarConfirm () {
      this.$refs.calendar.onConfirm()
    },
    calendarReset () {
      this.workCalendarShow = false
      if (this.$refs.calendar) {
        this.$refs.calendar.reset()
      }
      this.searchParams.start_time = this.formatStartTime(this.defaultDate[0])
      this.searchParams.end_time = this.formatEndTime(this.defaultDate[1])
      this.active = 5
      this.screenLight(true)
      this.getList()
    },

    // 状态是否选中
    isStatusSelected (item) {
      const st = this.searchParams.status

      // 全部
      if (!st) {
        return false
      }

      return st && st === item.value
    },

    // 状态是否选中
    isNodeSelected (item) {
      const code = this.searchParams.biz_node_code

      // 全部
      if (!code) {
        return false
      }

      return code && code === item.value
    },

    // 状态
    selectStatus (val, ind) {
      this.searchParams.status = val.value

      this.screenLight(true)
      this.screenDataHandle(val, ind)
    },

    // 节点
    selectNodeStatus (val, ind) {
      this.searchParams.biz_node_code = val.value

      this.screenLight(true)
      this.screenDataHandle(val, ind)
    },

    // 服务
    selectService (res) {
      this.popupServiceShow = false

      if (res && res.item) {
        this.searchParams.biz_subservice_id = res.subItem.record_id
        this.screenLight(true)
        this.getList()
      }
    },

    // 重置服务
    cancelService () {
      this.popupServiceShow = false
      this.searchParams.biz_subservice_id = ''
      this.screenLight(false)
      this.getList()
    },

    // 来源
    selectSource (val, ind) {
      this.searchParams.source = val.value
      this.screenLight(ind !== 0)
      this.screenDataHandle(val, ind)
    },

    // 状态
    screenDataHandle (val, ind) {
      this.active = null
      this.getList()
    },

    // 选择项目
    selectGroup () {
      this.$refs.selectGroup.show()
    },
    // 确认选择
    confirmGroup (obj) {
      this.selectedGroup = obj
      this.searchParams.group_id_str = obj.values.join(',')
      // 全选或者多选的时候，房屋选择不可用
      if (obj.values.length === 1) {
        this.getEstateTree(obj.values[0])
      }

      this.cancelSelectRoom() // 清空房屋选择并重新调用列表接口
    },

    // 刷新列表
    getList () {
      this.$refs.wl && this.$refs.wl.onRefresh()
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

    // 弹框关闭
    overlayClose (el) {
      el = false
      this.active = null
    }
  }
}
</script>

<style lang="scss" scoped>
  .workSearch{
    background: #F6F8FA;
    padding-bottom: 4px;
    .service-lay>div {
      height: 416px;
    }
  }

  .work {
    font-family: PingFangSC-Regular, PingFang SC;

    &-group {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      margin-bottom: 1px;
      .work-screen-item {
        width: 90px;
        padding-left: 16px;
      }
    }

    &-search {
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

    &-default-button {
      border-color: #E1AA6C;
      color: #E1AA6C;
    }

    &-button {
      width: 100%;
      padding: 10px 21px;
      box-sizing: border-box;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
    }

    &-status {
      padding: 12px;
      box-sizing: border-box;
      border-top: 1px solid #EFEFEF;
      background: #fff;
      margin-right: -12px;
    }

    &-room {
      background: #fff;
      display: flex;

      &-main {
        flex: 1;
      }

      &-row {
        border-bottom: 1px solid #EFEFEF;
        display: flex;
        flex-direction: column;
      }

      &-item {
        flex: 1;
        font-size: 14px;
        color: #333;
        line-height: 20px;
        padding: 12.5px 0;
        box-sizing: border-box;
        text-align: center;
      }
    }
  }

  .search-main {
    background: #FFFFFF;
    .search-sum {
      height: 34px;
      background: #FFFFFF;
      box-shadow: 0 0 0 0 #F1F1F1;
      font-size: 13px;
      color: #999999;
      line-height: 30px;
      padding-left: 16px;
    }
    .search-item {
      background: #FFFFFF;
      display: flex;
      border-top: 1px solid #EEEEEE;
      align-items: center;
      padding: 12px 16px;
      height: 30px;
      font-size: 15px;
      line-height: 21px;
    }
    .search-empty {
      padding: 20px 0 30px;
    }
  }

  .cop-btn {
    width:141px;
    height:40px;
    font-size: 15px;
    border-radius: 10px;
  }
</style>
