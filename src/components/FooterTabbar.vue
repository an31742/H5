<template>
  <van-tabbar v-model="activeTab" safe-area-inset-bottom :z-index="999" active-color="#BC8D58">
    <van-tabbar-item v-for="(item, index) in tabs" :key="index" :name="item.name" replace :to="{name: item.name}">
      <!-- <div v-if="item.label === '打卡'">
        <img :src="require('@/assets/image/clock-in.png')" alt="" width="40">
      </div> -->

      <span v-if="item.label !== '打卡'">{{ item.label }}</span>

      <template v-if="item.label !== '打卡'" #icon="props">
        <svg-icon :icon-class="props.active ? item.activeIcon : item.icon "/>
        <span
          v-if="item.name === 'Message' && noticeNum"
          class="notice-badge"
        >
          {{ noticeNum }}
        </span>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'FooterTabbar',
  data () {
    return {
      activeTab: this.$route.matched[0].name || this.$route.name,
      tabs: [
        // { label: '打卡', name: 'CheckOn', icon: 'check-p', activeIcon: 'check-p-active' },
        { label: '工作台', name: 'WorkBench', icon: 'work-p', activeIcon: 'work-p-active' },
        { label: '消息', name: 'Message', icon: 'chat-p', activeIcon: 'chat-p-active' },
        { label: '我的', name: 'Center', icon: 'user-p', activeIcon: 'user-p-active' }
      ]
    }
  },
  computed: {
    ...mapState({
      noticeNum: state => state.message.all_unread_num
    })
  },
  watch: {
    '$route.name' (val) {
      this.activeTab = this.$route.matched[0].name || val
    }
  },
  mounted () {
    // 更新消息数量
    this.$store.dispatch('message/updateMessageStatistics')
  },
  methods: {
    handleNums (num) {
      return num > 99 ? '99+' : num
    }
  }
}
</script>

<style lang="scss" scoped>
  .notice-badge {
    min-width: 17px;
    height: 17px;
    padding: 0 2px;
    box-sizing: border-box;
    border-radius: 8px;
    background: -webkit-linear-gradient(#FD8989, #FF6464);
    color: #fff;
    font-size: 10px;
    display: block;
    text-align: center;
    line-height: 17px;
    margin-left: 4px;
    position: absolute;
    right: -13px;
    top: -8px;
    z-index: 100;
  }
</style>
