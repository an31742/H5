<template>
  <div style="background: #F6F8FA;">
    <van-form
      id="form-invite"
      ref="visitorForm"
      :show-error-message="false"
      @submit="onSubmit"
    >
      <div>
        <!-- 选择房屋 -->
        <van-cell title="选择房屋" required />
        <van-field
          v-model="selectHouse.label"
          required
          readonly
          clickable
          name="homeName"
          placeholder="请选择到访位置"
          :rules="[{ required: true, message: '请选择到访位置' }]"
          @click="handleShowPickerHouse"
        />

        <!-- 门禁时限 -->
        <van-cell title="门禁时限" required />
        <van-field
          v-model="selectExpire.label"
          required
          readonly
          clickable
          name="expireTime"
          placeholder="请选择访客门禁权限的时限"
          :rules="[{ required: true, message: '请选择访客门禁权限的时限' }]"
          @click="showPickerExpire=true"
        >
          <template #right-icon>
            <svg-icon icon-class="arrow" style="font-size: 12px;" />
          </template>
        </van-field>
      </div>

      <ul class="visitor-list">
        <li
          v-for="(item, index) in visitorList"
          :key="index"
          class="visitor-item"
        >
          <div class="visitor-num">
            <span class="visitor-index">访客{{ index+1 }}</span>
            <span class="visitor-delete" @click="deleteConfirm(index)">删除</span>
          </div>
          <!-- 访客姓名 -->
          <van-cell title="访客姓名" required />
          <van-field
            v-model="visitorList[index].visitor_name"
            name="visitor_name"
            placeholder="请输入访客姓名"
            :rules="[{ required: true, message: '请输入访客姓名' }]"
          />

          <!-- 访客手机号 -->
          <van-cell title="访客手机号" required />
          <van-field
            v-model="visitorList[index].visitor_mobile"
            name="visitor_mobile"
            placeholder="请输入访客手机号"
            :rules="[{ required: true, message: '请输入访客手机号' }]"
          />
        </li>
      </ul>
    </van-form>
    <!-- // 只能要求10个访客 -->
    <div v-if="visitorListCount<10" class="add-box">
      <img class="icon" src="./images/icon_invite.png" @click="addVisitor"/>
      <div class="text">添加访客</div>
      <div class="tips">可以邀请群里的朋友一起过来哦～</div>
    </div>
    <div class="place-holder-bottom"></div>
    <div class="bottom van-submit-bar pf-form">
      <div class="tips">注：点击“邀请访客”进入选择微信朋友界面，可选择朋友分享</div>
      <div class="btns">
        <button class="button" type="button" @click="handleCancel">取消</button>
        <button class="button button-yellow" type="submit" @click="submitForm">邀请访客</button>
      </div>
    </div>

    <!-- 选择房屋 -->
    <van-popup v-model="showPickerHouse" position="bottom">
      <van-picker
        show-toolbar
        :columns="objArray2StringArray(houseList || [], 'label')"
        @cancel="showPickerHouse=false"
        @confirm="onConfirmHouse"
      />
    </van-popup>

    <!-- 开门时限 -->
    <van-popup v-model="showPickerExpire" position="bottom">
      <van-picker
        show-toolbar
        :columns="objArray2StringArray(expireList || [], 'label')"
        @cancel="showPickerExpire=false"
        @confirm="onConfirmExpire"
      />
    </van-popup>
    <div v-if="showShareGuide" class="share-guide" @click="hideShareGuide">
      <div class="mask"></div>
      <div class="container">
        <div class="text">点击这里邀请访客～</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { minipRoomInfo } from '@/api/entrance'
import { miniInviteVisitor, getFloorList } from '@/api/visitorInvite'
import { objArray2StringArray } from '@/utils/index'
import { getGroupId, getCompanyId } from '@/utils/auth'
import { mapGetters } from 'vuex'
import { setUserShare } from './utils'

export default {
  name: 'VisitorInvite',
  data () {
    return {
      roomId: null, // url上获取的 roomId
      showShareGuide: false,
      homeName: '',
      doorName: '',
      visitorName: '',
      doorLimit: '',
      visitorMobile: '',
      showPickerHouse: false,
      showPickerExpire: false,
      selectHouse: {}, // 选择的房屋
      selectExpire: {}, // 选择门禁时
      openNum: 5, // 开门次数
      houseList: [], // 业主的房屋列表
      visitorList: [], // 邀请的访客列表
      expireList: [ // 门禁时限列表
        // {
        //   label: '1min',
        //   value: 1 * 60
        // },
        // {
        //   label: '10min',
        //   value: 10 * 60
        // },
        {
          label: '12小时',
          value: 12 * 60 * 60
        },
        {
          label: '24小时',
          value: 24 * 60 * 60
        },
        {
          label: '36小时',
          value: 36 * 60 * 60
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'userData',
      'app_id'
    ]),
    visitorListCount () {
      return this.visitorList.length
    }
  },
  created () {
    this.addVisitor()
    this.getHouseList()
    this.roomId = Number(this.$route.query.room_id) || ''
    this.selectHouse = this.$route.query.house || ''
    this.visitorList[0].visitor_name = this.$route.query.visitor_name || ''
    this.visitorList[0].visitor_mobile = this.$route.query.visitor_mobile || ''
  },
  methods: {
    ...{
      objArray2StringArray
    },
    deleteConfirm (index) {
      this.$confirm({ title: '操作确认', message: `确认删除访客${index + 1}？`, closeOnPopstate: true })
        .then(() => {
          this.visitorList.splice(index, 1)
        })
        .catch(() => {

        })
    },
    handleShowPickerHouse () {
      if (this.houseList.length > 0) {
        this.showPickerHouse = true
      } else {
        this.$confirm({
          title: '提示',
          message: '您没有可邀请的，请联系管理员授权'
        })
      }
    },
    submitForm () {
      this.$refs.visitorForm.submit()
    },
    hideShareGuide () {
      this.showShareGuide = false
      this.$router.back()
    },
    // 获取房屋列表
    async getHouseList () {
      if (this.loading) { return }
      this.loading = true

      let selectIndex = 0
      const res = await getFloorList({})
      this.houseList = (res.data || []).map((item, index) => {
        if (this.roomId && this.roomId === item.id) {
          selectIndex = index
        }
        return {
          label: `${item.name}`,
          value: item.id
        }
      })

      if (this.roomId) {
        this.selectHouse = this.houseList[selectIndex]
      } else if (this.houseList.length === 1) {
        this.selectHouse = this.houseList[0]
      }

      this.loading = false
    },
    // 提交访客信息
    onSubmit () {
      const expireTime = this.selectExpire.value
      const visitorList = this.visitorList.map(item => {
        item.expire_time = this.selectExpire.value
        item.num = this.openNum
        return item
      })
      const params = {
        company_id: getCompanyId(),
        group_id: Number(getGroupId()),
        building_id: this.selectHouse.value,
        staff_id: this.userData.id,
        visitor_list: visitorList
      }

      miniInviteVisitor(params)
        .then(res => {
          if (res.code === 200) {
            const userName = encodeURI(this.userData.name)
            setUserShare(userName, res.data.user_id, res.data.share_id, expireTime)
            this.showShareGuide = true
            this.visitorList = []
          } else {
            this.$toast(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleCancel () {
      history.go(-1)
    },
    // 选择房屋
    onConfirmHouse (houseName, index) {
      this.showPickerHouse = false
      this.selectHouse = this.houseList[index]
    },
    // 先择门禁时限
    onConfirmExpire (expire, index) {
      this.showPickerExpire = false
      this.selectExpire = this.expireList[index]
    },
    // 添加访客
    addVisitor () {
      // if(this.his.visitorList)
      const visitorTemp = {
        visitor_name: '',
        visitor_mobile: ''
      }
      this.visitorList.push(visitorTemp)
    }
  }
}
</script>

<style lang="scss">
  #form-invite {
    .van-cell {
      &.van-field--error {
        .van-field__body { // 校验失败输入框显示红色连框效果
          border: 1px solid #ee0a24;
        }
      }
      &:not(:last-child) { // 去掉底部横线
        border-bottom: none;
      }
      &.van-field {
        padding: 0 16px;
        &:last-child {
          padding-bottom: 16px;
        }
      }
      &:not(.van-field) { // 单元格(van-cell) 样式
        padding: 16px 18px 8px 34px;
        font-size-adjust: 15px;
        line-height: 16px;
        color: #333;
      }
      &.van-cell--required{
        &::before {
          left: 20px;
        }
      }
    }
    .van-field__body { // 输入框添加灰色背景
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #DCDCDC;
      line-height: 20px;
      background: #FAFAFA;
      border-radius: 4px;
      padding: 10px 16px;
    }
  }
</style>

<style lang="scss" scoped>
  .share-guide {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 101;
    .mask {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    .container {
      position: relative;
    }
    .text {
      position: absolute;
      top: 0;
      right: 54px;
      width: 238px;
      height: 170px;
      box-sizing: border-box;
      padding: 129px 0 0 33px;
      background: url('./images/share_guide_bg.png') no-repeat;
      background-size: 100% auto;
      color: #fff;
      font-size: 16px;
    }
  }

  .visitor-item{
    margin: 13px;
    background: #FFFFFF;
    border-radius: 5px;
  }

  .visitor-num {
    display: flex;
    justify-content: space-between;
    // height: 41px;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
    .visitor-index {
      margin: 16px 0 0 17px;
    }
    .visitor-delete {
      width: 45px;
      height: 100%;
      box-sizing: border-box;
      padding: 16px 0 0 0;
      margin: 0 9px 0 0;
      text-align: center;
      color: #FA5151;
    }
  }
  .add-box {
    width: 375px;
    height: 130px;
    overflow: auto;
    margin: 16px 0 0;
    background: #FFFFFF;
    .icon {
      display: block;
      width: 38px;
      height: 38px;
      margin: 21px auto 0;
    }
    .text {
      width: 100%;
      height: 20px;
      margin: 8px auto 0;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      text-align: center;
    }
    .tips {
      width: 100%;
      height: 17px;
      margin: 11px auto 0;
      font-size: 12px;
      font-weight: 400;
      color: #D0D0D0;
      line-height: 17px;
      text-align: center;
    }
  }
  .place-holder-bottom {
    width: 100%;
    height: 130px;
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    min-height: 130px;
    z-index: 100;
    .tips {
      width: 100%;
      min-height: 50px;
      box-sizing: border-box;
      padding: 16px 15px;
      line-height: 17px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      text-align: center;
      background: #F6F8FA;

    }
    .btns {
      display: flex;
      width: 100%;
      height: 80px;
      box-sizing: border-box;
      padding: 20px 38px 0;
      justify-content: space-between;
      background: #FFFFFF;

      .button {
        display: block;
        width: 141px;
        height: 40px;
        background: #FFFFFF;
        border-radius: 20px;
        border: 1px solid rgba(225, 170, 108, 1);
        font-size: 18px;
        color: rgba(225, 170, 108, 1);
        &.button-yellow{
          border: none;
          background: linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%);
          color: #fff;
        }
      }
    }
  }
</style>
