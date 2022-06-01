<!--
  功能：估价详情页__提交信息
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月25日 18:55:35
-->
<template>
  <div class="edit">
    <van-form
      :show-error="false"
      @submit="onSubmit"
    >
      <van-field
        v-model="customer"
        readonly
        required
        class="edit-item"
        label="客户信息:"
        name="customer"
        right-icon="arrow"
        placeholder="请选择客户信息"
        :rules="[{ required: true, message: '请选择客户信息' }]"
        @click="selectCustomer"
      />
      <van-field
        v-model="address"
        required
        class="edit-item"
        label="取件地址:"
        name="address"
        placeholder="请填写取件地址"
        :show-error="false"
        :rules="[{ required: true, message: '请填写取件地址' }]"
      />
      <van-field
        readonly
        class="edit-item"
        label="回收金额抵扣物业费"
        name="property_deduction"
      >
        <template #input>
          <van-checkbox
            v-model="propertyDeduction"
            shape="square"
            checked-color="#E1AA6C"
          ></van-checkbox>
        </template>
      </van-field>
      <van-field
        readonly
        class="edit-item bdn"
        label="允许管家代确认"
        name="allow_butler_confirm"
      >
        <template #input>
          <van-checkbox
            v-model="allowButlerConfirm"
            shape="square"
            checked-color="#E1AA6C"
          ></van-checkbox>
        </template>
      </van-field>
      <div class="fixed-bottom edit-submit">
        <van-button
          plain
          round
          block
          class="edit-submit__button"
          color="#E1AA6C"
          native-type="button"
          @click.stop="cancel"
        >取消</van-button>
        <van-button
          round
          block
          class="edit-submit__button"
          color="#E1AA6C"
          native-type="submit"
        >提交订单</van-button>
      </div>
    </van-form>
    <search-custom :showSheet="showSheet" @closed="closed" @setCustom="setCustom" />
  </div>
</template>

<script>
import { setAppraisal } from 'api/getHomeReclaim'
import { homeReclaim } from 'utils/const'
import { Dialog } from 'vant'
export default {
  // 组件名称
  name: 'EditInfo',
  // 局部注册的组件
  components: {
    SearchCustom: () => import('./SearchCustom.vue')
  },
  // 组件状态值
  data () {
    return {
      customer: '',
      address: '',
      propertyDeduction: false,
      allowButlerConfirm: false,
      roomList: [],
      showSheet: false
    }
  },
  computed: {
    orderId () {
      return this.$route.query.order_id && Number(this.$route.query.order_id) || 0
    }
  },
  // 组件方法
  methods: {
    closed () {
      this.showSheet = false
    },
    setCustom (val) {
      this.customer = val.user_name
      this.address = val.room_name
      this.userId = val.user_id
      this.closed()
    },
    selectCustomer () {
      this.showSheet = false
      this.showSheet = true
    },
    onSubmit (e) {
      this.setAppraisal({
        user_id: this.userId,
        room_name: this.address,
        property_deduction: Number(e.property_deduction) + 1,
        allow_butler_confirm: Number(e.allow_butler_confirm) + 1,
        status: 3
      })
    },
    cancel () {
      Dialog.confirm({
        title: '提示',
        message: '您要取消此估价单吗',
        confirmButtonColor: '#E1AA6C'
      }).then(() => {
        this.setAppraisal({
          status: 4
        })
      }).catch(() => {})
    },
    // 提交订单or取消
    setAppraisal (data = {}) {
      setAppraisal({
        estimate_order_id: this.orderId,
        ...data
      }).then(res => {
        if (res.code !== 200) return
        if (data.status === 3) {
          this.toAddSuccess(res.data?.order_id ?? 0)
          this.$store.dispatch('getHomeReclaim/setUpdateListData', {
            pageType: homeReclaim.valet,
            orderId: this.orderId,
            deleteItem: true
          })
        }
        this.$emit('refreshDetail')
      }).catch(() => {})
    },
    toAddSuccess (orderId) {
      this.$router.replace({
        name: 'AddSuccess',
        query: {
          order_id: orderId,
          type: homeReclaim.reclaim
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .edit-item {
    padding-left: 0;
    padding-right: 0;
    .van-field__label {
      width: auto;
    }
    .van-field__control--custom {
      display: flex;
      justify-content: flex-end;
    }
  }
  ::v-deep .van-cell--required::before {
    left: -8px;
  }
  ::v-deep .van-button__text {
    font-size: 16px;
  }
  .edit {
    margin-top: 8px;
    padding: 0px 15px;
    background-color: #fff;
    .edit-submit {
      padding: 0 16px;
      width: 100%;
      height: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FFFFFF;
      border-top: 1px solid #F1F1F1;
      .edit-submit__button {
        width: 165px;
      }
    }
  }
</style>
