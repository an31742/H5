<template>
  <div class="type-radio">
    <div
      :class="{'type-radio-item': true, 'type-radio-item-bg': value === types['cCCProduct']}"
      @click="changeReclaimType('cCCProduct')"
    >手机&3c</div>
    <div
      :class="{'type-radio-item': true, 'type-radio-item-bg': value === types['homeElectricalEquipped']}"
      @click="changeReclaimType('homeElectricalEquipped')"
    >家电</div>
  </div>
</template>

<script>
export default {
  name: 'CheckBoxType',
  props: {
    value: {
      type: Number,
      default: -1
    },
    types: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    changeReclaimType (attr) {
      if (!attr) return
      this.$emit('input', this.types[attr])
      this.$emit('change', this.types[attr])
    }
  }
}
</script>

<style lang="scss" scoped>
  .type-radio {
    width: 100%;
    display: flex;
    align-items: center;
    .type-radio-item {
      height: 36px;
      line-height: 36px;
      width: 80px;
      background-color: #F5F5F5;
      border-radius: 4px;
      text-align: center;
      &:last-child {
        margin-left: 16px;
      }
      &-bg {
        background-color: #fff;
        background-image: url('./../image/radio-bg.png');
        background-repeat: no-repeat;
        background-size: cover;
        color: #E1AA6C;
      }
    }
  }
</style>
