<template>
  <div class="fw-container">
    <div style="margin-top: 0.42667rem">
      <div v-if="form.cover_image" class="item-card-img">
        <img :src="form.cover_image" alt="" srcset="">
      </div>
      <div class="item-card">
        <div class="header">
          <span class="title one-line-dot ">
            {{ form.title }}
          </span>
          <tip v-if="form.content_type" :noticeType="form.content_type"/>
        </div>
        <div class="footer">
          {{ dayjs(form.create_time).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
        <div class="content" v-html="form.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tip from './components/MsgTypeTip'
import dayjs from 'dayjs'
import { minipNoticeGet } from 'api/messageV2'

// const UserApplyType = {
//   '1': 'UserApplyTypeBind',
//   '2': 'UserApplyTypeChangeFimaly',
//   '3': 'UserApplyTypeTransferRoom',
//   '4': 'UserApplyTypeTransferParking'
// }
// const TransferApplyStatusBook = 1   //已预约
// const TransferApplyStatusWaitng = 2 //已提交。待审核
// const TransferApplyStatusAgree = 3  //同意
// const TransferApplyStatusReject = 4 //拒绝

// const UserApplyTypeBind = 1 // 迁入绑定房屋
// const UserApplyTypeChangeFimaly = 2 // 租户变更家庭成员
// const UserApplyTypeTransferRoom = 3 // 变更房屋
// const UserApplyTypeTransferParking = 4 // 变更车位

// 1/2

// USER_V2_AUDIT_STATUS_INIT    = 1 // 待确认
// USER_V2_AUDIT_STATUS_APPROVE = 2 // 已确认
// USER_V2_AUDIT_STATUS_REFUSED = 3 // 已拒绝

// 3/4
// const TransferApplyStatusBook = 1   //已预约
// const TransferApplyStatusWaitng = 2 //已提交。待审核
// const TransferApplyStatusAgree = 3  //同意
// const TransferApplyStatusReject = 4 //拒绝
export default {
  name: 'Detail',
  components: {
    tip
  },
  data () {
    return {
      form: {
      }
    }
  },
  computed: {
    ...mapGetters([
      'commonInfo'
    ])
  },
  async mounted () {
    const res = await minipNoticeGet({
      id: this.$route.query.id
    })

    if (res.code === 200) {
      this.form = res.data
      this.$store.dispatch('message/minipNoticeRead', [Number(this.$route.query.id)])
    } else {
      this.$toast(res.msg)
    }
  },

  methods: {
    dayjs
  }
}
</script>

<style lang="scss" scoped>
.header{
  margin-top: 3px;
  margin-bottom: 5px;
}
.footer{
  margin-bottom: 12px;
}
.item-card-img{
  margin: 0 17px 5px 17px;
  border-radius: 4px;
  img{
    border-radius: 4px;
    width:100%
  }
}
.content{
  line-height: 26px!important;
}
</style>
