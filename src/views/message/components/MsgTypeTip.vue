<template>
  <div class="msg-type-tip" :class="data.class">
    {{ data.text }}
  </div>
</template>

<script>
export default {
  name: 'MsgTypeTip',
  props: {
    noticeType: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      text: '',
      class: ''
    }
  },
  computed: {
    data () {
      const _data = {}
      // [
      //   { 'label': '系统消息', 'value': 1 },
      //   { 'label': '通知公告', 'value': 2 },
      //   { 'label': '调查问卷', 'value': 3 },
      //   { 'label': '工单消息', 'value': 4 },
      //   { 'label': '员工公告', 'value': 5 },
      //   { 'label': '审批流消息', 'value': 6 }
      //   { 'label': '上门回收', 'value': 18 }
      // ]
      switch (Number(this.noticeType)) {
        case 1:
          _data.text = '系统消息'
          _data.class = 'msg-type-tip-sys'
          break
        case 2:
          _data.text = '通知公告'
          _data.class = 'msg-type-tip-notice'
          break
        case 3:
          _data.text = '调查问卷'
          _data.class = 'msg-type-tip-questionnaire'
          break
        case 4:
          _data.text = '工单消息'
          _data.class = 'msg-type-tip-work'
          break
        case 5:
          _data.text = '员工公告'
          _data.class = 'msg-type-tip-employee'
          break
        case 6:
          _data.text = '审批流消息'
          _data.class = 'msg-type-tip-work'
          break
        case 18:
          _data.text = '上门回收'
          _data.class = 'msg-type-tip-work'
          break
        case 16:
          _data.text = 'EBA消息'
          _data.class = 'msg-type-tip-notice'
          break
        default:
          _data.text = '无此类型'
          _data.class = 'msg-type-tip-notice'
          break
      }
      return _data
    }
  }
}
</script>

<style type="text/css" lang="scss" scoped>
.msg-type-tip{
  display: inline-block;
  height: 15px;
  font-size: 11px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 15px;
  word-wrap: none;
  text-align: center;
  border-radius: 2px;
   padding: 4px 4px;
}
.msg-type-tip-notice{
  color: #F56B6D;
  background: #FEF0F0;
}
::v-deep.msg-type-tip-questionnaire{
  color:#36C2C2;
  background: #E6FFFB;
}
::v-deep.msg-type-tip-auto {
  color:#E6A23E;
  background: #FDF6EC;
}
::v-deep.msg-type-tip-sys {
  color:#46A1FF;
  background:#ECF5FF;
}
::v-deep.msg-type-tip-work{
  color: #6FC544;
  background: #F0F9EB;
}
::v-deep.msg-type-tip-employee {
  color:#36C2C2;
  background: #E6FFFB;
}
</style>
