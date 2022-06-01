<template>
  <div @click.stop>
    <van-field
      readonly
      class="select-time"
      label="房号"
      name="room_id"
      placeholder="请选择"
      right-icon="arrow"
      input-align="right"
      :error="false"
      :value="key"
      @click="onSelect"
    >
      <template #input>
        <div>
          <span v-if="value || roomText">{{ value || roomText }}</span>
          <span v-else style="color: #CDCDCD;">请选择</span>
        </div>
      </template>
    </van-field>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        value-key="label"
        :columns="list"
        @confirm="onConfirm"
        @cancel="changeShowStatus"
      />
    </van-popup>
  </div>
</template>

<script>
// import { minipUserRoomApplyList } from 'api/room'
export default {
  name: 'SelectTime',
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    roomText: {
      type: String,
      default: ''
    },
    roomId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      value: '',
      key: 0,
      showPicker: false,
      list: []
    }
  },
  watch: {
    roomId: {
      handler (val) {
        if (val) this.key = val
      },
      immediate: true
    }
  },
  methods: {
    onSelect () {
      !this.disabled && (this.showPicker = true)
    },
    validator () {
      return !!this.key
    },
    onConfirm (val) {
      this.value = val.label
      this.key = val.value
      this.changeShowStatus()
    },
    changeShowStatus () {
      this.showPicker = !this.showPicker
    }
  },
  created () {
    // minipUserRoomApplyList().then(res => {
    //   this.list = res.data.map(i => (
    //     {
    //       value: i.RoomID,
    //       label: `${i.BuildingName}${i.UnitName}${i.RoomName}`
    //     }
    //   ))
    // })
  }
}
</script>

<style lang="scss" scoped>
  .select-time {
    border-bottom: 1px solid #eeeeee;
  }
</style>
