<template>
  <div>
    <van-field
      v-model="address"
      clickable
      :name="address"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="isView ? '' : formLabel(opt, '请获取')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请获取', true)"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="address"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请获取')"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #button>
        <span class="action" @click="getPosition">点击获取</span>
      </template>
    </van-field>
  </div>
</template>

<script>
import mixin from '../mixin'
import wx from 'weixin-js-sdk'
import { isApp } from '@/utils/index'
import { pubsrvGeoLocation } from '../api'

export default {
  name: 'FormGetPosition',
  mixins: [mixin],
  props: {
    isView: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    },
    defaultValue: {
      type: [Array, Object],
      default: () => []
    }
  },
  data () {
    return {
      address: ''
    }
  },
  created () {
    if (this.model[this.opt.code] && this.model[this.opt.code].lonlat) {
      this.address = this.model[this.opt.code].address
      this.$set(this.model, this.opt.code + '_desc', this.address)
    } else if (this.defaultValue && this.defaultValue.length) {
      this.selectPosition(this.defaultValue)
    }
  },
  methods: {
    // 获取位置
    getPosition () {
      const that = this

      if (isApp()) {
        this.nativeGetLocation((res) => {
          if (res.error) {
            this.$toast(res.error)
            return
          }

          that.selectPosition([res.longitude, res.latitude])
        })
      } else {
        wx && wx.getLocation({
          type: 'gcj02',
          success: (res) => {
            that.selectPosition([res.longitude, res.latitude])
          },
          cancel: (res) => {
            console.log('定位失败，权限不足')
          }
        })
      }
    },

    // 选择位置
    selectPosition (arr) {
      if (!arr || !arr.length) { return }

      this.getAddressByLon(arr)
    },

    // 根据经纬度获取具体位置
    getAddressByLon (arr) {
      pubsrvGeoLocation({ location: arr.join(',') }).then(res => {
        if (res.data && res.data.regeocode) {
          this.address = res.data.regeocode['formatted_address']
          const ac = res.data.regeocode.addressComponent || {}

          this.$set(this.model, this.opt.code, {
            lonlat: arr,
            city: ac.city || ac.province,
            address: this.address
          })
          this.$set(this.model, this.opt.code + '_desc', this.address)

          console.log('this.model, this.opt.code', this.model[this.opt.code])
          console.log('this.model, this.opt.code_desc', this.address)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .action {
    font-size: 14px;
    color: #BC8D58;
  }
</style>
