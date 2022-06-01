<!--
  功能：估价单--提交人信息
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年12月06日 15:16:57
-->
<template>
  <div class="submitter">
    <p>提交渠道：{{ submitterType === 1 ? '业主提交' : '代客提单' }}</p>
    <p>提交人：{{ submitterName }} {{ submitterMobile }}</p>
    <p>提交时间：{{ createTime }}</p>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'Submitter',
  // 组件参数 接收来自父组件的数据
  props: {
    submitterType: {
      type: Number,
      default: 0
    },
    submitterName: {
      type: String,
      default: ''
    },
    submitterMobile: {
      type: String,
      default: ''
    },
    createTime: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .submitter {
    margin-top: 8px;
    padding: 0px 15px;
    background-color: #fff;
    border: 1px solid #fff;
    p {
      margin-top: 8px;
      font-size: 15px;
      color: #333;
      line-height: 23px;
    }
    p:last-child {
      margin-bottom: 8px;
    }
  }
</style>
