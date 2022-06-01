<template>
  <div class="visitor-wrapper">
    <div class="top">
      <div
        class="select"
        @click="showDoor=true"
      >{{ door || '请选择门禁' }}<svg-icon class="small-triangle" icon-class="small-triangle" /></div>
      <div class="ewm">
        <qriously
          v-if="qrValue"
          class="qr-code"
          :value="qrValue"
          :size="210"
        />
        <img v-else src="./images/ewm.png" />
      </div>
    </div>
    <div class="content">
      <div class="title">来访人员信息</div>
      <ul class="list">
        <li
          v-for="(item, index) in list"
          :key="index"
          class="item"
          @click="jumpTo(item)"
        >
          <div class="house-num">{{ item.room_location_str }}</div>
          <div class="detail">
            <div class="avatar">
              <img v-if="item.gender === 1" src="~@/assets/avatar-women.png" />
              <img v-else src="~@/assets/avatar-men.png" />
            </div>
            <div class="info">
              <div>访客：{{ item.visitor_name }}<span v-if="item.visitor_mobile">（{{ item.visitor_mobile }}）</span></div>
              <div>到访时间：{{ item.visit_time && item.visit_time.seconds ? dayjs(item.visit_time.seconds * 1000).format('YYYY/MM/DD HH:mm:ss') : dayjs(item.visit_time).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 选择大门 -->
    <van-popup v-model="showDoor" position="bottom">
      <van-picker
        show-toolbar
        :columns="objArray2StringArray(doorArr || [], 'label')"
        @cancel="showDoor=false"
        @confirm="onConfirmDoor"
      ></van-picker>
    </van-popup>
  </div>
</template>

<script>
import { getGroupId } from '@/utils/auth'
import { getVisitorList, getDoorList } from '@/api/visitor'
import { objArray2StringArray } from '@/utils/index'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
export default {
  name: 'CheckQr',
  data () {
    return {
      qrValue: '', // 二维码地址
      door: '',
      doorId: '',
      showDoor: false,
      list: [],
      doorArr: [],
      appId: ''
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  created () {
    this.getVisitorList()
    this.getDoorList()
  },
  methods: {
    ...{
      objArray2StringArray,
      dayjs
    },
    jumpTo (item) {
      this.$router.push({
        name: 'VisitorDetails',
        query: {
          info: JSON.stringify(item)
        }
      })
    },
    onConfirmDoor (door, index) {
      this.showDoor = false
      this.door = door
      const sel = this.doorArr[index]
      if (sel) {
        this.doorId = sel.value
        const deviceMac = sel.deviceMac
        const env = `${process.env.VUE_APP_ENVIRONMENT}`
        door = encodeURI(door)
        this.qrValue = `${window.location.protocol}//h5-user${env}.gmtech.top/visitorCheck/checkIn?app_id=${this.appId}&companyId=${this.userData.company_id || ''}&doorId=${this.doorId}&door=${door}&groupId=${getGroupId() || ''}&deviceMac=${deviceMac}`
        // 保存最后一次开门信息
        localStorage.setItem('LAST_VISITOR_DOOR_ID', this.doorId)
      }
    },
    getDoorList () {
      const params = {
        group_id: Number(getGroupId()),
        company_id: this.userData.company_id,
        page: 1,
        page_size: 500,
        device_type: 101
      }
      getDoorList(params)
        .then(res => {
          if (res.code === 200) {
            this.doorArr = (res.data.list || []).map(item => {
              return { label: item.address_name, value: item.id, deviceMac: item.device_mac }
            })
            this.appId = res.data.app_id

            // 读取最后一次开门信息
            const doorId = Number(localStorage.getItem('LAST_VISITOR_DOOR_ID'))
            const doorItemIndex = this.doorArr.findIndex(t => t.value === doorId)
            if (doorItemIndex > -1) {
              this.onConfirmDoor(this.doorArr[doorItemIndex]?.label, doorItemIndex)
            }
          } else {
            this.$toast(res.msg)
          }
        })
    },
    getVisitorList () {
      const params = {
        group_id: Number(getGroupId()),
        company_id: this.userData.company_id,
        type: 1
      }
      getVisitorList(params)
        .then(res => {
          this.list = res.data.list
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .visitor-wrapper {
    background: #F6F8FA;
  }
  .top {
    width: 375px;
    height: 375px;
    background: #fff;
    overflow: auto;

    .select {
      position: relative;
      margin: 23px auto 0;
      text-align: center;
      font-size: 17px;
      display: flex;
      align-items: center;
      justify-content: center;
      .small-triangle {
        font-size: 6px;
        margin: 0 0 0 8px;
      }
    }
    .ewm {
      display: block;
      width: 210px;
      height: 210px;
      margin: 52px auto 0;
    }
  }
  .content {
    margin: 0 9px;
    .title {
      font-size: 12px;
      line-height: 1;
      padding: 16px 0 8px;
    }
  }
  .list {
    .item {
      width: 100%;
      height: 114px;
      box-sizing: border-box;
      padding: 13px 16px 0;
      margin: 0 0 8px 0;
      background: #FFFFFF;
      box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.1);
      border-radius: 6px;
      .house-num {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #BC8D58;
        line-height: 1;
      }

      .detail {
        display: flex;
        margin: 21px 0 0;
        .avatar {
          width: 45px;
          height: 45px;
          background: #ccc;
          border-radius: 50%;
          overflow: hidden;
        }
        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin:  0 0 0 16px;
          font-size: 13px;
          line-height: 19px;
        }
      }
    }
  }
</style>
