<template>
  <div class="fw-container">
    <!--    <calendar viewType="week" @click-day="clickMonth">-->
    <!--      <template slot="item-extra" slot-scope="item">-->
    <!--        <svg-icon v-if="item.data.date % 2 === 0" class="aaa" icon-class="sun-work" />-->
    <!--        <svg-icon v-else class="aaa" icon-class="night-work" />-->
    <!--      </template>-->
    <!--    </calendar>-->
    <ipt></ipt>
    <ipt></ipt>
    <ipt></ipt>
    <ipt></ipt>
    <ipt></ipt>
    <ipt></ipt>
    <ipt></ipt>
    <ipt></ipt>
  </div>
</template>

<script>
// import calendar from '../components/calendar'
import ipt from './input'
export default {
  name: 'Test1',
  components: { ipt },
  data () {
    return {
    }
  },
  mounted () {

  },
  methods: {
    clickMonth (month) {
      alert(JSON.stringify(month))
    }
  }
}
</script>

<style scoped lang="scss">
  .aaa {
    font-size: 10px;
    padding-top: 4px;
  }
</style>
