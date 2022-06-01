<template>
  <div class="approve">
    <p class="approve-title">全部功能</p>
    <div class="approve-content">
      <div class="approve-item" v-permission="['FPMS_MENU_CODE_H5_YI_JIE_SHU']" @click="$router.push({name: 'MaterialsEnd'})">
        <van-image round class="approve-icon" :src="require('@/assets/image/materials/yijieshu.png')" />
        <span class="approve-text">已结束</span>
        <span v-if="statisData.done_count" class="approve-tag">{{ statisData.done_count }}</span>
      </div>
      <div class="approve-item" v-permission="['FPMS_MENU_CODE_H5_DAN_DIAN']" @click="$router.push({name: 'MaterialsToBeCounted'})">
        <van-image round class="approve-icon" :src="require('@/assets/image/materials/pandian.png')" />
        <span class="approve-text">待盘点</span>
        <span v-if="statisData.check_count" class="approve-tag">{{ statisData.check_count }}</span>
      </div>
      <div class="approve-item" v-permission="['FPMS_MENU_CODE_H5_FU_HE']" @click="$router.push({name: 'MaterialsUnderReview'})">
        <van-image round class="approve-icon" :src="require('@/assets/image/materials/fuhe.png')" />
        <span class="approve-text">复核中</span>
        <span v-if="statisData.recheck_count" class="approve-tag">{{ statisData.recheck_count }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { materialsTotal } from 'api/materials'

export default {
  name: 'Materials',
  data () {
    return {
      statisData: {
        recheck_count: '',
        check_count: '',
        done_count: ''
      }
    }
  },
  created () {
    this.getTotal()
  },
  methods: {
    getTotal () {
      materialsTotal().then(res => {
        if (res.code === 200) {
          this.statisData.check_count = res.data.check_count
          this.statisData.done_count = res.data.done_count
          this.statisData.recheck_count = res.data.recheck_count
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.approve{
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
