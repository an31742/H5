<template>
  <div>
    <van-circle
      v-model="currentRate"
      :rate="30"
      :speed="100"
      :text="text"
      :stroke-width="120"
      :color="gradientColor"
      :clockwise="false"
      layer-color="#E3EDFC"
      :size="108"
    />
    <van-progress
      :percentage="90"
      color="#F7B500"
      stroke-width="10"
      pivot-text=""
    />
  </div>
</template>

<script>
export default {
  name: 'QualityDetail',
  data () {
    return {
      gradientColor: {
        '0%': '#68A1FF',
        '100%': '#3768FD'
      },
      currentRate: 0
    }
  },
  computed: {
    text () {
      return this.currentRate.toFixed(0) + '%' + '完成率'
    }
  }
}
</script>

<style scoped lang="less">

</style>
