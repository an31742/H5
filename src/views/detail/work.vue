<template>
  <div class="fw-container">
    <div class="list-item">
      <!--头部 - 工单号-->
      <div class="list-item-hd" >
        <div class="list-item-item">
          <label class="list-item-label ub-f1">工单号：{{ order.no }}</label>
          <div>{{ getStatusText(order.status) }}</div>
        </div>
      </div>
      <!--客诉信息-->
      <div v-if="order.appeal_order" class="list-item-bd">
        <div v-if="order.appeal_order.user_name" class="list-item-line">
          <div class="list-item-title">报事人</div>
          <div class="list-item-content">
            <p>
              {{ order.appeal_order.user_name }}
              <a v-if="order.appeal_order.user_mobile" style="padding-left: 15px;" :href="'tel:' + order.appeal_order.user_mobile">{{ order.appeal_order.user_mobile }}</a>
            </p>
          </div>
        </div>
        <div v-if="order.appeal_order.create_time" class="list-item-line">
          <div class="list-item-title">时间</div>
          <div class="list-item-content">
            <p>{{ dayjs(order.appeal_order.create_time).format('YYYY-MM-DD HH:mm:ss') }}</p>
          </div>
        </div>
        <div v-if="order.appeal_order.object_type != undefined" class="list-item-line">
          <div class="list-item-title">报事类型</div>
          <div class="list-item-content">
            <p>{{ formatType(order.appeal_order.object_type) }}</p>
          </div>
        </div>
        <template v-if="order.appeal_order.from_source === 3">
          <div v-if="order.appeal_order.detail" class="list-item-line">
            <div class="list-item-title">报警信息</div>
            <div class="list-item-content">
              <p v-html="order.appeal_order.detail"></p>
            </div>
          </div>
          <div v-if="order.appeal_order.alarm.device_serial_id" class="list-item-line">
            <div class="list-item-title">序列号</div>
            <div class="list-item-content">
              <p v-html="order.appeal_order.alarm.device_serial_id"></p>
            </div>
          </div>
          <div v-if="order.appeal_order.alarm.device_ip" class="list-item-line">
            <div class="list-item-title">摄像头IP</div>
            <div class="list-item-content">
              <p v-html="order.appeal_order.alarm.device_ip"></p>
            </div>
          </div>
          <div v-if="order.appeal_order.location" class="list-item-line">
            <div class="list-item-title">摄像头位置</div>
            <div class="list-item-content">
              <p>{{ order.appeal_order.location }}</p>
            </div>
          </div>
          <div v-if="[1,2,3].indexOf(order.status) > -1" class="list-item-line">
            <div class="list-item-title">{{ {1: '接单', 2: '维修', 3: '核验'}[order.status] }}剩余工时</div>
            <div class="list-item-content">
              <van-count-down :style="lastTime===0?'color: red;':''" :time="lastTime" format="HH 时 mm 分 ss 秒"/>
            </div>
          </div>
          <div v-if="order.pictures && order.pictures.length" class="list-item-line">
            <div class="list-item-title">报警图片</div>
            <div class="list-item-content">
              <van-image
                v-for="(img, index) in order.pictures"
                :key="index"
                :src="cosImage(img)"
                lazy-load
                fit="cover"
                @click="previewImage(order.pictures, index)"
              ></van-image>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="order.appeal_order.detail" class="list-item-line">
            <div class="list-item-title">报事内容</div>
            <div class="list-item-content">
              <p v-html="order.appeal_order.detail"></p>
            </div>
          </div>
          <div v-if="order.appeal_order.location" class="list-item-line">
            <div class="list-item-title">报事地址</div>
            <div class="list-item-content">
              <p>{{ order.appeal_order.location }}</p>
            </div>
          </div>
          <div v-if="[1,2,3].indexOf(order.status) > -1" class="list-item-line">
            <div class="list-item-title">{{ {1: '接单', 2: '维修', 3: '核验'}[order.status] }}剩余工时</div>
            <div class="list-item-content">
              <van-count-down :style="lastTime===0?'color: red;':''" :time="lastTime" format="HH 时 mm 分 ss 秒"/>
            </div>
          </div>
          <div v-if="order.pictures && order.pictures.length" class="list-item-line">
            <div class="list-item-title">报事图片</div>
            <div class="list-item-content">
              <van-image
                v-for="(img, index) in order.pictures"
                :key="index"
                :src="cosImage(img)"
                lazy-load
                fit="cover"
                @click="previewImage(order.pictures, index)"
              ></van-image>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!--分割线-->
    <div class="gradient-wrap">
      <div class="bgfff h10"></div>
      <div class="gradient-content"></div>
    </div>
    <!--工单信息-->
    <div class="list-item">
      <div class="bgfff h10"></div>
      <div class="list-item-bd">
        <div class="content">
          <div class="list-item-line noborder">
            <div class="list-item-title">当前处理人</div>
            <div class="list-item-content">
              {{ operate.current_staff.name || '-' }}
              <a v-if="operate.current_staff.mobile" style="padding-left: 15px;" :href="'tel:' + operate.current_staff.mobile"></a>
            </div>
          </div>
          <div class="list-item-line">
            <div class="list-item-title">等级</div>
            <div class="list-item-content">
              <span v-if="order.emergency_level === 1">普通</span>
              <span v-if="order.emergency_level&&order.emergency_level !==1 " :style="{color:'#FA5151'}">加急</span>
            </div>
          </div>
          <div class="list-item-line">
            <div class="list-item-title">备注</div>
            <div class="list-item-content">{{ order.description || '-' }}</div>
          </div>
          <div v-if="order.repairPictures && order.repairPictures.length" class="list-item-line">
            <div class="list-item-title">维修图片</div>
            <div class="list-item-content">
              <van-image
                v-for="(img, index) in order.repairPictures"
                :key="index"
                :src="cosImage(img)"
                lazy-load
                fit="cover"
                @click="previewImage(order.repairPictures, index)"
              ></van-image>
            </div>
          </div>
          <div v-if="order.cancel_reason && order.status === 9" class="list-item-line">
            <div class="list-item-title">中止原因</div>
            <div class="list-item-content" :style="{color:'#FA5151'}">{{ order.cancel_reason }}</div>
          </div>
          <div class="bgfff h10"></div>
        </div>
      </div>
    </div>
    <!--流转进度-->
    <div v-if="operateHis && operateHis.length" style="margin-top: 16px;">
      <p class="op-tip" style="padding-top: 5px;">处理进度</p>
      <van-steps class="bgfff" active-color="#E1AA6C" direction="vertical" :active="currentStep">
        <van-step v-for="(item, idx) in operateHis" :key="idx">
          <h3 style="font-weight: normal;font-size: 15px;">{{ item.op_desc }}</h3>
          <p v-if="item.op_time">{{ dayjs(item.op_time).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </van-step>
      </van-steps>
    </div>
    <!--相关图片-->
    <div v-if="operate.can_repair===1" style="margin-top: 16px;">
      <p class="op-tip van-cell van-cell--required" style="text-indent: 0;padding-top: 7px;padding-bottom: 0;">请上传相关图片</p>
      <div v-if="operate.can_repair" class="img-contant bgfff">
        <upload
          ref="upload"
          :max="5"
          uploadText="上传图片"
          :uploadStyle="'padding: 15px 10px 5px 5px;'"
          @change="changePictures"
        ></upload>
      </div>
    </div>
    <!--操作按钮-->
    <van-row class="fw-button-wrap" type="flex" gutter="20" justify="space-around">
      <van-col v-if="operate.can_accept===1" span="22">
        <van-button size="large" type="primary" @click="acceptOrder">接单</van-button>
      </van-col>
      <van-col v-if="operate.can_repair===1" span="22">
        <van-button size="large" type="primary" @click="repairOrder">维修完成</van-button>
      </van-col>
      <template v-if="operate.can_verify===1">
        <van-col span="12">
          <van-button size="large" class="white" type="primary" @click="checkOrder(false)">返工</van-button>
        </van-col>
        <van-col span="12">
          <van-button size="large" type="primary" @click="checkOrder(true)">检查通过</van-button>
        </van-col>
      </template>
    </van-row>

    <!--图片预览插件-->
    <van-image-preview v-model="showPreview" :images="previewImages" :startPosition="previewIndex" style="padding: 0;" @change="(num) => previewIndex = num"></van-image-preview>
  </div>
</template>

<script>
import { minipStaffOrderGet, minipStaffRepairVerifyDone, minipStaffRepairOrderDone, minipStaffAcceptOrderDone } from 'api/order'
import { minipStaffMessageRead } from 'api/message'
import upload from '@/views/components/upload'
import { dealAppeal } from '@/utils/appeal'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  name: 'WorkDetail',
  components: {
    upload
  },
  data () {
    return {
      dayjs,
      order: {},
      pictures: [],
      loading: false,
      showPreview: false,
      previewIndex: 0,
      previewImages: [],
      orderId: this.$route.query.id || '',
      msgId: this.$route.query.msgId || '',
      question: {},
      operate: {
        can_repair: false,
        can_verify: false,
        current_staff: {}
      },
      operateHis: [],
      currentTime: ''
    }
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ]),
    currentStep () {
      for (let i = 0; i < this.operateHis.length; i++) {
        const item = this.operateHis[i]
        if (!item.op_time) {
          return i - 1
        }
      }
      return this.operateHis.length - 1
    },
    lastTime () {
      // 根据当前状态展示 接单剩余工时 还是 维修剩余工时
      let startTime = this.order.dispatch_time
      let duration = this.question.response_time
      if (this.order.status === 2) {
        startTime = this.order.accept_time
        duration = this.question.process_time
      }
      if (this.order.status === 3) {
        startTime = this.order.repair_time
        duration = this.question.check_time
      }

      const currentTimeStamp = new Date(this.currentTime).getTime()
      const lastTimeStamp = new Date(startTime).getTime() + duration * 60 * 1000
      return lastTimeStamp - currentTimeStamp > 0 ? lastTimeStamp - currentTimeStamp : 0
    }
  },
  watch: {
    '$route.query.id' (val) {
      if (val && this.$route.name === 'WorkDetail') {
        this.orderId = val
        this.init()
      }
    }
  },
  activated () {
    if (!this.orderId) {
      this.$router.back()
      return
    }
    this.getOrderDetail()
    this.readMessage()
  },
  methods: {
    // 状态
    getStatusText (status) {
      if (!this.appConfig) { return '' }

      const st = (this.appConfig.DISPATCH_ORDER_STATUS || []).find(item => item.value === status)
      if (st) {
        return st.label
      } else {
        return '未知'
      }
    },
    // 消息已读
    readMessage () {
      if (this.msgId) {
        minipStaffMessageRead({ id: +this.msgId }).then(res => {
          if (res.code !== 200) {
            this.$toast(res.msg)
          }
        })
      }
    },
    // 图片列表
    changePictures (list = []) {
      this.pictures = JSON.stringify(list.map(item => item.url))
    },
    // 图片预览
    previewImage (pictures, ind) {
      if (pictures && pictures.length) {
        this.previewImages = pictures.map(img => this.cosImage(img))
        this.previewIndex = ind
        this.showPreview = true
      }
    },
    // 获取公告详情
    getOrderDetail () {
      minipStaffOrderGet({ id: this.orderId }).then(res => {
        if (res.code === 200) {
          console.log(res)
          const order = res.data || {}
          order['appeal_order'] = dealAppeal(order['appeal_order'], 'detail')
          order.update_time = dayjs(order.update_time).format('YYYY-MM-DD HH:mm:ss')
          try {
            order.pictures = JSON.parse(order['appeal_order'].pictures)
          } catch (e) {
            order.pictures = []
          }
          try {
            order.repairPictures = JSON.parse(order.repair_pictures)
          } catch (e) {
            order.repairPictures = []
          }
          this.order = order
          this.operate = res.data.operate
          this.question = res.data.question
          this.operateHis = res.data.operate_his || []
          this.currentTime = res.time.replace(/-/g, '/')
        } else {
          this.$toast(res.msg || '获取工单详情失败')
        }
      })
    },
    // 维修完成
    async repairOrder () {
      if (this.$refs.upload.loading) {
        this.$toast('请等待图片上传完成')
        return
      }

      if (!this.pictures || !this.pictures.length) {
        this.$toast('请先上传图片')
        return
      }

      this.$confirm({
        message: '确认完成维修？'
      }).then(async () => {
        const result = await minipStaffRepairOrderDone({
          repair_pictures: this.pictures,
          dispatch_order_id: this.order.id
        })
        if (result.code === 200) {
          this.$toast('操作成功')
          this.$router.push({ name: 'HomeIndex' })
        } else {
          this.$toast(result.msg || '操作失败')
        }
      }).catch(() => {})
    },
    // 确认接单
    acceptOrder () {
      this.$confirm({
        message: '确认接单？'
      }).then(() => {
        const data = {
          dispatch_order_id: this.order.id
        }
        minipStaffAcceptOrderDone(data).then(res => {
          if (res.code === 200) {
            this.$toast('操作成功')
            this.getOrderDetail()
          } else {
            this.$toast(res.msg || '操作失败')
          }
        })
      }).catch(() => {})
    },
    // 验证完成
    async checkOrder (flag) {
      this.$confirm({
        message: '确认' + (flag ? '检查通过' : '返工') + '？'
      }).then(async () => {
        const result = await minipStaffRepairVerifyDone({
          is_ok: flag,
          dispatch_order_id: this.order.id
        })
        if (result.code === 200) {
          this.$toast('操作成功')
          this.$router.push({ name: 'HomeIndex' })
        } else {
          this.$toast(result.msg || '操作失败')
        }
      }).catch(() => {})
    },
    // 客诉类型
    formatType (type) {
      let res = []
      const list = this.appConfig.APPEAL_TYPE_LOCATION || []
      list.forEach(item => {
        res = res.concat(item['object_type'] || [])
      })
      const item = res.filter(item => item.value === Number(type))

      return item[0] ? item[0].label : '-'
    }
  }
}
</script>

<style lang="scss" scoped>
  .img-contant {
    .van-uploader__wrapper {
      display: flex;
      justify-content: space-between;
      .van-uploader__preview-image, .van-uploader__upload {
        width: 1.9rem !important;
        height: 1.9rem !important;
      }
    }
  }
  .fw-container {
    margin: 16px 16px 0;
    .card-content {
      box-shadow: none;
      margin: 0;
    }
    .card-item {
      margin-bottom: 0;
    }
    .op-tip {
      font-size: 12px;
      color:#BC8D58;
      line-height: 17px;
      text-indent: 16px;
      padding-bottom: 7px;
    }
    .hrc {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #F8F8F8;
    }
    .hrc.bl {
      left: 0;
      bottom: 0;
      border-radius: 0 10px 0 0;
      border-top: 1px solid #F8F8F8;
      border-right: 1px solid #F8F8F8;
    }
    .hrc.br {
      right: 0;
      bottom: 0;
      border-radius: 10px 0 0 0;
      border-top: 1px solid #F8F8F8;
      border-right: 1px solid #F8F8F8;
    }
    .hrc.tl {
      left: 0;
      top: 0;
      border-radius: 0 0 10px 0;
      border-top: 1px solid #F8F8F8;
      border-right: 1px solid #F8F8F8;
    }
    .hrc.tr {
      right: 0;
      top: 0;
      border-radius: 0 0 0 10px;
      border-top: 1px solid #F8F8F8;
      border-right: 1px solid #F8F8F8;
    }
    .line {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      margin: 0 20px;
    }
    .view-img{
      display: inline-block;
      background-image: url(~@/assets/view.png);
      background-size: cover;
      width: 20px;
      height: 15px;
    }
    .arrow-right{
      margin-left: 6px;
      display: inline-block;
      background-image: url(~@/assets/arrow.png);
      background-size: cover;
      width: 8px;
      height: 15px;
    }
    .van-cell::after {
      border-bottom: none;
    }
  }
</style>
