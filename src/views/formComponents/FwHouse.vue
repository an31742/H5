<template>
  <div>
    <van-field
      v-model="selHouse"
      clickable
      name="selHouse"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择')"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="roomLocation"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectRelatedRoom"
        />
      </template>

      <!--右侧icon-->
      <template v-if="roomList && roomList.length > 1 && !formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择房屋弹层-->
    <van-popup v-model="popupRoomShow" class="form-component" :get-container="getBodyContainer" position="bottom">
      <van-picker
        show-toolbar
        :columns="objArray2StringArray(roomList, 'location')"
        @cancel="popupRoomShow=false"
        @confirm="(value, index) => { selectRoom(value, index) }"
      >
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import { wfeWidgetRoomList } from './api'
import { objArray2StringArray } from 'utils/index'

export default {
  name: 'FwHouse',
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      roomList: [],
      selHouse: null,
      roomLocation: '',
      popupRoomShow: false,
      defaultRoomIndex: null,
      objArray2StringArray
    }
  },
  mounted () {
    this.getRoomList()
  },
  methods: {
    // 房屋列表
    getRoomList () {
      const params = {
        page: 1,
        page_size: 500
      }
      if (this.opt.user_id) {
        params['user_id'] = this.opt.user_id
      }

      wfeWidgetRoomList(params).then(res => {
        if (res.code === 200) {
          const list = res.data || []
          this.roomList = list.map(item => {
            item.location = `${item.room_path}`
            return item
          })

          if (list.length === 1 && !this.formReadonly(this.opt)) {
            this.defaultRoomIndex = 0
            this.selectDefaultRoom()
          }
          return
        }
        this.$toast(res.msg || '获取房屋信息失败')
      })
    },
    // 选中默认的房屋
    selectDefaultRoom () {
      if (this.defaultRoomIndex !== null) {
        this.selectRoom(null, this.defaultRoomIndex)
      }
    },
    // 选择房屋弹框
    selectRelatedRoom () {
      if (this.roomList && this.roomList.length > 1) {
        this.popupRoomShow = true
      }
    },
    // 选择房屋
    selectRoom (location, index) {
      const room = this.roomList[index]
      this.popupRoomShow = false

      this.roomLocation = `${room.location}`
      this.selHouse = `${room.room_id}`

      this.$set(this.model, this.opt.code, +room.room_id)
      this.$set(this.model, this.opt.code + '_desc', this.roomLocation)

      this.$emit('confirm', room)
    }
  }
}
</script>
