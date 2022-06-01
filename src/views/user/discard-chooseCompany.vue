<template>
  <div class="select-wrap bgfff">
    <p>选择公司进入</p>
    <van-cell
      v-for="(item, index) in userCompanyList"
      :key="index"
      class="bdn"
      is-link
      :title="item.name"
      @click="confirmSelectCompany(item.id)"
    >
      <template #icon>
        <svg-icon icon-class="company" />
      </template>
    </van-cell>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setCompanyId } from '@/utils/auth'

export default {
  name: 'ChooseCompany',
  computed: {
    ...mapGetters([
      'userCompanyList'
    ])
  },
  methods: {
    // 选择公司
    confirmSelectCompany (id) {
      setCompanyId(id)
      const redirect = this.$route.query.redirect || '/'
      window.location.replace(redirect)
    }
  }
}
</script>

<style scoped lang="scss">
  .select-wrap {
    padding: 0 31px;
    box-sizing: border-box;
    p {
      font-size: 21px;
      font-weight: 500;
      color: #333333;
      line-height: 30px;
      padding: 66px 0 50px;
    }
    ::v-deep {
      .van-cell {
        height: 62px;
        background: #F8F9FA;
        border-radius: 8px;
        padding: 0 16px;
        line-height: 60px;
        margin-bottom: 16px;
        .van-cell__title {
          font-size: 16px;
          color: #333333;
        }
        .svg-icon {
          font-size: 18px;
          padding-top: 20px;
          padding-right: 8px;
        }
        .van-cell__right-icon {
          padding-top: 19px;
        }
      }
    }
  }
</style>
