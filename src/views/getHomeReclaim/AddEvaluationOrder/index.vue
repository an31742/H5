<template>
  <div class="submit-evaluation">
    <van-form class="submit-evaluation-form" @submit="fromSubmit">
      <!-- 回收品类 -->
      <reclaim-type />
      <!-- 使用时长 -->
      <select-time />
      <!-- 品牌及机型 -->
      <brand-type />
      <!-- 使用情况描述 -->
      <goods-use-desc />
      <!-- 上传图片 -->
      <upload />
      <div class="submit-button">
        <van-button
          round
          block
          :border="false"
          native-type="submit"
          color="#E1AA6C"
          text="提交估价"
          class="submit-button-size"
        />
      </div>
    </van-form>
  </div>
</template>

<script>
import { addAppraisal } from 'api/getHomeReclaim'
import { homeReclaim } from 'utils/const'
import { Toast } from 'vant'
export default {
  name: 'AddEvaluationOrder',
  components: {
    ReclaimType: () => import('./components/ReclaimType.vue'),
    SelectTime: () => import('./components/SelectTime.vue'),
    BrandType: () => import('./components/BrandType.vue'),
    GoodsUseDesc: () => import('./components/GoodsUseDesc.vue'),
    Upload: () => import('./components/Upload.vue')
  },
  methods: {
    fromSubmit (val) {
      addAppraisal({
        goods_category: Number(val.reclaimType),
        use_time: Number(val.useDuration),
        brand: val.brandText,
        description: val.useDesc,
        images: JSON.parse(val.files)
      }).then((res) => {
        if (res.code === 200) {
          this.$store.dispatch('getHomeReclaim/setUpdateListData', {
            pageType: homeReclaim.valet,
            refresh: true
          })
          this.$router.replace({
            name: 'AddSuccess',
            query: {
              type: homeReclaim.evaluation
            }
          })
        } else {
          Toast.fail(res.msg || '创建失败')
        }
      }).catch((e) => {
        Toast.fail(e.msg || '创建失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    div, span img, p, ul, li {
      box-sizing: border-box;
    }
    .van-field__error-message {
      text-align: right;
    }
  }
  .submit-evaluation {
    box-sizing: border-box;
    padding-top: 1px;
    padding-bottom: 64px;
    background: #F8F9FA;
    &-form {
      padding-left: 16px;
      padding-right: 16px;
      background: #fff;
      ::v-deep {
        .van-cell {
          padding-right: 0;
          padding-left: 0;
          &::after {
            right: 0;
            left: 0;
          }
        }
        .van-cell--required::before {
          left: -8px;
        }
      }
      .submit-button {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 16px;
        background: #fff;
        &-size {
          font-size: 16px;
        }
      }
    }
  }
</style>
