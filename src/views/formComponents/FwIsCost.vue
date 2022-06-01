<template>
  <div class="cost">
    <van-field
      v-model="cost"
      clickable
      name="cost"
      class="fw-field bdn value-fixed"
      input-align="right"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择')"
    >
      <template #input>
        <van-radio-group v-model="cost" direction="horizontal" @change="choiceChange" :disabled="!!opt.readonly">
          <van-radio name="1" icon-size="0.4533rem" checked-color="#E1AA6C">是</van-radio>
          <van-radio name="2" icon-size="0.4533rem" checked-color="#E1AA6C">否</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <template v-if="cost == 1">
      <van-field
        v-model.number="serviceFee"
        name="serviceFee"
        input-align="right"
        class="fw-field pr fee"
        label="服务费"
        placeholder="0.00"
        type="number"
        :readonly="formReadonly(opt)"
        :rules="[{pattern: /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/, message: onServiceError}]"
        @input="submitServiceFee"
      >
        <template #right-icon>
          <div>元</div>
        </template>
      </van-field>
      <van-field
        clickable
        name="service"
        input-align="right"
        class="fw-field pr"
        label="服务"
      >
        <!--展示框-->
        <template #input>
          <input
            type="text"
            style="text-align: right;"
            class="van-field__control"
            readonly="readonly"
            placeholder="请选择服务"
            :value="service.length ? `服务清单（${service.length}）` : ''"
            @click="selectService(opt)"
          />
        </template>

        <!--右侧icon-->
        <template #right-icon>
          <svg-icon icon-class="arrow" style="font-size: 12px;" />
        </template>
      </van-field>
      <van-field
        clickable
        name="materialFee"
        input-align="right"
        class="fw-field pr fee"
        label="材料费"
        placeholder="0.00"
        type="number"
        v-model="materialFee"
        :readonly="formReadonly(opt)"
        :rules="[{pattern: /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/, message: onMaterialError}]"
        @input="submitMaterialFee"
      >
        <template #right-icon><div>元</div></template>
      </van-field>
      <van-field
        clickable
        name="material"
        input-align="right"
        class="fw-field pr"
        label="材料"
        placeholder="请选择材料"
      >
        <!--展示框-->
        <template #input>
          <input
            type="text"
            style="text-align: right;"
            class="van-field__control"
            readonly="readonly"
            placeholder="请选择材料"
            :value="material.length ? `材料清单（${materialNum}）` : ''"
            @click="selectMaterial(opt)"
          />
        </template>
        <!--右侧icon-->
        <template #right-icon>
          <svg-icon icon-class="arrow" style="font-size: 12px;" />
        </template>
      </van-field>
      <van-field
        v-if="opt.contractNo"
        clickable
        name="cost"
        class="fw-field bdn value-fixed contact"
        input-align="right"
        label="合同编号"
      >
        <template #input>
          <div>
            {{ opt.contractNo + `(${getPayManner(opt.chargeType)})` }}
          </div>
        </template>
      </van-field>
      <van-field
        clickable
        name="amount"
        input-align="right"
        class="fw-field pr fee"
        label="总金额"
        placeholder="0.00"
        type="number"
        v-model="amount"
        :readonly="true"
      >
        <template #right-icon><div>元</div></template>
      </van-field>
    </template>
    <Servie ref="service" @submit="submitService" :groupId="opt.group_id" :propsData="service"/>
    <Material ref="material" @submit="submitMaterial" :groupId="opt.group_id" :propsData="material"/>
  </div>
</template>

<script>
import mixin from './mixin'
import Servie from '@/views/cost/service.vue'
import Material from '@/views/cost/material'
import { yuanToCent, centToYuan1 } from '@/utils/index'

export default {
  components: { Servie, Material },
  name: 'FwJudge',
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
      cost: this.model[this.opt.code] || 2,
      serviceFee: this.model[this.opt.code + '_service_fee'] / 100,
      materialFee: this.model[this.opt.code + '_material_fee'] / 100,
      service: this.model[this.opt.code + '_service'] || [],
      material: this.model[this.opt.code + '_material'] || [],
      amount: this.model[this.opt.code + '_amount'] / 100 || '',
      materialNum: 0
    }
  },
  mounted () {
    console.log(this.opt)
    this.getMaterialNum()
  },
  methods: {
    onServiceError () {
      this.serviceFee = Math.floor(this.serviceFee * 100) / 100
    },
    onMaterialError () {
      this.materialFee = Math.floor(this.materialFee * 100) / 100
    },
    getMaterialNum () {
      let num = 0
      this.material.forEach((e, index) => {
        // 将当前的数量赋值给数据中的数量
        num += e.number
      })
      this.materialNum = num
    },
    submitServiceFee (value) {
      this.serviceFee = value
      console.log(yuanToCent(+value))
      this.$set(this.model, this.opt.code + '_service_fee', yuanToCent(+value))
      this.submitAmount()
    },
    submitMaterialFee (value) {
      this.materialFee = value
      this.$set(this.model, this.opt.code + '_material_fee', yuanToCent(+value))
      this.submitAmount()
    },
    submitAmount () {
      const value = -this.serviceFee + -this.materialFee
      this.amount = centToYuan1(yuanToCent(-value))
      this.$set(this.model, this.opt.code + '_amount', yuanToCent(-value))
    },
    submitService (values) {
      this.service = values
      this.$set(this.model, this.opt.code + '_service', values)
    },
    submitMaterial (values, num) {
      this.material = values
      this.materialNum = num
      this.$set(this.model, this.opt.code + '_material', values)
    },
    choiceChange (value) {
      if (this.formReadonly(this.opt)) {
        return
      }
      this.cost = +value
      this.$set(this.model, this.opt.code, +value)
      this.$set(this.model, this.opt.code + '_desc', +value === 1 ? '是' : '否')
    },
    selectService (opt) {
      if (this.formReadonly(opt)) {
        return
      }
      this.$refs.service.show()
    },
    selectMaterial (opt) {
      if (this.formReadonly(opt)) {
        return
      }
      this.$refs.material.show()
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .value-fixed {
    .van-field__label { flex: 1; }
    .van-field__value {
      width: 110px;
      flex: unset;
      text-align: right;
    }
    &.van-field--error {
      .van-radio__label {
        color: red;
      }
    }
  }
  ::v-deep .van-stepper{
    button{
      display: none;
    }
    input {
      width: 60px;
    }
  }

  ::v-deep .fee .van-field__right-icon{
      font-size: 14px !important;
      color: #323233 !important;
  }
  .cost ::v-deep .van-field {
      margin-bottom: 0;
  }
  .cost {
      margin-bottom: 10px;
  }
   ::v-deep   .bdn{
      border-bottom: 0.02667rem solid #eeeeee !important;
  }
  .contact {
    word-wrap:break-word; word-break:break-all;overflow: hidden;
  }
    ::v-deep .contact .van-field__value{
      width:260px;
    }
</style>
