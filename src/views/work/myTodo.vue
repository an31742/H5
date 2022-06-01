<template>
  <div class="work-mytodo flex-column h100">
    <div class="work-status">
      <!--项目-->
      <p class="work-status-item" :class="{'work-status-light': selectedGroup.labels.length}" @click="selectGroup">
        <span class="van-ellipsis">
          {{ (selectedGroup.isAll || selectedGroup.labels.length === 0) ? '全部项目' : (selectedGroup.labels.length === 1 ? selectedGroup.labels[0] : `已选${selectedGroup.labels.length}个项目`) }}
        </span>
        <span class="work-status-arrow"></span>
      </p>

      <!--状态-->
      <p class="work-status-item work-status-light" @click="statusSelectShow = true">
        {{ statusSelected }}<span class="work-status-arrow"></span>
      </p>
      <p v-if="isApp && isShowDownload" class="work-status-item work-status-light" >
        <svg-icon icon-class="workorder-multiple" @click="openDownload" style="font-size: 16px;color:#BC8D58"/>
        <svg-icon icon-class="off-line-order" @click="openOfflineCenter" style="margin-left: 20px;font-size: 16px;color:#BC8D58" />
      </p>
      <van-overlay :show="statusSelectShow" class="my-overlay" @click="statusSelectShow = false">
        <template #default class="my-overlay">
          <div class="work-status-content" @click.stop>
            <van-button
              v-for="(item, index) in workStatus"
              :key="index"
              class="choice-button white"
              native-type="button"
              :class="[actived === index ? 'active': '', statusStatics[item.value] === 0 && actived !== index ? 'disabled': '']"
              size="small"
              @click="selectStatus(item, index)"
            >
              {{ item.label }}
              <span>{{ statusStatics && statusStatics[item.value] || '' }}</span>
              <svg-icon v-if="actived === index" class="corner" icon-class="corner" />
            </van-button>
          </div>
        </template>
      </van-overlay>
    </div>

    <!--筛选列表-->
    <work-list
      ref="wl"
      class="expand"
      isDownLoad="1"
      :api="minipStaffFlowInstanceTodoList"
      :params.sync="searchParams"
      :downloadStatusText="downloadStatusText"
    ></work-list>

    <!--项目筛选-->
    <selectGroup ref="selectGroup" @confirm="confirmGroup"></selectGroup>
    <!-- 批量下载 -->
    <div v-show="showDownload">
      <DownloadOrder ref="download" :key="new Date().getTime()" :api="minipStaffFlowInstanceTodoList" :params.sync="searchParams" @closeOverlay="closeOverlay"/>
    </div>
  </div>
</template>

<script>
import workList from './components/workList'
import selectGroup from './components/selectGroup'
import { wfeFlowInstanceTodoList, wfeFlowInstanceTodoStatics, minipStaffFlowInstanceTodoList } from '@/api/wfe'
import { isApp, isShowDownload } from '@/utils/index'
import DownloadOrder from './downloadOrder.vue'

export default {
  name: 'MyToDo',
  components: {
    selectGroup,
    workList,
    DownloadOrder
  },
  data () {
    return {
      wfeFlowInstanceTodoList,
      minipStaffFlowInstanceTodoList,
      statusSelectShow: false,
      searchParams: {},
      // 项目选择
      selectedGroup: {
        labels: [],
        values: []
      },
      actived: 0,
      statusStatics: {},
      isApp: isApp(),
      isShowDownload: isShowDownload('1.2.1'),
      downloadStatus: 0,
      showDownload: false,
      downloadStatusText: ''
    }
  },
  computed: {
    workStatus () {
      return this.appConfig.WFE_FLOW_INSTANCE_TODO_LIST_UNQ_CNT || []
    },
    // 选择的状态
    statusSelected () {
      const val = this.workStatus[this.actived] || {}
      return `${val.label} ${this.statusStatics && this.statusStatics[val.value] || ''}`
    }
  },
  created () {
    const doingIndex = (this.workStatus || []).findIndex(i => i.value === 1)
    this.actived = doingIndex === -1 ? 0 : doingIndex // 默认展示"处理中"
    this.searchParams.unq_cnt = this.workStatus && this.workStatus[this.actived] && this.workStatus[this.actived].value || ''
    this.getStatics()
    this.$refs.wl && this.$refs.wl.onRefresh()
  },
  activated () {
    this.$refs.wl && this.$refs.wl.onRefresh()
    this.getStatics()
  },
  methods: {
    openDownload () {
      this.showDownload = true
      this.$refs.download.onLoad()
    },
    openOfflineCenter () {
      this.toOfflineCenter()
    },
    closeOverlay () {
      this.showDownload = false
    },
    // 获取统计数据
    getStatics () {
      const params = {
        group_id_str: this.searchParams.group_id_str
      }
      wfeFlowInstanceTodoStatics(params).then(res => {
        if (res.code === 200) {
          this.statusStatics = res.data
        } else {
          this.$toast(res.msg || '获取数据失败')
        }
      })
    },

    // 状态筛选
    selectStatus (val, ind) {
      if (!this.statusStatics[val.value]) {
        return
      }

      this.actived = ind
      this.statusSelectShow = false
      this.searchParams.unq_cnt = val.value

      this.$nextTick(() => {
        this.$refs.wl.onRefresh()
      })
    },

    // 选择项目
    selectGroup () {
      this.$refs.selectGroup.show()
    },
    // 确认选择
    confirmGroup (obj) {
      this.selectedGroup = obj
      this.searchParams.group_id_str = obj.values.join(',')

      this.$refs.wl.onRefresh()
      this.getStatics()
    }
  }
}
</script>

<style lang="scss" scoped>
  .work {
    &-mytodo {
      height: 100%;
      background: #F6F8FA;
    }

    &-status {
      background: #fff;
      padding: 10px 4px;
      display: flex;
      justify-content: space-around;
      margin-bottom: 4px;

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

        .work-status-arrow {
          border-top-color: #BC8D58;
        }
      }

      &-content {
        padding: 12px;
        box-sizing: border-box;
        border-top: 1px solid #EFEFEF;
        background: #fff;
        margin-right: -12px;
      }
    }
  }
</style>
