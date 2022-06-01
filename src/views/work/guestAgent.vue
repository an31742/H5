<template>
  <div>
    <template v-if="!showService">
      <p class="title">请填写客户的基本信息</p>
      <van-form ref="form" validate-first scroll-to-error :show-error-message="false">
        <div class="form-component">
          <van-field
            v-model="form.room"
            readonly
            name="选择房屋"
            class=""
            placeholder="请选择"
            label="选择房屋"
            @click="showRoomPicker = true"
          >
            <template #right-icon><span class="work-customer-arrow"></span></template>
          </van-field>
          <van-field
            v-model="form.name"
            name="客户姓名"
            label="客户姓名"
            placeholder="请输入客户姓名"
          />
          <van-field
            v-model="form.tel"
            name="联系方式"
            label="联系方式"
            placeholder="请输入客户联系方式"
          />
        </div>
      </van-form>
      <van-popup v-model="showRoomPicker" round position="bottom">
        <van-picker show-toolbar value-key="name" :columns="estateList" @cancel="showRoomPicker=false" @confirm="selectRoom" />
      </van-popup>
      <div class="work-customer-button fixed-bottom">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
          @click="chooseService"
        >
          确认
        </van-button>
      </div>
    </template>

    <!-- 临客代报-选择确认信息 -->
    <template v-if="showService">
      <GuestAgentDetail
        :entryId="entryId"
        :source="source"
        :formData="form"
        @submit="$router.back()"
        @selectUser="reSelectUser"
      /></template>
  </div>

</template>

<script>
import { wfeEstateTree } from '@/api/wfe'
import GuestAgentDetail from '@/views/work/guestAgentDetail'
import { WorkOrderEntry, AppWorkOrderEntry } from '@/utils/const'
import { isApp } from '@/utils/index'

export default {
  name: 'GuestAgent',
  components: { GuestAgentDetail },
  props: {
    // 入口id
    entryId: {
      type: [String, Number],
      default: () => isApp() ? AppWorkOrderEntry.selfReport.value : WorkOrderEntry.selfReport.value
    },
    // 报事来源
    source: {
      type: Number,
      default: () => 1 // 自查报事
    }
  },
  data () {
    return {
      form: {
        room: '',
        name: '',
        tel: ''
      },

      showRoomPicker: false,
      estateList: [],
      showService: false
    }
  },
  created () {
    this.getEstateTree()
  },
  methods: {
    // 重新选择客户
    reSelectUser () {
      this.showService = false
    },
    chooseService () {
      this.showService = true
    },
    // 取消选择
    cancelService () {
      this.showService = false
    },
    // 选择服务
    selectService () {

    },
    // 选择房屋
    selectRoom (names, index) {
      this.showRoomPicker = false
      const build = this.estateList[index[0]]
      const unit = build && build.children[index[1]]
      const room = unit && unit.children[index[2]]

      if (build && unit && room) {
        this.form.room = `${build.name}${unit.name}${room.name}`
      }
    },
    // 获取房屋树
    getEstateTree () {
      wfeEstateTree().then(res => {
        if (res.code === 200) {
          this.estateList = this.filterEstate(res.data || [])
          return
        }
        this.$toast(res.msg || '房屋查询失败')
      })
    },
    // 筛选没有房屋的单元
    filterEstate (list) {
      return list.filter(item => {
        if (!item.children || !item.children.length) {
          return false
        }

        item.children = item.children.filter(child => {
          return (child.children && child.children.length)
        })

        return item.children && item.children.length
      })
    }
  }
}
</script>
<style lang="scss" scoped>

.service-lay>div{
  height: 100vh;
}
.title{
   padding: 0.32rem 0.42667rem 0.10667rem;
    box-sizing: border-box;
    font-size: 0.32rem;
    color: #999;
    font-weight: 400;
    line-height: 0.42667rem;
}
::v-deep .form-component .van-field .van-field__control{
    line-height: 0.65rem;
}
::v-deep  .form-component .van-cell:not(:last-child){
    margin-bottom: 0;
}
.template {
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
      background: #fff;
    }

    &-item {
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #EFEFEF;

      &:last-child {
        border-bottom: 0;
      }

      &-main {
        display: flex;
        align-items: center;
      }

      &-name, &-desc {
        font-size: 14px;
        color: #333;
        font-weight: 400;
        line-height: 20px;
      }

      &-desc {
        color: #999;
        max-width: 210px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
        margin-right: 12px;
      }
    }

    &-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: calc(100vh - 59px);
      background: #fff;
      margin-top: 4px;
      padding-top: 127px;
      box-sizing: border-box;

      &-icon {
        height: 140px;
      }

      &-text {
        font-size: 14px;
        line-height: 20px;
        color: #EAC9A5;
        margin-top: 20px;
        font-weight: 400;
      }
    }
  }
  .work-customer-button{
    padding: 16px 34px;
    button {
        font-size: 18px;
    }
  }
</style>>
