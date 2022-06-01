<template>
  <div class="work-detail">
    <div class="work-between work-mgb20">
      <span class="work-detail-title">基本信息</span>
    </div>
    <div class="work-detail-content">
      <!--申请标题：-->
      <p class="work-detail-row">
        <span class="work-detail-label">申请标题：</span>
        <span class="work-detail-desc">
          {{ detail.title || "--" }}
        </span>
      </p>

      <!--申请单号：-->
      <p class="work-detail-row">
        <span class="work-detail-label">申请单号：</span>
        <span class="work-detail-desc">{{ detail.series || "--" }} </span>
      </p>

      <!--申请日期：-->
      <p class="work-detail-row">
        <span class="work-detail-label">申请日期：</span>
        <span class="work-detail-desc">{{
          dayjs(detail.apply_time).format("YYYY.MM.DD") || "--"
        }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">申请人：</span>
        <span class="work-detail-desc">{{
          detail.apply_user_name || "--"
        }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">使用人：</span>
        <span class="work-detail-desc">{{ detail.use_user_name || "--" }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">使用人组织：</span>
        <span class="work-detail-desc">{{
          detail.use_organization || "--"
        }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">仓库名称：</span>
        <span class="work-detail-desc">{{
          detail.warehouse_name || "--"
        }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">用途：</span>
        <span class="work-detail-desc">{{ detail.purpose || "--" }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">备注：</span>
        <span class="work-detail-desc">{{ detail.remark || "--" }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">状态：</span>
        <span class="work-detail-desc">{{
          getItemByValue(RECEIVE_STATUS, detail.status) || "--"
        }}</span>
      </p>
    </div>
    <div class="work-between work-mgb20">
      <span class="work-detail-title">物资信息</span>
    </div>
    <!-- 物资信息 -->
    <van-form ref="form" validate-first scroll-to-error :show-error-message="false" @submit="handleSubmit">
      <div
        class="work-detail-content"
        v-for="(item, index) in goodsList"
        :key="index"
      >
        <!--申请标题：-->
        <div>
          <p class="work-detail-row">
            <span class="work-detail-label">物资分类：</span>
            <span class="work-detail-desc">
              {{ item.assets_level_name || "--" }}
            </span>
          </p>

          <!--申请单号：-->
          <p class="work-detail-row">
            <span class="work-detail-label">物资名称：</span>
            <span class="work-detail-desc">{{ item.assets_name || "--" }} </span>
          </p>

          <!--申请日期：-->
          <p class="work-detail-row">
            <span class="work-detail-label">品牌：</span>
            <span class="work-detail-desc">{{ item.brand || "--" }}</span>
          </p>
          <p class="work-detail-row">
            <span class="work-detail-label">规格型号：</span>
            <span class="work-detail-desc">{{
              item.model_specification || "--"
            }}</span>
          </p>
          <p class="work-detail-row">
            <span class="work-detail-label">单位：</span>
            <span class="work-detail-desc">{{ item.unit || "--" }}</span>
          </p>
          <p class="work-detail-row">
            <span class="work-detail-label">库存数量：</span>
            <span class="work-detail-desc">{{
              item.can_use_inventory || "--"
            }}</span>
          </p>
          <p class="work-detail-row">
            <span class="work-detail-label">申请数量：</span>
            <span class="work-detail-desc">{{ item.number || "--" }}</span>
          </p>
          <p class="work-detail-row">
            <span class="work-detail-label">待出库数量：</span>
            <span class="work-detail-desc">{{
              item.will_out_total
            }}</span>
          </p>
          <p class="work-detail-row">
            <van-field
              label="出库数量："
              placeholder="请输入"
            >
              <template #input>
                <van-stepper
                  :min="0"
                  :max="item.will_out_total"
                  v-model="item.out_total"
                  :default-value="0"
                  :integer="true"
                  @change="(num) => stepChange(num,item)"
                />
              </template>
            </van-field>
          </p>
          <div v-for="(a, i) in item.serial_data" :key="i">
            <p class="work-detail-row work-detail-line" style="display:block;">
              <van-field
                v-model="a.assets_number"
                :label="`资产编号${i + 1}：`"
                placeholder="请选择或扫描"
                :required="true"
                :readonly="true"
                :rules="[{ required: true, message: '请选择或扫描' }]"
                @blur="(e) => searchSerial(e, a)"
              >
                <template #right-icon	>
                  <svg-icon icon-class="work-scan" style="font-size: 22px;z-index:1;" @click.stop="scanQrCode(a)"/>
                </template>
              </van-field>
              <!--              <ul class="search-serial">-->
              <!--                <li v-for="(s,ind) in a._assetsNumberList" :key="ind" @click="clickNumber(a, s)">{{ s.assets_number }}</li>-->
              <!--              </ul>-->
              <ul class="search-serial" v-if="a._showNumber && a._assetsNumberList && a._assetsNumberList.length">
                <li style="border-top: 1px solid #eee">
                  <van-field
                    autofocus
                    style="border: 1px solid #eee; border-radius: 5px"
                    size="small"
                    v-model="searchNumber"
                    right-icon="search"
                    placeholder=""
                  />
                </li>

                <template v-for="(s,ind) in a._assetsNumberList">
                  <li v-if="searchNumber ? s.assets_number.includes(searchNumber) : true" :key="ind" @click="clickNumber(a, s)">{{ s.assets_number }}</li>
                </template>

              </ul>
              <ul class="search-serial" v-if="a._showNumber && !a._assetsNumberList.length">
                <li>暂无内容</li>
              </ul>
              <van-field
                v-model="a.serial"
                :label="`设备序列号${i + 1}：`"
                placeholder=""
                :readonly="true"
              />
            </p>
          </div>
          <p class="work-detail-row">
            <van-field
              clickable
              name="radio"
              class="fw-field"
              label="上传图片"
              placeholder="请上传图片"
            >
              <template #input>
                <upload
                  ref="upload"
                  :max="5"
                  :fileList="commentUploadImg"
                  uploadStyle="padding: 0;"
                  @change="(list) => onImageChange(item, list)"
                >
                  <slot>
                    <div class="van-uploader__upload">
                      <i class="van-icon van-icon-plus van-uploader__upload-icon"></i>
                      <span class="van-uploader__upload-text">上传图片</span>
                    </div>
                  </slot>
                  <template #preview-cover="{ item }">
                    <slot name="preview-cover" :item="item"></slot>
                  </template>
                </upload>
              </template>
            </van-field>
          </p>
        </div>
      </div>
    </van-form>
    <!--v-if="parseInt(item.will_out_total) > 0"-->
    <div v-if="alltotal > 0" class="flex-button">
      <van-button type="primary" class="submit-btn" @click="$refs.form.submit()">
        确认出库
      </van-button>
    </div>
  </div>
</template>

<script>
import { receiveInfo, exitWareHouse, assetsDetailList, qrCodeAssetsList } from '@/api/storeHouse.js'
import { getItemByValue, isApp } from '@/utils/index'
import { RECEIVE_STATUS } from '@/views/storeHouse/receive/components/const.js'
import dayjs from 'dayjs'
import wx from 'weixin-js-sdk'
import upload from '@/views/components/upload_form'

export default {
  name: 'BasicDetail',
  components: {
    upload
  },
  props: {},
  data () {
    return {
      alltotal: 0,
      searchNumber: '',
      receiveId: this.$route.query.receiveId,
      detail: {},
      getItemByValue,
      RECEIVE_STATUS,
      dayjs,
      commentUploadImg: [],
      goodsList: [] // 物资列表
    }
  },
  watch: {
    receiveId (val) {
      this.getApplyDetail()
    }
  },
  computed: {},
  created () {
    this.getApplyDetail()
  },
  methods: {
    clickNumber (a, s) {
      console.log(a, 999)
      a.assets_number = s.assets_number
      a.serial = s.serial
      a._showNumber = false
      console.log(s)
    },
    searchSerial (value, item) {
      console.log(value, 777)
      if (item._showNumber === true && item.assets_number) {
        item._showNumber = !item._showNumber
        return
      }
      // if (!value) return
      //   , assets_number: value || undefined
      this.searchNumber = ''
      // a.assets_number = s.assets_number
      // a.serial = s.serial
      // a._showNumber = false
      assetsDetailList({ assets_id: item.assets_id, use_type: 2, warehouse_id: this.detail.warehouse_id }).then(res => {
        if (res.code === 200 && res.data.list && res.data.list.length) {
          item._showNumber = true
          item._assetsNumberList = res.data.list
        } else {
          item._showNumber = true
          item._assetsNumberList = []
        }
      })
    },
    outAssets () {
      console.log('queren', this.$refs.form.submit)
      this.$refs.form.submit()
      // this.handleSubmit()
    },
    onImageChange (item, imgs) {
      console.log(item, imgs)
      if (!imgs.length) {
        return
      }
      item.images.push(imgs[0].url)
    },
    handleSubmit () {
      console.log('tijiao')
      const data = {}
      // const list = this.detail.goods_list
      const list = this.goodsList
      // console.error(list, 'submit')
      list.forEach((e) => {
        e.out_total = Number(e.out_total)
        e.serial_data && e.serial_data.forEach(s => {
          delete s._assetsNumberList
          delete s._showNumber
        })
      })
      console.log(list)
      data.receive_id = this.detail.receive_id
      data.out_list = list
      exitWareHouse(data).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.$router.back()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 扫码
    async scanQrCode (item) {
      // app走APP扫码
      if (isApp()) {
        this.nativeScanQRcode((res) => {
          if (res.error) {
            this.$toast(res.error)
            return
          }
          this.dealScanResult(res.str)
        })
        return
      }

      // 非APP下，走微信扫码
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'],
        success: (res) => {
          // item.assets_number = res.resultStr
          const id = Number(res.resultStr)
          // 二维码返回id，然后掉用固定物资列表接口，拿到assets_number 和serial回显
          qrCodeAssetsList({ ids: [id] }).then(res => {
            if (res.code === 200) {
              item.assets_number = res.data.list[0].assets_number
              item.serial = res.data.list[0].serial
            } else {
              this.$toast(res.msg)
            }
          })
        }
      })
    },
    getApplyDetail () {
      receiveInfo({ receive_id: Number(this.receiveId), filter_out_finish: false }).then((res) => {
        if (res.code === 200) {
          const obj = res.data
          // obj.out_total = 0
          obj.images = []
          this.goodsList = res.data.goods_list
          // 初始化数据
          this.goodsList.forEach(ele => {
            ele.serial_data = []
            ele.out_total = 0
            this.alltotal += ele.will_out_total
          })
          // obj.goods_list.forEach((e, ind) => {
          //   if (e.assets_type === 1) {
          //     const list = []
          //     for (let i = 0; i < e.will_out_total; i++) {
          //       console.log(e)
          //       list.push({
          //         assets_level_name: e.assets_level_name,
          //         assets_name: e.assets_name,
          //         assets_id: e.assets_id,
          //         serial: '',
          //         assets_number: '',
          //         _assetsNumberList: [],
          //         _showNumber: false
          //       })
          //     }
          //     console.log(list, 'daichuku ')
          //     e.serial_data = list
          //   }
          // })
          console.log(obj)
          this.detail = obj
        }
      })
    },
    // 出库数量加减
    stepChange (num, item) {
      // console.error(num, 777888)
      // console.error(item, 9999)
      item.out_total = num
      if (item.assets_type === 1) {
        const list = []
        for (let i = 0; i < num; i++) {
          list.push({
            assets_level_name: item.assets_level_name,
            assets_name: item.assets_name,
            assets_id: item.assets_id,
            serial: '',
            assets_number: '',
            _assetsNumberList: [],
            _showNumber: false
          })
        }
        item.serial_data = list
      }
    }
  }
}
</script>

<style scoped lang="scss">
.search-serial{
  background: #fff;
  border: 0.02667rem solid #EEEEEE;
  border-top: none;
  border-bottom: none;
  position: absolute;
  top: 32px;
  z-index: 999;
  width: 180px;
  left: 80px;
  li {
    border-bottom: 0.02667rem solid #EEEEEE;
    padding: 5px 10px;
  }
}
.work-detail {
  position: relative;
  z-index: 2001;
}
.van-overlay {
  z-index: 3000 !important;
}
.flex-button {
  display: flex;
  justify-content: center;
  padding: 0 20px;
}
.submit-btn {
  color: #fff;
  background: linear-gradient(
    45deg,
    rgb(242, 213, 165) 0%,
    rgb(225, 170, 108) 100%
  );
  border: none;
  margin: 10px 0;
  width: 100%;
}
.sub-title {
  padding-top: 0.8rem;
  text-align: center;
  font-weight: 600;
  overflow: hidden;
}
.sub-list {
  width: 100%;
  padding: 30px 0 30px 14px;
  display: flex;
  flex-wrap: wrap;
  &::after {
    content: "";
    flex-grow: 1;
  }
}
.sub-item {
  display: inline-block;
  margin-bottom: 0.32rem;
  font-size: 0.4rem;
  color: #333333;
  line-height: 0.56rem;
  padding: 0.21333rem 0.45333rem;
  background: #fff;
  border-radius: 0.53333rem;
  border: 1px solid #e6e7e8;
  margin: 0 10px 10px 0;
}
.active {
  background: #f9eee2;
  color: #bc8d58;
  border: 1px solid #f9eee2;
}
.edit-basic {
  color: #bc8d58;
  margin-left: 30px;
}
.fw-field {
  display: block;
  ::v-deep .van-field__value {
    margin-top: 10px;
  }
}
.work {
  font-family: PingFangSC-Regular, PingFang SC;
  height: 100%;
  background: #f6f8fa;

  .flex-column.van-tab__pane {
    height: calc(100vh - 44px);
    overflow-y: auto;
  }

  &-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-mgb20 {
    padding: 10px 0 7px 10px;
  }

  &-mgb16 {
    margin-bottom: 16px;
  }

  &-detail {
    overflow: scroll;
    margin-bottom: 4px;

    &-content {
      padding: 12px 16px;
      box-sizing: border-box;
      background: #fff;
      margin-top: 4px;
    }

    &-title {
      font-size: 15px;
      color: #a19f9f;
      line-height: 22px;
      font-weight: 500;
    }

    &-label,
    &-status,
    &-desc,
    &-yellow {
      font-size: 14px;
      color: #666;
      line-height: 20px;
      font-weight: 400;
      overflow-wrap: anywhere;
    }

    &-status {
      color: #999;
      margin-left: 12px;
    }

    &-label {
      min-width: 70px;
    }

    &-yellow {
      color: #bc8d58;
      margin-left: 8px;
    }

    &-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
    &-line {
      position: relative;
      ul {
      }
      ::v-deep .van-cell--required::before {
        left: 0px;
      }
      ::v-deep .van-field__label {
        max-width: 110px;
        width: auto;
      }
      ::v-deep .van-cell {
        padding: 10px 10px;
      }
      ::v-deep .van-field__label {
        margin: 0;
      }
      ::v-deep .van-cell::after {
        border: 0;
      }
    }

    &-pictures {
      display: flex;
      flex-wrap: wrap;
    }

    &-image {
      margin-right: 7px;
      background: #f00;
      border-radius: 2px;

      &:nth-child(4n) {
        margin-right: 0;
      }
    }

    &-action {
      padding: 0 16px;
      box-sizing: border-box;
      background: #fff;
      border-top: 1px solid #f6f8fa;
    }

    &-urgent {
      width: 55px;
      color: #fa5151;
      background: #fee5e5;
      border-radius: 4px;
      font-size: 12px;
      border: 0;

      &-content {
        display: flex;
        align-items: center;
      }
    }

    &-disabled {
      align-items: flex-start;

      &-content {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
      }
    }
  }

  &-flexstart {
    align-items: flex-start;
  }
}
</style>
