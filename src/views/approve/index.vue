<template>
  <div v-if="!loading && statisData" class="approve">
    <!-- 发起申请 -->
    <p class="approve-title">发起申请</p>
    <div class="approve-content">
      <div class="approve-item" @click="$router.push({name: 'ApproveTemplate'})">
        <van-image round class="approve-icon" :src="require('@/assets/image/approve/faqi.png')" />
        <span class="approve-text">发起申请</span>
      </div>
    </div>
    <!-- 我的审批 -->
    <p class="approve-title">我的审批</p>
    <div class="approve-content">
      <div class="approve-item" @click="$router.push({name: 'PendingApprove'})">
        <van-image round class="approve-icon" :src="require('@/assets/image/approve/daishen.png')" />
        <span class="approve-text">待我审批</span>
        <span v-if="statisData.todo_total" class="approve-tag">{{ statisData.todo_total }}</span>
      </div>
      <div class="approve-item" @click="$router.push({name: 'CCMeApprove'})">
        <van-image round class="approve-icon" :src="require('@/assets/image/approve/chaosong.png')" />
        <span class="approve-text">抄送我的</span>
        <span v-if="statisData.cc_total" class="approve-tag">{{ statisData.cc_total }}</span>
      </div>
      <div class="approve-item" @click="$router.push({name: 'MyApproved'})">
        <van-image round class="approve-icon" :src="require('@/assets/image/approve/yishen.png')" />
        <span class="approve-text">我已审批</span>
        <span v-if="statisData.done_total" class="approve-tag">{{ statisData.done_total }}</span>
      </div>
    </div>
    <!-- 我申请的 -->
    <p class="approve-title">我申请的</p>
    <div class="approve-content">
      <div class="approve-item" @click="$router.push({name: 'MyApply'})">
        <van-image round class="approve-icon" :src="require('@/assets/image/approve/shenqing.png')" />
        <span class="approve-text">我申请的</span>
        <span v-if="statisData.apply_total" class="approve-tag">{{ statisData.apply_total }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { instanceListStatis } from '@/api/approve'

export default {
  name: 'Appreove',
  data () {
    return {
      loading: false,
      statisData: null
    }
  },
  created () {
    this.getInstanceListStatis()
  },
  methods: {
    getInstanceListStatis () {
      this.loading = true
      instanceListStatis().then(res => {
        this.loading = false
        if (res.code === 200) {
          this.statisData = res.data
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .approve {
    height: 100vh;
    background: #F6F8FA;

    &-title {
      padding: 12px 16px 4px;
      box-sizing: border-box;
      font-size: 12px;
      color: #999;
      font-weight: 400;
      line-height: 16px;
    }

    &-content {
      padding: 16px 50px;
      box-sizing: border-box;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    &-icon {
      width: 55px;
      height: 55px;
    }

    &-text {
      font-size: 14px;
      color: #333;
      font-weight: 400;
      line-height: 20px;
      margin-top: 8px;
    }

    &-tag {
      background: linear-gradient(180deg, #FD8989 0%, #FF6464 100%);
      border-radius: 10px;
      font-size: 12px;
      line-height: 16px;
      padding: 2px 8px;
      box-sizing: border-box;
      color: #fff;
      position: absolute;
      right: -6px;
      top: -6px;
      display: block;
    }
  }
</style>
