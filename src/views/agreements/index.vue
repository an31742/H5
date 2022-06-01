<!--
  功能：协议与政策列表
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2022年01月05日 14:53:55
-->
<template>
  <van-cell-group class="value-width">
    <van-cell
      v-for="(i, id) in currentLinks"
      is-link
      :key="id"
      :title="i.text"
      :url="i.link"
    ></van-cell>
  </van-cell-group>
</template>

<script>
import { mapGetters } from 'vuex'
import { isHttp } from '@/utils/index'
import { defaultTheme } from '@/utils/const'

export default {
  // 组件名称
  name: 'Agreements',
  data () {
    return {
      links: [
        {
          text: '用户协议',
          link: defaultTheme.staff_use_agreement
        },
        {
          text: '个人信息保护政策',
          link: defaultTheme.staff_protect_agreement
        },
        {
          text: '个人生物识别信息保护政策',
          link: defaultTheme.staff_biometric_agreement
        },
        {
          text: '未成年人个人信息保护政策',
          link: defaultTheme.staff_minor_agreement
        },
        {
          text: '其他个人敏感信息保护政策',
          link: defaultTheme.staff_other_sensitive_agreement
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'commonInfo'
    ]),
    currentLinks () {
      const companyInfo = this.commonInfo
      const list = []
      const ssoUrl = 'https://sso.gmtech.top'
      let staffUseAgreement// 用户协议
      let staffProtectAgreement // 个人信息保护政
      let staffBiometricAgreement // 个人生物识别信息保护政策
      let staffMinorAgreement // 未成年人个人信息保护政策
      let staffOtherSensitiveAgreement // 其他个人敏感信息保护政策
      if (companyInfo.staff_use_agreement) {
        staffUseAgreement = isHttp(companyInfo.staff_use_agreement) ? companyInfo.staff_use_agreement : `${ssoUrl}${companyInfo.staff_use_agreement}`
        list.push({
          text: '《用户协议》',
          link: staffUseAgreement
        })
      }
      if (companyInfo.staff_protect_agreement) {
        staffProtectAgreement = isHttp(companyInfo.staff_protect_agreement) ? companyInfo.staff_protect_agreement : `${ssoUrl}${companyInfo.staff_protect_agreement}`
        list.push({
          text: '《个人信息保护政策》',
          link: staffProtectAgreement
        })
      }
      if (companyInfo.biometric_agreement_status === 1 && companyInfo.staff_biometric_agreement) {
        staffBiometricAgreement = isHttp(companyInfo.staff_biometric_agreement) ? companyInfo.staff_biometric_agreement : `${ssoUrl}${companyInfo.staff_biometric_agreement}`
        list.push({
          text: '《个人生物识别信息保护政策》',
          link: staffBiometricAgreement
        })
      }

      if (companyInfo.staff_minor_agreement) {
        staffMinorAgreement = isHttp(companyInfo.staff_minor_agreement) ? companyInfo.staff_minor_agreement : `${ssoUrl}${companyInfo.staff_minor_agreement}`
        list.push({
          text: '《未成年人个人信息保护政策》',
          link: staffMinorAgreement
        })
      }

      if (companyInfo.staff_other_sensitive_agreement) {
        staffOtherSensitiveAgreement = isHttp(companyInfo.staff_other_sensitive_agreement) ? companyInfo.staff_other_sensitive_agreement : `${ssoUrl}${companyInfo.staff_other_sensitive_agreement}`
        list.push({
          text: '《其他个人敏感信息保护政策》',
          link: staffOtherSensitiveAgreement
        })
      }

      return list.length > 0 ? list : this.links
    }
  }
}
</script>
