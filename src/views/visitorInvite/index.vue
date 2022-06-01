<template>
  <div class="visit-history">
    <div class="top">
      <router-link to="/visitorInvite">
        <img class="icon-invite" src="./images/icon_invite.png" />
      </router-link>
      <div class="text">分享访客临时权限</div>
      <div class="desc">访客临时权限开通后，访客将在规定时间内，自由进出小区门禁。您可以随时终止该权限。</div>
    </div>
    <div v-if="visitorList.length > 0" class="visitor-record">
      <div class="title">有权限的访客</div>
      <ul class="visitor-list">
        <li
          v-for="(item, index) in visitorList"
          :key="index"
          class="item"
        >
          <div class="house-num">
            {{ item.room_location_str }}
          </div>
          <div class="visitor-detail">
            <div class="avatar">
              <van-image round :src="require('@/assets/image/user.png')" />
            </div>
            <div class="text">访客：{{ item.visitor_name }}<span v-if="item.visitor_mobile">（{{ item.visitor_mobile }}）</span></div>
          </div>
          <div v-if="item.countdown <= 0" class="stop-text">
            已于{{ item.expireDate }}过期
          </div>
          <div v-else-if="item.status === 3" class="stop-text">
            你已提前终止该访客权限
          </div>
          <template v-else>
            <div class="steps">
              <van-steps :active="item.status">
                <van-step>未接受邀请
                  <template #active-icon>
                    <img class="active-icon" src="./images/step-icon.png" />
                  </template>
                </van-step>
                <van-step>已接受
                  <template #active-icon>
                    <img class="active-icon" src="./images/step-icon.png" />
                  </template>
                </van-step>
                <van-step>已到访
                  <template #active-icon>
                    <img class="active-icon" src="./images/step-icon.png" />
                  </template>
                </van-step>
              </van-steps>
            </div>
            <div
              v-if="![0,3].includes( item.status)"
              class="remain"
            >
              <div class="remain-time">
                剩余时间：<span><van-count-down class="text-yellow" :auto-start="item.countdownStart" :time="item.countdown" /></span>
              </div>
            </div>
          </template>

          <div class="bottom">
            <button
              v-if="item.status === 3 || item.countdown<=0 "
              type="button"
              class="button btn-red"
              @click="deleteVisitor(item)"
            >删除记录</button>
            <button
              v-if="item.status !== 3"
              type="button"
              class="button btn-yellow"
              @click="stopPermission(item)"
            >终止权限</button>
            <button
              v-if="item.status !== 0 && item.status !==3"
              type="button"
              class="button"
              :class="item.update_expire_time_count >= 2 && 'disabled'"
              :disabled="item.update_expire_time_count >= 2"
              @click="handleShowDialogExpire(item)"
            >续期</button>
            <button
              v-if="[0,1,3].includes( item.status)&&item.countdown>0"
              type="button"
              class="button"
              @click="handleInvite(item)"
            >再次邀请</button>
          </div>
        </li>
      </ul>
    </div>

    <!-- 续期弹窗 -->
    <van-dialog v-model="showDialogExpire" :title="expireTitle" show-cancel-button @confirm="updateVisitor">
      <div class="hours-box">
        <van-radio-group v-model="form.expire_time" direction="horizontal">
          <van-radio
            v-for="(item, index) in expireList"
            :key="index"
            :class="form.expire_time === item.value && 'selected'"
            :icon-size="0"
            :name="item.value"
          >
            <template #icon="props">
              <img class="checked-icon" :style="{display: props.checked ? 'block': 'none'}" :src="props.checked ? checkedIcon : ''" />
            </template>

            {{ item.label }}
          </van-radio>
        </van-radio-group>
        <div class="hours-tips">{{ currentItem.update_expire_time_count }}/2次，你还有{{ 2 - currentItem.update_expire_time_count }}次续期次数</div>
      </div>
    </van-dialog>
    <div v-if="showShareGuide" class="share-guide" @click="showShareGuide = false">
      <div class="mask"></div>
      <div class="container">
        <div class="text">点击这里邀请访客～</div>
      </div>
    </div>
  </div>
</template>

<script>
import { miniVisitorList, miniUpdateVisitor } from '@/api/visitorInvite'
import { mapGetters } from 'vuex'
import { setUserShare } from './utils.js'
import dayjs from 'dayjs'

export default {
  name: 'VisitorInvite',
  data () {
    return {
      checkedIcon: require('./images/checked_icon.png'),
      showShareGuide: false,
      visitorList: [], // 访客列表
      showDialogExpire: false, // 是否显示续期延长弹窗
      expireList: [ // 门禁延开时限列表
        {
          label: '12小时',
          value: 12 * 3600
        },
        {
          label: '24小时',
          value: 24 * 3600
        },
        {
          label: '36小时',
          value: 36 * 3600
        }
      ],
      currentItem: {}, // 当前操作的 item
      form: {
        id: null,
        status: undefined,
        expire_time: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'userData',
      'app_id'
    ]),
    expireTitle () {
      if (!this.showDialogExpire) {
        return ''
      }
      const label = this.expireList.filter(item => item.value === this.form.expire_time)[0].label
      return '续期时长：' + label
    }
  },
  created () {
    this.getVisitorList()
  },
  mounted () {

  },
  methods: {
    ...{
      dayjs
    },
    handleInvite (item) {
      console.log(item)
      if (item.status === 3) {
        this.$router.push({ path: '/visitorInvite', query: { room_id: item.room_id, visitor_name: item.visitor_name, visitor_mobile: item.visitor_mobile } })
      } else {
        const userName = encodeURI(this.userData.name)
        setUserShare(userName, item.user_id, item.share_id, item.expire_time)
        this.showShareGuide = true
      }
    },
    getVisitorList () {
      miniVisitorList({ groupid: this.curGroupId, type: 2 })
        .then(res => {
          const list = res.data.list
          list.map(item => {
            const now = new Date(res.time.replace(/-/g, '/'))
            const visitTime = new Date(item.visit_time)
            item.expireDate = dayjs(Number(visitTime) + item.expire_time).format('YYYY/MM/DD HH:mm:ss')
            if (item.status === 0) {
              item.countdownStart = false
              item.countdown = item.expire_time * 1000
            } else if (item.status === 1 || item.status === 2) {
              item.countdownStart = true
              item.countdown = item.expire_time * 1000 - (now - visitTime)
            } else {
              item.countdown = 0
              item.countdownStart = false
            }
          })
          console.log('list', list)
          this.visitorList = list
        })
        .catch(err => {
          this.$toast(err.message)
        })
    },
    // 延长访客时间
    updateVisitor () {
      miniUpdateVisitor(this.form)
        .then(res => {
          if (res.code === 200) {
            this.$toast('续期成功')
            this.getVisitorList()
          } else {
            this.$toast('续期失败')
          }
        })
    },
    // 显示续期弹窗
    handleShowDialogExpire (item) {
      this.currentItem = item
      this.form = {
        id: item.id,
        expire_time: this.expireList[0].value
      }
      this.showDialogExpire = true
    },
    /**
     * 删除访客
     */
    deleteVisitor (visitor) {
      this.$confirm({
        title: '删除记录',
        message: `您确定要删除访客${visitor.visitor_name}(${visitor.visitor_mobile})的记录？`,
        confirmButtonColor: '#BC8D58'
      })
        .then(() => {
          miniUpdateVisitor({ id: visitor.id, status: 4 })
            .then(res => {
              if (res.code === 200) {
                this.$toast('删除成功')
                this.getVisitorList()
              } else {
                this.$toast('册除失败')
              }
            })
        })
    },
    /**
     * 终止权限
     */
    stopPermission (visitor) {
      this.$confirm({
        title: '终止权限',
        messageAlign: 'center',
        message: `您确定要终止访客"${visitor.visitor_name}(${visitor.visitor_mobile})"进出本小区的权限吗？`,
        confirmButtonText: '终止',
        confirmButtonColor: '#BC8D58'
      }).then(() => {
        miniUpdateVisitor({ id: visitor.id, status: 3 })
          .then(res => {
            if (res.code === 200) {
              this.$toast('终止权限成功')
              this.getVisitorList()
            } else {
              this.$toast('终止权限失败')
            }
          })
      }).catch(_ => {})
    }
  }
}
</script>

<style lang="scss">
.checked-icon {
  display: block;
  position: absolute;
  width: 19px;
  height: 18px;
  bottom: 0;
  right: 0;
}
.visit-history {
  .van-steps {
    overflow: visible;
    &.van-steps--horizontal {
      padding-right: 0;
      .van-step__line {
        background-color: #FAF7F4;
      }
      .van-step--finish .van-step__line {
        background-color: #EAC9A5;
      }
    }
    .van-step--horizontal .van-step__circle-container {
      width: 12px;
      height: 12px;
      top: 0;
      display: block;
      background: transparent;
    }
    .van-step--horizontal:nth-child(2) .van-step__circle-container {
      margin-left: -4px;
    }
    .van-step:first-child .van-step__title {
      left: -23px;
    }
    .van-step:last-child .van-step__title {
      width: 4em;
      right: -14px;
      text-align: right;
     }
    .van-step__circle {
      width: 12px;
      height: 12px;
      box-sizing: border-box;
      background: #FFFFFF;
      border: 2px solid #FAF7F4;
    }
    .van-step__line {
      top: 0px;
    }
    .van-step--finish .van-step__circle {
      background: #FAF7F4;
      border: 2px solid #EAC9A5;
    }
    .van-step--process .van-step__line:after {
      border: none;
    }
    .van-step__title {
      position: absolute;
      top: 10px;
      color: #D0D0D0!important;
      &.van-step__title--active {
        color: #333333!important;
      }
    }
  }
  // .van-step--process .van-step__line:after {
  //   background: #fff;content: '';
  //   width: 6px;
  //   height: 6px;
  //   position: absolute;
  //   top: -4px;
  //   border-radius: 5px;
  // }
}
</style>
<style lang="scss" >
  .active-icon {
    display: block;
    width: 12px;
    height: 12px;
  }
  .hours-box {
    .van-radio {
      position: relative;
      text-align: center;
      .van-radio__label {
        width: 100%;
        margin: 0;
        color: #333;
      }
      &.selected {
        background: rgba(188, 141, 88, 0.4);
        .van-radio__label {
          color: #BC8D58;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .top {
    width: 100%;
    height: auto;
    min-height: 156px;
    box-sizing: border-box;
    padding: 25px 16px 8px;
    background: #FFFFFF;
    .icon-invite {
      display: block;
      width: 38px;
      height: 38px;
      margin: 0 auto;
    }
    .text {
      height: 20px;
      margin: 16px 0 0;
      font-size: 15px;
      font-weight: 400;
      text-align: center;
      color: #333333;
      line-height: 20px;
    }

    .desc {
      margin: 16px 0 0;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
    }
  }
  .visitor-record {
    margin: 16px 9px;
    .title {
      height: 17px;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
      margin: 0 0 0 8px;
    }

    .item {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      padding: 12px 16px 0;
      margin: 8px 0 0;
      background: #FFFFFF;
      box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.1);
      border-radius: 6px;
      .house-num {
        height: 20px;
        font-size: 15px;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
      .visitor-detail {
        display: flex;
        height: 45px;
        line-height: 45px;
        margin: 21px 0 0;
        .avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #ccc;
        }
        .text {
          margin: 0 0 0 16px;
          font-size: 13px;
          font-weight: 400;
          color: #333333;
        }
      }
      .stop-text {
        height: 19px;
        margin: 20px 0 0;
        font-size: 13px;
        font-weight: 400;
        color: #999999;
        line-height: 19px;
      }
      .steps {
        // height: 70px;
        margin: 18px 13px 0 23px;
      }
      .remain {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        height: 19px;
        color: #333;
        .text-yellow {
          color: rgba(225, 170, 108, 1);
        }
        .remain-time {
          display: flex;
        }
      }

      .bottom {
        display: flex;
        height: 60px;
        margin: 5px 0 0 -16px;
        justify-content: flex-end;
        align-items: center;
        .button {
          display: block;
          width: 80px;
          height: 28px;
          padding: 0;
          background: linear-gradient(170deg, #F2D5A5 0%, #E1AA6C 100%);
          border-radius: 15px;
          border: none;
          font-size: 13px;
          color: #fff;
          margin: 0 0 0 16px;
          &.btn-yellow {
            width: 80px;
            height: 28px;
            background: #FFFFFF;
            color: rgba(225, 170, 108, 1);
            border: 1px solid rgba(225, 170, 108, 1);
          }
          &.btn-red {
            color: rgba(250, 81, 81, 1);
            background: #FFFFFF;
            border: 1px solid #FA5151;
          }
          &.disabled:disabled {
            background: #ccc;
          }
        }
      }
    }
  }
  .hours-box {
    margin: 0 22px;
    .van-radio {
      width: 80px;
      height: 36px;
      background: #F5F5F5;
      border-radius: 4px;
      .van-radio__label {
        color: #BC8D58;
      }
      &.selected {
        background: #F7E9DB;
      }
    }
    .hours-tips {
      height: 17px;
      margin: 16px 0 10px;
      font-size: 13px;
      color: #999999;
      line-height: 17px;
      text-align: center;
    }
  }
  .share-guide {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
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
</style>
