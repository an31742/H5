<template>

  <van-popup v-model="showPopup" position="bottom" class="popup">
    <div class="form-component">
      <van-form ref="form" validate-first scroll-to-error :show-error-message="false" @submit="submit">
        <!-- 使用人 -->
        <van-field
          v-model="checked"
          clickable
          name="score"
          class="fw-field value-fixed"
          input-align="right"
          label="使用人"
          :readonly="true"
          placeholder="请选择使用人"
          :required="true"
          :rules="[{ required: true, message: '请选择使用人' }] "
        >
          <template #input>
            <van-radio-group v-model="checked" direction="horizontal" @change="checkedChange">
              <van-radio name="1" icon-size="0.4533rem" checked-color="#E1AA6C">本人</van-radio>
              <van-radio name="2" icon-size="0.4533rem" checked-color="#E1AA6C">其他人</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <!-- 选择员工 -->
        <SelectStaff v-if="checked == 2" @submit="staffSubmit"/>
        <!-- 用途 -->
        <div class="form" style="text-align: left;">
          <van-field
            v-model="formModal.for_use"
            clickable
            rows="5"
            type="textarea"
            show-word-limit
            maxlength="200"
            class="fw-field bdn light-title"
            label="用途"
            placeholder="请输入"
            :required="true"
            :rules="[{ required: true, message: '请输入用途' }]"
          >
          </van-field>
        </div>
        <div class="form" style="text-align: left;">
          <!-- 备注 -->
          <van-field
            v-model="formModal.content"
            clickable
            rows="5"
            type="textarea"
            show-word-limit
            maxlength="200"
            class="fw-field bdn light-title"
            label="备注"
            placeholder="请输入"
            :required="false"
          >
          </van-field>
        </div>
      </van-form>
    </div>
    <div class="btns">
      <van-button
        type="default"
        round
        class="action-button"
        @click="showPopup = false"
      >
        上一步
      </van-button>
      <van-button
        type="primary"
        round
        class="action-button"
        @click="$refs.form.submit()"
      >
        提交
      </van-button>
    </div>
  </van-popup>
</template>

<script>
import SelectStaff from '@/views/storeHouse/receive/components/selectStaff'
import { receiveAdd } from '@/api/storeHouse.js'
export default {
  name: '',
  components: {
    SelectStaff
  },
  props: {
    selectedData: {
      type: Array,
      default () {
        return []
      }
    },
    warehouseId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      showPopup: false,
      checked: 1,
      formModal: {
        for_use: undefined,
        content: undefined
      },
      staffName: ''
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  methods: {
    staffSubmit (res) {
      console.log(res)
      this.staffName = res.name
      this.formModal.use_staff_id = res.id
    },
    submit () {
      const data = {
        ...this.formModal,
        warehouse_id: this.warehouseId,
        goods_list: this.selectedData
      }
      console.log(data)
      receiveAdd(data).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$toast('新建成功')
          this.$router.back()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    show () {
      this.showPopup = true
    },
    checkedChange (value) {
      console.log(value)
      console.log(this.checked)
      if (value === 1) {
        this.formModal.use_staff_id = 0
      }
    }
  }
}
</script>

<style type="text/css" lang="less">
  @import "../../../formApprove/common.less";
  .popup{
    height: 100%;
    background: whitesmoke;
  }
.btns{
  position: fixed;
  bottom: 0;
  left: 0;
  height: 80px;
  width: calc(100% - 40px);
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
  font-size: 14px;
  button{
    width: 45%;
  }
}
::v-deep  .van-button--default {
    border: 1px solid #E1AA6C;
    color: #E1AA6C;
  }
::v-deep  .van-button--primary {
    background:#E1AA6C;
    border: 1px solid #E1AA6C;
    color: #fff;
  }
</style>
