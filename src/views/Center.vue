<template>
  <div class="fw-container box-main" style="padding-bottom: 0;">
    <!--头像、手机号-->
    <div class="box-main">
      <div class="my-info">
        <van-image width="57" height="57" round fit="cover" :src="userData && userData.avatar || require('@/assets/image/user.png')"></van-image>
        <div class="my-info-right">
          <p class="my-info-name">{{ userData && userData.name }}
            <svg-icon v-if="userData && userData.gender === 2" icon-class="gender-boy" style="font-size: 18px;" />
            <svg-icon v-else-if="userData && userData.gender === 1" icon-class="gender-girl" style="font-size: 18px;" />
          </p>
          <p class="my-info-phone">{{ userData && phoneEncryption(userData.mobile) }}</p>
        </div>
      </div>
    </div>

    <!--基础信息-->
    <div class="box-main">
      <van-cell-group class="value-width">
        <!--<van-cell-->
        <!--title="公司"-->
        <!--:is-link="companyList.length > 1"-->
        <!--:value="`${userData && userData.company_name || 'xxx'}`"-->
        <!--@click="chooseCompany"-->
        <!--&gt;</van-cell>-->
        <van-cell
          title="公司"
          :value="`${userData && userData.company_name || 'xxx'}`"
        ></van-cell>
        <van-cell
          title="部门"
          :value="`${userData && userData.dep_name || 'xxx'}`"
        ></van-cell>
        <van-cell title="邮箱" :value="userData && userData.email"></van-cell>
        <!-- <van-cell title="性别" :value="formatGender(userData && userData.gender)"></van-cell> -->
      </van-cell-group>
    </div>

    <!--操作-->
    <div class="box-main">
      <van-cell-group class="value-width">
        <van-cell title="待办工单" is-link :to="{ name: 'WorkMyTodo' }"></van-cell>
        <van-cell title="考勤打卡" is-link @click="toCheckon"></van-cell>
        <van-cell title="收费记录" is-link @click="jumpOuterUrl('charge-record')"></van-cell>
        <van-cell title="我的日报" is-link @click="jumpOuterUrl('daily-report')"></van-cell>
        <van-cell title="修改密码" is-link @click="changePwd"></van-cell>
        <van-cell title="功能反馈" is-link :to="{ name: 'FeedBack' }"></van-cell>
      </van-cell-group>
    </div>

    <!-- 协议与政策 -->
    <van-cell-group class="value-width">
      <van-cell title="协议与政策" is-link :to="{ name: 'Agreements' }"></van-cell>
    </van-cell-group>

    <!--退出登录-->
    <div class="fw-button-wrap">
      <van-button size="large" type="primary" class="round" @click="logout">切换账号</van-button>
    </div>

    <!--&lt;!&ndash;切换公司&ndash;&gt;-->
    <!--<van-popup v-model="popupShow" position="bottom">-->
    <!--<van-picker-->
    <!--show-toolbar-->
    <!--:columns="objArray2StringArray(companyList, 'name')"-->
    <!--@cancel="popupShow=false"-->
    <!--@confirm="(value, index) => { selectCompany(value, index) }"-->
    <!--&gt;-->
    <!--</van-picker>-->
    <!--</van-popup>-->
  </div>
</template>

<script>
import { objArray2StringArray, phoneEncryption } from '@/utils'
// import { ssoWeiXinH5MobileCompany } from '@/api/user'
import { mapGetters } from 'vuex'
import store from '@/store'
import { getToken, getGroupId } from '@/utils/auth'
import { outEntryLinks } from '../utils/const'

export default {
  name: 'Center',
  data () {
    return {
      objArray2StringArray,
      phoneEncryption,
      curGroupId: ''
      // companyList: [],
      // popupShow: false
    }
  },
  computed: {
    ...mapGetters([
      'userGroupList',
      'userData',
      'appConfig',
      'app_id'
    ]),
    curGroupObjectId () {
      let gl = []
      if (this.userGroupList) {
        gl = this.userGroupList.filter(item => item.id === this.curGroupId)
        return gl[0] ? gl[0]['object_id'] : ''
      } else {
        return ''
      }
    }
  },
  created () {
    this.curGroupId = getGroupId() ? +getGroupId() : ''
  },
  methods: {
    // 跳转外网页面
    jumpOuterUrl (url) {
      const hasToken = getToken()
      if (hasToken && this.curGroupObjectId) {
        location.href = `${outEntryLinks.Payment}${url}?token=${hasToken}&project_id=${this.curGroupObjectId}&app_id=${this.app_id}`
      }
    },
    // 收费记录点击
    chargeRecord () {
      console.log('收费记录')
    },
    // 获取公司列表
    // getCompanyList () {
    //   ssoWeiXinH5MobileCompany({
    //     mobile: this.userData.mobile
    //   }).then(res => {
    //     if (res.code === 200) {
    //       this.companyList = res.data || []
    //     }
    //   })
    // },

    // 切换账号
    logout () {
      this.$confirm({
        title: '操作确认',
        message: '确定要退出当前账号吗？',
        closeOnPopstate: true
      }).then(async () => {
        await store.dispatch('user/logout')
      }).catch(_ => {})
    },

    // 性别
    formatGender (gen = '') {
      if (this.appConfig.USER_SEX) {
        const item = this.appConfig.USER_SEX.find(item => item.value === Number(gen))
        return item.label
      } else {
        return '-'
      }
    },

    // 打卡
    toCheckon () {
      if (this.userGroupList.length) {
        this.$router.push({ name: 'CheckOn' })
      } else {
        this.$toast('你当前名下无项目，无需打卡哦～')
      }
    },

    // // 切换公司
    // chooseCompany () {
    //   if (this.companyList.length > 1) {
    //     this.popupShow = true
    //   }
    // },

    // // 选择公司
    // selectCompany (val, index) {
    //   this.popupShow = false
    //
    //   window.location.reload()
    // },

    // 修改密码
    changePwd () {
      const appId = store.getters.app_id

      window.location.href = `${process.env.VUE_APP_API_BASE_SSO_URL}/minip/changepwd?app_id=${appId}&mode=h5&redirect_url=${encodeURIComponent(window.location.href)}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .fw-container{
    width: 100%;
    height: calc(100% - 50px);
    overflow-y: scroll;
  }

  .user-links {
    padding: 15px 0;
    text-align: center;
    background-color: #fff;

    .van-icon {
      display: block;
      font-size: 0.64rem;
    }
  }

  .box-main{
    padding-bottom: 12px;
    background: #f5f5f5;
  }

  .fw-button-wrap {
    margin: 50px 28px 16px;
  }

  .cell_icon {
    height: 24px;
  }

  .my-info {
    width: 100%;
    height: 96px;
    padding: 15px 15px 23px;
    box-sizing: border-box;
    background: url('~assets/ui-prettify/center-bg.svg') no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;

    &-right {
      margin-left: 15px;
    }

    &-name {
      font-size: 24px;
      line-height: 34px;
      color: #343434;
      font-weight: 500;
      font-family: PingFangSC-Medium, PingFang SC;
    }

    &-phone {
      font-size: 14px;
      line-height: 20px;
      color: #999;
      font-weight: 500;
      margin-top: 2px;
    }
  }
</style>
