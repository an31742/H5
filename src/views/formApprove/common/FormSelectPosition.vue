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
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择', true)"
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
          :placeholder="isView ? '' : formLabel(opt, '请选择')"
          @click="handleSelect"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <van-popup v-model="popupShow" class="form-component" :get-container="getBodyContainer" position="bottom">
      <iframe
        id="if_amap"
        :src="'https://m.amap.com/picker/?zoom=18&center='+(userData['group_info'] && userData['group_info'].lonlat || '')+'&keywords=小区,写字楼&key='+aMapKey"
      ></iframe>
    </van-popup>
  </div>
</template>

<script>
import { pubsrvGeoLocation } from '../api'
import { aMapKey } from '@/utils/const'
import { mapGetters } from 'vuex'
import mixin from '../mixin'

export default {
  name: 'FormSelectPosition',
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
      aMapKey,
      address: '',
      popupShow: false
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  created () {
    if (this.model[this.opt.code] && this.model[this.opt.code].lonlat) {
      this.address = this.model[this.opt.code].address
      this.$set(this.model, this.opt.code + '_desc', this.address)
    } else if (this.defaultValue && this.defaultValue.length) {
      this.selectPosition(this.defaultValue)
    }
  },
  destroyed () {
    window.removeEventListener('message', this.handleMessage)
  },
  methods: {
    // 选择位置浮层
    handleSelect () {
      this.popupShow = true
      this.$nextTick(() => {
        this.postMsg()
      })
    },

    // iframe选择位置结果
    postMsg () {
      const ifm = document.querySelector('#if_amap').contentWindow
      document.querySelector('#if_amap').onload = () => {
        ifm.postMessage('hello', 'https://m.amap.com/picker/')
      }

      window.addEventListener('message', this.handleMessage)
    },

    // 接受iframe传过来的消息
    handleMessage (e) {
      if (e.data && e.data.name) {
        const ipo = e.data.location.split(',')
        this.selectPosition(ipo)
      }
    },

    // 选择位置
    selectPosition (arr) {
      if (!arr || !arr.length) { return }

      this.popupShow = false
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
  .form-component {
    height: 90%;
  }
  #if_amap { width: 100%;height: 100%;border: none; }
</style>
