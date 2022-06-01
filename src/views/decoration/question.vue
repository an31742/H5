<template>
  <div class="question main-wrap">
    <van-tabs v-model="activeName">
      <van-tab title="问题提报" name="a">
        <QuestionCom />
      </van-tab>
      <van-tab title="历史提报" name="b">
        <History />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import QuestionCom from 'views/decoration/components/questionCom'
import History from 'views/decoration/components/history'
export default {
  name: 'Question',
  components: {
    QuestionCom,
    History
  },
  data () {
    return {
      activeName: ''
    }
  }
}
</script>

<style scoped>

</style>
