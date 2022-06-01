<template>
  <div class="approve">
    <p class="approve-title">基本信息</p>
    <div class="approve-item">
      <div class="approve-text">
        <p>
          计划名称：{{ detail.name }}
        </p>
        <p>
          盘点单号：{{ detail.series }}
        </p>
      </div>
      <div class="approve-text">
        <p>
          仓库名称：{{ detail.warehouse_name }}
        </p>
        <p>
          开始时间：{{ dayjs(detail.start_time).format('YYYY.MM.DD') }}
        </p>
      </div>
      <div class="approve-text">
        <p>
          结束时间：{{ dayjs(detail.end_time).format('YYYY.MM.DD') }}
        </p>
        <p>
          资产类型：{{ detail.assets_group_name }}
        </p>
      </div>
      <div class="approve-text">
        <p>
          状态：{{ getItemByValue(detail.status) }}
        </p>
        <p>
          盘点人：{{ detail.check_user_name }}
        </p>
      </div>
    </div>
    <p class="approve-title scan" v-if="assetType === 1">
      物资列表
      <svg-icon icon-class="work-scan" style="font-size: 14px;z-index:1;" @click="scanQrCode"/>
    </p>
    <!--    低值易耗品-->
    <Consumables v-if="assetType === 2" :assetType="2" ref="consum"/>
    <!--    固资-->
    <FixedCapital v-if="assetType === 1" :assetType="1" ref="fix"/>
    <div class="button-box">
      <van-button plain color="#E1AA6C" size="small" @click="buttonItem('end')">终止</van-button>
      <van-button color="#E1AA6C" size="small" @click="buttonItem('submit')">提交</van-button>
    </div>
  </div>
</template>

<script>
import Consumables from 'views/materials/components/consumables'
import FixedCapital from 'views/materials/components/fixedCapital'
import { getItemByValue, isApp } from 'utils'
import wx from 'weixin-js-sdk'
import { checkTask, getMaterialsDetail, submitTask, submitTaskFixed, getDetailTable1, getDetailTable } from 'api/materials'
import dayjs from 'dayjs'
import { statusList } from 'views/materials/constData'

export default {
  name: 'CountedDetail',
  components: {
    Consumables,
    FixedCapital
  },
  data () {
    return {
      id: Number(this.$route.query.id),
      detail: {},
      dayjs,
      statusList: statusList,
      assetType: Number(this.$route.query.assetType),
      entryList: [],
      data: []
    }
  },
  created () {
    this.getDetail()
    this.getTableList()
  },
  methods: {
    // 状态值转换
    getItemByValue (val) {
      const item = getItemByValue(this.statusList, val)
      return item
    },
    // 获取详情信息
    async getDetail () {
      const param = {
        id: this.id
      }
      await getMaterialsDetail(param).then(res => {
        if (res.code === 200) {
          const detailData = res.data || []
          this.detail = JSON.parse(JSON.stringify(detailData))
          this.detail.check_user_name = this.detail.check_user_name.toString()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 扫码
    scanQrCode () {
      let that = this
      if (isApp()) {
        this.nativeScanQRcode((res) => {
          if (res.error) {
            this.$toast(res.error)
            return
          }

          setTimeout(() => {
            if (res) {
              // this.scanSuccess()
              let details = this.data.filter((item) => {
                  return Number(item.assets_detail_id) === Number(res.resultStr)
                })
              this.$router.push({
                path: '/materials/entry',
                query: {
                  type: 'fixedCapital',
                  id: Number(this.$route.query.id),
                  assetType: this.assetType,
                  itemId: details[0].id,
                  detail: JSON.stringify(details[0])
                }
              })
            } else {
              this.$toast('请扫描本设备的二维码')
            }
          }, 1000)
        })
      } else {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'],
          success: (res) => {
            // https://developers.weixin.qq.com/community/develop/doc/00040aa59e828087e59a70e2b51c00
            setTimeout(() => {
              
              if (res) {
                // this.scanSuccess()
                let details = that.data.filter((item) => {
                  return Number(item.assets_detail_id) === Number(res.resultStr)
                })
                this.$router.push({
                  path: '/materials/entry',
                  query: {
                    type: 'fixedCapital',
                    id: Number(this.$route.query.id),
                    assetType: 1,
                    itemId: details[0].id,
                    detail: JSON.stringify(details[0])
                  }
                })
              } else {
                this.$toast('请扫描二维码')
              }
            }, 1000)
          },
          error: () => {
            this.$toast('扫码失败')
          }
        })
      }
    },
    getTableList () {
      const param = {
        id: Number(this.$route.query.id)
      }
      if (this.assetType === 1) {
        getDetailTable1(param).then(res => {
          if (res.code === 200) {
            this.data = res.data.list
          } else {
            this.$toast(res.msg)
          }
        })
      } else {
        getDetailTable(param).then(res => {
          if (res.code === 200) {
            this.data = res.data.list
          } else {
            this.$toast(res.msg)
          }
        })
      }
      
    },
    jsonToMap (jsonStr) {
      return new Map(JSON.parse(jsonStr))
    },
    // 提交
    buttonItem (type) {
      const param = {
        status: '',
        id: this.id
      }
      if (type === 'end') {
        param.status = 5
        checkTask(param).then(res => {
          if (res.code === 200) {
            this.$toast('操作成功')
            this.$router.back()
          } else {
            this.$toast(res.msg)
          }
        })
      } else {
        if (this.assetType === 1) {
          this.flagStatus = false
          this.$refs.fix.data.forEach(el => {
            if (el.status === 0) {
              this.flagStatus = true
            }
          })
          if (this.flagStatus) {
            this.$toast('还有物资未盘点，请先完成后再提交！')
            return
          }
          const assets = this.$refs.fix.data.map(item => {
            return {
              id: item.id,
              status_int: item.status, // 使用状态；
              department_id: item.department_id,
              locale: item.locale,
              content: item.content,
              total: item.total,
              user_id: item.user_id,
              is_check: 1
            }
          })
          const data = {
            id: this.id,
            status: 2, // 1保存；2提交
            assets
          }

          submitTaskFixed(data).then(res => {
            if (res.code === 200) {
              localStorage.removeItem('entryMap')
              this.$toast('提交成功')
              this.$router.back()
            } else {
              this.$toast(res.msg)
            }
          })
        } else {
          this.flagStatus = false
          this.$refs.consum.data.forEach(el => {
            if (el.content === '') {
              this.flagStatus = true
            }
          })
          if (this.flagStatus) {
            this.$toast('还有物资未盘点，请先完成后再提交！')
            return
          }
          const assets = this.$refs.consum.data.map(item => {
            return {
              id: item.id,
              check_total: item.check_total,
              content: item.content,
              is_check: 1
            }
          })
          const data = {
            id: this.id,
            status: 2, // 1保存；2提交
            assets
          }

          submitTask(data).then(res => {
            if (res.code === 200) {
              localStorage.removeItem('entryMap1')
              this.$toast('提交成功')
              this.$router.back()
            } else {
              this.$toast(res.msg)
            }
          })
        }
      }
    }
  },
  beforeDestroy () {
    localStorage.removeItem('entryMap')
    localStorage.removeItem('entryMap1')
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
  .scan{
    display: flex;
    justify-content: space-between;
  }

  &-item {
    padding: 12px 16px;
    box-sizing: border-box;
    background: #fff;
    margin-top: 4px;
  }

  &-text {
    font-size: 14px;
    color: #888;
    font-weight: 400;
    line-height: 20px;
    margin-top: 8px;
    p{
      display: inline-block;
      &:first-child{
        width: 55%;
      }
      span{
        color: #1A7AFF;
      }
    }
  }

  &-item {
    font-size: 14px;
    color: #888;
    font-weight: 400;
    line-height: 20px;
    margin-top: 8px;
  }

  .button-box{
    margin-top: 10px;
    background: #fff;
    padding: 20px 0;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    .van-button{
      width: 100px;
      border-radius: 5px;
      &:not(:last-child){
        margin-right: 25px;
      }
    }
  }
}
</style>
