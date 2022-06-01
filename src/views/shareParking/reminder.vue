<template>
  <div v-if="txt !== ''" class="fw-container note">
    <p>温馨提示：</p>
    <hr class="br" />
    <div v-html="txt"></div>
  </div>
</template>

<script>
import { publishTxt } from '@/api/shareparking'
export default {
  components: {

  },
  props: {
    currentPage: {
      type: String,
      default: () => ''
    },
    groupid: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      txt: ''
    }
  },
  computed: {

  },
  watch: {
    groupid (newVal) {
      this.groupid = newVal
      this.getPublishTxt(this.currentPage)
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    getPublishTxt (type) {
      publishTxt({ 'text_type': type, 'group_id': this.groupid }).then(res => {
        if (res.code === 200) {
          this.txt = res.data || ''
          return
        }
        this.$toast(res.msg)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .note {
    box-sizing: border-box;
    padding: 15px 10px 0 18px;
    color: #666666;
    font-size: 14px;
  }
</style>
<style lang="scss">
  hr.br{
    padding-bottom: 0; border:0;
  }
</style>
