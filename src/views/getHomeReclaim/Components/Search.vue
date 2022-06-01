<template>
  <form action="/">
    <van-search
      v-model="value"
      ref="search"
      shape="round"
      background="#fff"
      placeholder="请输入订单编号/姓名/手机号搜索"
      :readonly="isReadonly"
      :show-action="!isReadonly"
      @click="toSearchPage"
      @input="userInput"
      @search="onSearch"
      @cancel="onCancel"
      @clear="userClear"
    />
    <!-- 搜索提示 -->
    <van-overlay
      v-if="!isReadonly && values.length > 0"
      :custom-style="{top: topValue}"
      :show="show"
      @click="show = false"
    >
      <ul class="list">
        <li class="list__label">共{{ values.length }}条信息</li>
        <li v-for="item in values" :key="item.orderId" v-html="item.text" @click="getUserOrderList(item.userId)"></li>
      </ul>
    </van-overlay>
  </form>
</template>

<script>
import { homeReclaim } from '@/utils/const.js'
import { getAppraisalList, getReclaimList } from 'api/getHomeReclaim'
import { fen2yuan, phoneEncryption } from '@/utils'
export default {
  name: 'SearchOrder',
  props: {
    isReadonly: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: '',
      show: false,
      // 搜索提示的位置
      topValue: '',
      values: [],
      timer: null
    }
  },
  // 计算属性
  computed: {
    typeList () {
      return this.appConfig.ESTIMATE_GOODS_CATEGORY_LIST || [
        {
          label: '手机&3C',
          value: 1
        },
        {
          label: '家电',
          value: 2
        }
      ]
    }
  },
  mounted () {
    if (this.isReadonly) return
    this.$nextTick(() => {
      this.setTopValue()
    })
  },
  methods: {
    // 刷新组件
    deepReload () {
      this.value = ''
      this.values = []
    },
    // 设置搜索提示的顶部偏移量
    setTopValue () {
      const dom = this.$refs?.search
      const clientHeight = dom?.clientHeight ?? 0
      this.topValue = `${clientHeight}px`
    },
    // 组合提示结果
    setTipsValue () {
      if (!this.values.length) return
      this.values.forEach((item) => {
        const { address = '', userName = '', phoneNumber = '' } = item
        let text = ''
        address && (text = `${text}<p>${this.updatetext(address, this.value)}</p>`)
        userName && (text = `${text}<p>${this.updatetext(userName, this.value)}</p>`)
        phoneNumber && (text = `${text}<p>${this.updatetext(phoneNumber, this.value)}</p>`)
        item.text = text
      })
      this.values = this.values.filter(item => !!item.text)
      if (this.values.length) this.setTipsShow()
    },
    updatetext (text, val) {
      return text.replace(new RegExp(val, 'g'), `<span class="high-light">${val}</span>`)
    },
    userInput (val) {
      if (!val) {
        this.setTipsHide()
        return
      }
      this.getDataList(true)
    },
    onSearch (val) {
      if (val) this.getDataList()
    },
    onCancel () {
      this.setTipsHide()
      this.$router.back()
    },
    userClear () {
      this.setTipsHide()
    },
    setTipsShow () {
      this.show = true
    },
    setTipsHide () {
      this.show = false
    },
    toSearchPage () {
      if (!this.isReadonly) return
      this.$router.push({
        name: 'ReclaimSearchList',
        query: {
          type: this.type
        }
      })
    },
    getUserOrderList (userId) {
      if (homeReclaim.evaluation === this.type || homeReclaim.valet === this.type) this.getAppraisalList(false, userId)
      if (homeReclaim.reclaim === this.type) this.getReclaimList(false, userId)
    },
    getDataList (isInput = false) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        if (homeReclaim.evaluation === this.type || homeReclaim.valet === this.type) this.getAppraisalList(isInput)
        if (homeReclaim.reclaim === this.type) this.getReclaimList(isInput)
        clearTimeout(this.timer)
        this.timer = null
      }, 500)
    },
    // 获取估价单
    getAppraisalList (isInput = false, userId = 0) {
      const data = {
        page: 1,
        page_size: 1000,
        self_submit: homeReclaim.valet === this.type
      }
      if (userId) {
        data.user_id = userId
      } else {
        data.name_or_address_or_order_no = this.value
      }
      getAppraisalList(data).then((res) => {
        if (res.code !== 200) return
        const list = res.data?.list ?? []
        if (!isInput) {
          list.forEach(i => {
            i.title = this.typeList.find(e => e.value === i.goods_category).label
            i.type = this.updateEvaluationType(i.status).text
            i.statusLabel = this.updateEvaluationType(i.status).label
            i.appraisal && (i.appraisalText = `¥${fen2yuan(i.appraisal)}`)
            i.consumer_name && (i.desc = `<span style="color: #E1AA6C">${i.consumer_name} ${phoneEncryption(i.consumer_mobile)}</span>`)
          })
          this.$emit('setDataList', list)
          this.setTipsHide()
          return
        }
        this.computedValues(list)
      }).catch(() => {})
    },
    // 获取回收订单
    getReclaimList (isInput = false, userId = 0) {
      const data = {
        page: 1,
        page_size: 1000
      }
      if (userId) {
        data.user_id = userId
      } else {
        data.name_or_address_or_order_no = this.value
      }
      getReclaimList(data).then((res) => {
        if (res.code !== 200) return
        const list = res.data?.list ?? []
        if (!isInput) {
          list.forEach(i => {
            i.title = i.room_name || ''
            i.type = i.status + ''
            i.statusLabel = this.updateReclaimType(i.status).label
            i.appraisal && (i.appraisalText = `¥${fen2yuan(i.appraisal)}`)
            i.dealAmount = i.face_user_price && `¥${fen2yuan(i.face_user_price)}` || ''
            i.consumer_name && (i.desc = `<span style="color: #E1AA6C">${i.consumer_name} ${phoneEncryption(i.consumer_mobile)}</span>`)
          })
          this.$emit('setDataList', list)
          this.setTipsHide()
          return
        }
        this.computedValues(list)
      }).catch(() => {})
    },
    // 计算提示数据
    computedValues (list) {
      this.values = list.map((i) => {
        return {
          orderId: i.order_id,
          userId: i.consumer_id,
          address: i.room_name,
          userName: i.consumer_name || '',
          phoneNumber: phoneEncryption(i.consumer_mobile),
          text: ''
        }
      })
      this.setTipsValue()
    },
    updateReclaimType (orderStatus) {
      const types = [
        {
          label: '待取件',
          key: 1
        },
        {
          label: '待报价',
          key: 2
        },
        {
          label: '待确认',
          key: 3
        },
        {
          label: '待支付',
          key: 4
        },
        {
          label: '已完成',
          key: 5
        },
        {
          label: '已取消',
          key: 6
        }
      ]
      const it = types.find(i => i.key === orderStatus)
      return it
    },
    updateEvaluationType (orderStatus) {
      const evaluateTypes = [
        {
          text: homeReclaim.STATUS_NO_EVALUATE,
          label: '待估价',
          key: 1
        },
        {
          text: homeReclaim.STATUS_EVALUATE,
          abel: '已估价',
          key: 2
        },
        {
          text: homeReclaim.EVALUATION_STATUS_END,
          label: '已完成',
          key: 3
        },
        {
          text: homeReclaim.EVALUATION_STATUS_CANCEL,
          label: '已取消',
          key: 4
        }
      ]
      const valetTypes = [
        {
          text: homeReclaim.STAFF_STATUS_NO_EVALUATE,
          label: '估价单',
          key: 1
        },
        {
          text: homeReclaim.STAFF_STATUS_EVALUATE,
          label: '估价单',
          key: 2
        },
        {
          text: homeReclaim.STAFF_EVALUATION_STATUS_END,
          label: '已提单',
          key: 3
        },
        {
          text: homeReclaim.STAFF_EVALUATION_STATUS_CANCEL,
          label: '估价单',
          key: 4
        }
      ]
      const types = homeReclaim.evaluation === this.type ? evaluateTypes : valetTypes
      const it = types.find(i => i.key === orderStatus)
      return it
    }
  }
}
</script>

<style lang="scss" scoped>
  @mixin ellipsis() {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ::v-deep .van-search {
    .van-cell {
      background-color: #f5f5f5;
      border-radius: inherit;
    }
  }
  .list {
    background-color: #fff;
    padding: 0px 16px;
    max-height: 80%;
    overflow-y: scroll;
    li {
      height: 52px;
      line-height: 52px;
      border-bottom: 1px solid #EEE;
      display: flex;
      align-items: center;
      font-size: 15px;
    }
    .list__label {
      color: #999;
      text-align: right;
      display: inline-block;
      width: 100%;
    }
  }
  ::v-deep .list li p:not(:last-child) {
    margin-right: 8px;
  }
  ::v-deep .list li p:first-child {
    flex: 1;
    @include ellipsis()
  }
  ::v-deep .list li p:nth-child(2) {
    flex: none;
  }
  ::v-deep .list li p:last-child {
    @include ellipsis()
  }
  ::v-deep .list li .high-light {
    color: #BC8D58;
  }
</style>
