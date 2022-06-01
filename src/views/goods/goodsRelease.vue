<!--
  功能：物品放行申请
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2022年03月28日 15:07:17
-->
<template>
  <div class="release">
    <div class="release-title custom-border">
      <div class="release-title_no">
        <span>申请编号：</span>
        <span>{{ detail.property_pass_no }}</span>
      </div>
      <div>{{ status }}</div>
    </div>
    <van-form class="release-group">
      <homeNumber
        :disabled="globalDisabled"
        :roomText="detail.room_name"
        :roomId="detail.room_id"
      />
      <van-field
        v-model="detail.apply_user_name"
        name="apply_user_name"
        label="申请人"
        placeholder="请输入申请人姓名"
        input-align="right"
        :readonly="globalDisabled"
      />
      <van-field
        v-model="detail.phone"
        :readonly="globalDisabled"
        name="phone"
        label="联系电话"
        placeholder="请输入联系电话"
        input-align="right"
      />
      <van-field
        v-model="detail.card_id"
        :readonly="globalDisabled"
        name="card_id"
        label="身份证号"
        placeholder="请输入身份证号"
        input-align="right"
      />
      <van-field
        v-model="detail.plate_no"
        :readonly="globalDisabled"
        name="plate_no"
        label="车牌号"
        placeholder="请输入车牌号"
        input-align="right"
      />
      <planDate
        :disabled="globalDisabled"
        :passTime="detail.plan_pass_time"
      />
      <van-field
        v-model="detail.apply_reason"
        :readonly="globalDisabled"
        :maxlength="30"
        name="apply_reason"
        label="申请原因说明"
        placeholder="请输入申请原因说明，30字以内"
        input-align="right"
      />
      <authorization
        class="custom-border"
        :disabled="globalDisabled"
        :url="detail.authorization"
        :templateUrl="authorizationTemplate"
      />
      <goodsList
        :disabled="globalDisabled"
        :propertys="detail.goods"
      />
      <div class="fixed-bottom release-button">
        <van-button
          v-if="editId && detail.status === 4"
          round
          type="primary"
          color="#E1AA6C"
          class="release-button-right"
          @click="onAuditPass"
        >放行</van-button>
        <!-- <van-button></van-button> -->
      </div>
    </van-form>
    <van-popup
      v-model="rejectShow"
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: popupHeight }"
    >
      <div v-if="detail.status === 3">
        <span class="release-popup-title">驳回原因</span>
        <p class="release-popup-content">{{ reason }}</p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { addGoodsPass, getPassDetail, getPassList, setPassRevoke, updatePass, auditPass } from 'api/apply'
export default {
  // 组件名称
  name: 'GoodsRelease',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {
    homeNumber: () => import('./components/releaseComponents/homeNumber.vue'),
    planDate: () => import('./components/releaseComponents/planDate.vue'),
    authorization: () => import('./components/releaseComponents/authorization.vue'),
    goodsList: () => import('./components/releaseComponents/goodsList.vue')
  },
  // 组件状态值
  data () {
    return {
      globalDisabled: false,
      detail: {
        property_pass_no: '', // 编号
        apply_user_name: '',
        phone: '',
        card_id: '',
        plate_no: '',
        plan_pass_time: '',
        apply_reason: '',
        authorization: '',
        goods: [],
        status: 0
      },
      authorizationTemplate: '',
      editId: Number(this.$route.query.order_id || ''),
      rejectShow: false,
      isEditStatus: false,
      sourceType: this.$route.query.sourceType || ''
    }
  },
  // 计算属性
  computed: {
    status () {
      if (!this.editId) return '待创建'
      if (!this.detail.status) return ''
      const item = this.appConfig.property_pass_status_type.find(i => i.value === this.detail.status)
      return item.label || ''
    },
    reason () {
      if (this.detail.status !== 3) return ''
      const records = this.detail.handling_records
      const item = records.find(i => i.handler_status === 3)
      return (item && item.handler_remark) || ''
    },
    showQrcode () {
      return [4, 5, 8].includes(this.detail.status)
    },
    popupHeight () {
      return this.detail.status === 3 ? '40%' : this.showQrcode ? '80%' : ''
    }
  },
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    onAuditPass () {
      auditPass({
        pass_id: this.editId
      }).then(res => {
        if (res.code === 200) {
          this.$toast.success(`放行成功`)
          this.$router.back()
        }
      })
    },
    onRevoke () {
      setPassRevoke({ id: this.editId }).then(res => {
        if (res.code === 200) {
          this.$toast('撤销成功，可再次提交申请。')
          this.editId = 0
          this.detail.status = 0
          this.$router.replace({ name: 'ApplyGoodsRelease' })
          this.init()
        }
      })
    },
    onEdit () {
      this.globalDisabled = false
      this.isEditStatus = true
      this.time = new Date().getTime()
    },
    checkSubmit (val) {
      this.mixinClick(() => {
        this.fromSubmit(val)
      }, ['login', 'room'])
    },
    fromSubmit (val) {
      // hook: native-type="submit"的按钮通过v-if切换显示，会触发submit，所以，判断是切换的就不提交数据。
      this.currentTime = new Date().getTime()
      if (this.currentTime - this.time < 1000) return
      delete val['undefined']
      const params = {
        ...val,
        property_pass_no: this.detail.property_pass_no,
        is_approve: 0
      }
      params.goods = JSON.parse(params.goods)
      params.goods.forEach(element => {
        element.num = Number(element.num)
      })
      if (this.editId) {
        updatePass({ ...params, id: Number(this.editId) }).then(res => {
          if (res.code === 200) {
            this.$toast('编辑成功')
            this.init()
          }
        })
      } else {
        addGoodsPass(params).then(res => {
          if (res.code === 200) {
            this.$toast('提交成功')
            this.editId = res.data
            this.init()
            this.$router.replace({
              name: 'ApplyGoodsRelease',
              query: {
                order_id: res.data
              }
            })
          }
        }).catch((e) => {
          console.log(e)
        })
      }
    },
    getPassNo () {
      // getPassNo().then(res => {
      //   this.detail.property_pass_no = res.data.property_pass_no
      //   this.authorizationTemplate = res.data.authorization
      // })
    },
    getPassDetail () {
      getPassDetail({ id: this.editId }).then((res) => {
        if (res.code !== 200) {
          this.$toast(res.data.message || res.data.msg || '获取放行详情失败')
          return
        }
        if (res.data.code && res.data.code !== 200) {
          this.$toast(res.data.message || res.data.msg || '获取放行详情失败')
          return
        }
        const { status } = res.data.property_pass
        if (status <= 0) return
        this.detail = res.data.property_pass
        this.detail.property_pass_no = res.data.property_pass.no
        this.detail.goods = res.data.goods
        this.detail.handling_records = res.data.handling_records
      })
    },
    getPassList () {
      getPassList({
        page: 1,
        page_size: 20,
        is_owner: 1
      }).then(res => {
        console.log('getPassList', res)
      })
    },
    init () {
      if (this.editId) {
        this.globalDisabled = true
        this.getPassDetail()
      }
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 在实例初始化之后，组件属性计算之前，如data属性等
  */
  beforeCreate () {
  },
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  */
  created () {
    // this.getPassList()
    this.init()
  },
  /**
  * 在挂载开始之前被调用：相关的 render 函数首次被调用。
  */
  beforeMount () {
  },
  /**
  * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
  */
  mounted () {
  },
  /**
  * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
  * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
  */
  beforeUpdate () {
  },
  /**
  * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
  * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
  */
  updated () {
  },
  /**
  * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
  */
  activated () {
  },
  /**
  * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
  */
  deactivated () {
  },
  /**
  * 实例销毁之前调用。在这一步，实例仍然完全可用。
  */
  beforeDestroy () {
  },
  /**
  * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
  * 所有的事件监听器会被移除，所有的子实例也会被销毁。
  */
  destroyed () {
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    div, span img, p, ul, li {
      box-sizing: border-box;
    }
  }
  .release {
    padding-top: 55px;
    box-sizing: border-box;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 84px); //兼容IOS < 11.2
    padding-bottom: calc(env(safe-area-inset-bottom) + 64px);//兼容IOS > 11.2
    background: #F8F9FA;
    &-title {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      background-color: #fff;
      box-shadow: 0 8px 10px #ebedf0;
      height: 55px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 16px;
      &_no {
        font-size: 14px;
      }
    }
    &-group {
      padding-left: 16px;
      padding-right: 16px;
      background: #fff;
      ::v-deep {
        .van-cell--required::before {
          left: -0px;
        }
      }
    }
    .release-button {
      // border: 1px solid red;
      background-color: #fff;
      width: 100%;
      box-sizing: border-box;
      padding: 10px 16px 10px 16px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      &-left {
        flex: 1;
        margin-right: 15px;
      }
      &-right {
        flex: 1;
      }
    }
    .release-popup-title {
      display: block;
      padding: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 800;
      font-size: 18px;
    }
    .release-popup-content {
      padding: 5px 16px 16px 16px;
      text-indent: 34px;
      letter-spacing: 1;
    }
    .release-popup-qrcode {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    ::v-deep .van-popup__close-icon--top-right {
      right: 10px;
      position: absolute;
      font-size: 20px;
      text-align: center;
      color: #999;
      background: #fff;
      font-weight: normal;
      padding: 0;
    }
  }
  .custom-border {
    border-bottom: 1px solid #eeeeee;
  }
</style>
