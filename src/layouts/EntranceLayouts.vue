<template>
  <div class="main-wrap">
    <van-tabs v-model="activeName" color="#ef9310">
      <van-tab
        v-for="tab in tabs"
        :key="tab.routeName"
        :title="tab.title"
        :name="tab.routeName"
        replace
        :to="{name: tab.routeName}"
      />
    </van-tabs>
    <router-view :isInGroup="isInGroup" />
  </div>
</template>
<script>
// 多tab页layout，带自动吸顶功能

// import { miniSecretStaffCheck } from '@/api/entrance'

export default {
  name: 'TabCardLayout',
  data () {
    return {
      activeName: this.$route.name,
      tabs: [
        { title: '人脸录入', routeName: 'entranceFace' },
        { title: '门禁密码', routeName: 'entrancePassword' }
      ],
      isInGroup: false
    }
  },
  watch: {
    '$route.name': {
      handler (val) {
        this.setActive()
      },
      immediate: true
    }
  },
  async created () {
    // const res = await miniSecretStaffCheck()

    // if (res.code !== 200) {
    //   this.$toast(res.msg)
    // } else {
    //   this.isInGroup = res.data.has_group
    // }

    // 去除 仅当前小区人员可录入门禁限制
    // 默认为 均可添加
    this.isInGroup = true
  },
  mounted () {
    this.setActive()
  },
  methods: {
    onClick (name, title) {
      console.log('onClick', name, title)
    },
    setActive () {
      const val = this.$route.name
      if (val.indexOf('Face') > -1) {
        this.activeName = 'entranceFace'
      } else {
        this.activeName = 'entrancePassword'
      }
    }
  }
}
</script>
