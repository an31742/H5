<template>
  <van-field
    v-model="reType"
    class="fw-field"
    label="回收品类"
    label-class="reclaim-type-label"
    name="reclaimType"
    readonly
    required
    :error="false"
    :rules="[{ validator, message: '请选择回收品类' }]"
  >
    <template #input>
      <check-box-type
        v-model="reclaimType"
        :types="types"
        @change="val => reType = val"
      ></check-box-type>
    </template>
  </van-field>
</template>

<script>
import CheckBoxType from './CheckBoxType.vue'
export default {
  name: 'ReclaimType',
  components: {
    CheckBoxType
  },
  data () {
    return {
      types: {
        cCCProduct: 1, // 3c产品类型
        homeElectricalEquipped: 2 // 家电
      },
      reType: -1, // van-field校验需要和submit提交数据
      reclaimType: -1 // check-box的value
    }
  },
  methods: {
    validator () {
      return Object.keys(this.types).some((item) => this.types[item] === this.reclaimType)
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep.van-cell--required::before {
    line-height: 36px;
  }
  ::v-deep {
    .reclaim-type-label {
      line-height: 36px;
    }
  }
</style>
