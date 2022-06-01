<template>
  <div class="work-report flex-column">
    <van-form
      ref="form"
      class="expand"
      validate-first
      scroll-to-error
      style="padding-bottom: 12px;"
      :show-error-message="false"
      @submit="handleSubmit"
    >
      <!--选择服务-->
      <FwSelectService
        ref="ss"
        :entryId="entryId"
        :groupId="groupId"
        :model="formModel"
        :opt="opt"
        style="margin-bottom:0.32rem;"
        @confirm="selectCategory"
      />

      <!--动态表单-->
      <fc ref="fc" :model="formModel" :options="options" />

      <!--是否加急-->
      <div v-if="options && options.length" class="work-report-field work-report-urgent">
        <span class="work-report-urgent-text">是否加急</span>
        <div class="work-report-urgent-button">
          <van-button
            v-for="(item, index) in urgentStatusList"
            :key="index"
            class="choice-button white"
            style="margin-bottom: 0;"
            native-type="button"
            size="small"
            :class="is_urgent === item.value ? 'active' : ''"
            @click="selectUrgentStatus(item, index)"
          >
            {{ item.label }}
            <svg-icon
              v-if="is_urgent === item.value"
              class="corner"
              icon-class="corner"
            />
          </van-button>
        </div>
      </div>
    </van-form>

    <!--提交按钮-->
    <div class="work-report-button">
      <van-button
        round
        block
        type="info"
        native-type="submit"
        color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
        @click="$refs.form.submit()"
      >
        提交
      </van-button>
    </div>
  </div>
</template>

<script>
import { wfeFlowInstanceLaunch, wfeFlowInstanceLaunchForm } from '@/api/wfe'
import FwSelectService from './FwSelectService'
import { WorkOrderEntry, WorkOrderSource, AppWorkOrderEntry } from '@/utils/const'
import fc from '@/views/formComponents/index'
import { string2obj } from '@/utils'
import { mapGetters } from 'vuex'
import FwDeviceReport from '../formComponents/FwDeviceReport'
import FwCleanReport from '../formComponents/FwCleanReport'
import FwSequenceReport from '../formComponents/FwSequenceReport'
import { isApp } from '@/utils/index'

export default {
  name: 'WorkLaunch',
  components: { FwSelectService, fc },
  props: {
    // 入口id
    entryId: {
      type: [String, Number],
      default: () => isApp() ? AppWorkOrderEntry.selfReport.value : WorkOrderEntry.selfReport.value
    },
    // 用户id
    launcher: {
      type: String,
      default: () => ''
    },
    // 房间id
    // roomId: {
    //   type: [String, Number],
    //   default: () => ''
    // },
    // 用户姓名
    // launcherName: {
    //   type: String,
    //   default: () => ''
    // },
    // 报事来源
    // source: {
    //   type: Number,
    //   default: () => 1 // 自查报事
    // },
    serviceId: {
      type: String,
      default: () => undefined
    },
    subServiceId: {
      type: String,
      default: () => undefined
    },
    groupId: {
      type: Number,
      default: () => undefined
    },
    commitId: {
      type: Number,
      default: () => undefined
    },
    deviceId: {
      type: Number,
      default: () => undefined
    },
    type: {
      type: Number,
      default: () => undefined
    }
  },
  data () {
    return {
      opt: { code: 'biz_service_id', name: '服务类型', required: true },
      options: [],
      formModel: {},
      is_urgent: 0,
      room_id: '',
      biz_service_id: this.serviceId || '',
      biz_subservice_id: this.subServiceId || '',
      urgentStatusList: [
        {
          value: 0,
          label: '不加急'
        },
        {
          value: 1,
          label: '加急'
        }
      ],
      needSplit: {
        FwDeviceReport,
        FwCleanReport,
        FwSequenceReport
      },
      source: 0,
      sourceType: [
        {
          label: '工程报障',
          value: WorkOrderSource.deviceCheck
        },
        {
          label: '环境整改',
          value: WorkOrderSource.cleanTask
        },
        {
          label: '秩序整改',
          value: WorkOrderSource.squenceTask
        },
        {
          label: '品质整改',
          value: WorkOrderSource.qualityTask
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.serviceId && !this.subServiceId) {
        console.log('selectRelatedService')
        this.$refs.ss.selectRelatedService()
      } else {
        console.log('getAllServiceList')
        this.$refs.ss.getAllServiceList(this.serviceId, this.subServiceId)
      }
    })
  },
  methods: {
    // 选择用户
    selectRelatedUser () {
      this.$emit('selectUser')
    },

    // 选择房屋
    selectRoom (room) {
      this.room_id = room.room_id
    },

    // 加急 / 不加急
    selectUrgentStatus (val, ind) {
      this.is_urgent = val.value
    },

    // 选择服务
    selectCategory (obj) {
      console.log(obj, 'obj')
      if (obj.subItem && obj.subItem['service_id']) {
        this.source = this.sourceType.filter(item => item.label === obj.item.label)[0].value || 0
        console.log(this.source, 'this.source')
        this.biz_service_id = obj.subItem['service_id']
        this.biz_subservice_id = obj.sonItem['service_id']
        this.options = []
        this.formModel = {}
        wfeFlowInstanceLaunchForm({
          biz_service_id: obj.subItem['service_id']
          // group_id: this.groupId
        }).then(res => {
          if (res.code === 200) {
            const list = string2obj(res.data.form)
            this.formatOptions(list)
          } else {
            this.options = []
            this.$toast(res.msg || '请求出错')
          }
        })
      }
    },

    /**
     * 格式化配置
     */
    formatOptions (list) {
      // 所有code变成小写
      list.map(item => {
        item.code = item.code.toLowerCase()
        item.user_id = (this.launcher || '').replace('C#', '')
        if (this.needSplit[item.type]) {
          const instance = new this.needSplit[item.type](item, this.formModel, this.commitId, this.deviceId, this.type)
          const opts = instance.getOpts()
          opts.map(opt => {
            this.options.push(opt)
          })
        } else if (item.type === 'FwStaffOnNextNode') {
          if (item.props.scope === 4) {
            item.props.serviceId = this.biz_service_id
          }
          this.options.push(item)
        } else {
          this.options.push(item)
        }
      })
    },

    // 表单提交
    async handleSubmit () {
      console.log('--------------------------------')
      console.log(this.formModel)
      console.log('--------------------------------')

      // 判断是否有图片在上传中
      let comps = this.findChildren(this.$children)
      comps = comps.filter(item => item.$options.name === 'UploadComponent' && item.loading)
      if (comps && comps.length) {
        this.$toast('请等待图片上传完成')
        return
      }

      // 传到接口，方便查看详情的时候直接取字段 和 表单项顺序问题
      const ffl = this.options.map(item => {
        return { name: item.name, code: item.code, type: item.type, props: item.props || {} }
      })
      this.formModel.frontFormLabels = ffl
      const params = {
        from: 3, // H5员工端
        source: this.source,
        form: this.formModel,
        entry_id: this.entryId,
        is_urgent: this.is_urgent,
        biz_service_id: this.biz_service_id,
        biz_subservice_id: this.biz_subservice_id,
        launcher: this.launcher || `B#${this.userData.id}`
      }

      if (this.room_id || this.roomId) {
        params.room_id = this.room_id || this.roomId
      }

      // 如果有groupId，带到参数里
      // if (this.groupId) {
      //   params.group_id = this.groupId
      // }

      const res = await wfeFlowInstanceLaunch(params)
      if (res.code === 200) {
        this.$toast('提交成功')
        this.$emit('submit', res.data)
        return
      }
      this.$toast(res.msg || '提交失败')
    }
  }
}
</script>

<style lang="scss" scoped>
  .work {
    &-report {
      font-family: PingFangSC-Regular, PingFang SC;
      min-height: 100vh;
      min-height: calc(100vh - constant(safe-area-inset-bottom));
      min-height: calc(100vh - env(safe-area-inset-bottom));
      background: #F6F8FA;

      &-field {
        padding-top: 15px;
        padding-bottom: 15px;
        margin-top: 12px;

        &::after {
          border-bottom: 0;
        }

        &-icon {
          color: #C7C7C7;
          font-size: 15px;
        }
      }

      &-button {
        padding: 16px 34px;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }

      &-urgent {
        padding: 9px 16px;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-text {
          font-size: 14px;
          color: #333;
          line-height: 24px;
          font-weight: 400;
        }

        &-button {
          display: flex;
          align-items: center;
        }
      }

      .van-field {
        padding: 16px 15px;
      }
    }
  }
</style>
