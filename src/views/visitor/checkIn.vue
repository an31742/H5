<template>
  <div class="check-in-wrapper">
    <van-form
      class="form-visitor"
      :show-error-message="false"
      @submit="onSubmit"
    >
      <!--到访家庭-->
      <van-field
        v-model="form.oom_id"
        class="visitor-field vertical-field"
        name="room_id"
        required
        readonly
        clickable
        label="到访家庭"
        placeholder="请选择到访家庭"
        :rules="[{ required: true, message: '请选择到访家庭' }]"
        @click="showPickerHouse=true"
      >
      </van-field>

      <!--到访事由-->
      <van-field
        v-model="reasonName"
        class="visitor-field vertical-field"
        name="reasonName"
        placeholder="请选择到访事由"
        label="到访事由"
        required
        readonly
        clickable
        :rules="[{ required: true, message: '请选择到访事由' }]"
        @click="showPickerReason=true"
      >
        <template #right-icon>
          <svg-icon icon-class="arrow-down" style="font-size: 12px;" />
        </template>
      </van-field>

      <!--访客姓名-->
      <van-field
        v-model="form.visitor_name"
        class="visitor-field vertical-field half"
        maxlength="10"
        :formatter="nameFormatter"
        name="visitor_name"
        required
        label="访客姓名"
        placeholder="请输入住客姓名"
        :rules="[{ required: true, message: '请输入住客姓名' }]"
      >
        <template #button>
          <van-radio-group v-model="form.gender" direction="horizontal">
            <van-radio
              v-for="(item, index) in SEX_TYPE"
              :key="index"
              :name="item.value"
              icon-size="16"
            >
              {{ item.label }}
              <svg-icon v-if="props.checked" slot="icon" slot-scope="props" icon-class="ckb-on" />
              <svg-icon v-else slot="icon" icon-class="ckb-g" />
            </van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <!--证件类型-->
      <van-cell class="visitor-field vertical-field" required title="身份信息">
        <van-field
          v-model="form.visitor_card_type"
          class="visitor-field child-field"
          name="visitor_card_type"
          readonly
          clickable
          label="证件类型"
          placeholder="请选择证件类型"
          :rules="[{ required: true, message: '请选择证件类型' }]"
          @click="showPickerCertify=true"
        >
          <template #right-icon>
            <svg-icon icon-class="arrow-down" style="font-size: 12px;" />
          </template>
        </van-field>
        <!--证件号码-->
        <van-field
          v-model="form.visitor_card_id"
          class="visitor-field child-field"
          label="证件号码"
          placeholder="请输入证件号码"
          :rules="[{ required: true, message: '请输入证件号码' }]"
        ></van-field>
      </van-cell>

      <!--到访人数-->
      <van-cell class="visitor-field vertical-field custom-field" required title="访客人数">
        <div>
          <van-field name="num" :rules="[{ required: true, message: '请输入到访人数' }]">
            <template #input>
              <van-stepper
                v-model="form.num"
                min="1"
                max="20"
                integer
                input-width="60px"
                @overlimit="plusNum"
              ></van-stepper>
            </template>
          </van-field>
        </div>
      </van-cell>

      <!--体温-->
      <van-field
        v-model="form.temperature"
        class="visitor-field vertical-field"
        name="temperature"
        required
        label="体温"
        placeholder="请输入当前体温"
        :rules="[{ required: true, message: '请输入当前体温' }]"
      >
      </van-field>

      <button type="submit" class="submit">提交信息</button>
    </van-form>

    <!-- 选择房屋 -->
    <van-popup v-model="showPickerHouse" position="bottom">
      <div class="search-house">
        <van-sticky>
          <div class="top">
            <div class="field">
              <svg-icon icon-class="clear" class="search-icon" style="font-size: 15px;" />
              <input type="text" class="input" placeholder="请输入楼栋号/单元号查找家庭">
              <svg-icon class="clear-icon" icon-class="clear" style="font-size: 15px;" />
            </div>
            <span
              class="cancel"
              @click="showPickerHouse=false"
            >取消</span>
          </div>
        </van-sticky>
        <ul class="house-list">
          <li
            v-for="(item, index) of 20"
            :key="index"
            class="item"
          >3号楼1单元</li>
        </ul>
      </div>
    </van-popup>

    <!-- 到访事由 -->
    <van-popup v-model="showPickerReason" position="bottom">
      <van-picker
        show-toolbar
        :columns="objArray2StringArray(appConfig.VISIT_REASONS || [], 'label')"
        @cancel="showPickerReason=false"
        @confirm="onConfirmReason"
      ></van-picker>
    </van-popup>

    <!-- 证件类型 -->
    <van-popup v-model="showPickerCertify" position="bottom">
      <van-picker
        show-toolbar
        :columns="objArray2StringArray(appConfig.USER_CERTIFICATE_TYPE || [], 'label')"
        @cancel="showPickerCertify=false"
        @confirm="onConfirmCertify"
      ></van-picker>
    </van-popup>
  </div>
</template>

<script>
import { objArray2StringArray } from '@/utils/index'
export default {
  name: 'VisitorCheckIn',
  data () {
    return {
      showPickerCertify: false,
      showPickerReason: false, // 是否显示到访事由
      showPickerHouse: false,
      SEX_TYPE: [
        { label: '先生', value: 0 },
        { label: '女士', value: 1 }
      ],
      reasonName: '', // 到访原因
      form: {
        room_id: '1',
        visitor_name: '', // 访客姓名
        visitor_card_type: '', // 证件类型
        visitor_card_id: '', // 证件号码
        num: 1, // 到访人数
        reason: '', // 到访事由
        temperature: '' // 体温
      }
    }
  },
  methods: {
    ...{
      objArray2StringArray
    },
    // 提交
    onSubmit (values) {
      console.log(values)
    },
    // 选择证件类型
    onConfirmCertify (re, index) {
      this.showPickerCertify = false
      this.certificateName = re
      this.form.visitor_card_type = this.appConfig.USER_CERTIFICATE_TYPE[index].value
    },
    // 选择到访事由
    onConfirmReason (re, index) {
      this.showPickerReason = false
      this.reasonName = re
      this.form.reason = this.appConfig.VISIT_REASONS[index].value
    },
    // 到访人数增加
    plusNum () {
      if (this.form.num <= 1) {
        this.$toast('不能再少了')
      }
      if (this.form.num >= 20) {
        this.$toast('请联系管家/物业进行预约')
      }
    }
  }
}
</script>

<style lang="scss">
  .form-visitor {
    .van-cell {
      border-bottom: none;
      &:hover { background: #fff; }
      &::after { border-bottom: none; }
    }
    .vertical-field {
      &.van-cell {
        display: block;
        font-size: 14px;
        color: $main-text-color;
        padding: 12px 16px;
      }
      .van-cell__title { width: auto; }
    }

    .visitor-field {
      &:not(.half) .van-field__body {
        background: none;
      }
      &:not(.half) {
        // 到访人数样式
        &.custom-field {
          .van-field__body {
            background: none;
            padding: 0;
          }
          .van-cell {
            padding: 0;
          }
        }
      }

      &:not(.half) .van-field__body, &.half .van-field__control{
          background: rgba(250,250,250,1);
          border-radius: 4px;
          min-height: 40px;
          font-size: 15px;
          font-weight: 400;
          line-height: 23px;
          text-align: left;
          padding: 0 16px;
      }
      &.van-field--error {
        &:not(.half) .van-field__body, &.half .van-field__control {
          border: 1px solid #FA5151;
        }
      }

      &.van-cell--required {
        &::before{
          left: 20px;
        }
        .van-cell__title {
          margin-left: 16px;
        }
        // 证件类型、证件号码样式
        .child-field {
          &.van-cell {
            padding: 12px 0;
          }
          .van-cell__title {
            height: 40px;
            line-height: 40px;
            margin-left: 10px;
          }
          .van-field__body {
            margin-left: 8px;
          }
        }
      }
    }
    .van-stepper {
      .van-stepper__minus, .van-stepper__plus, .van-stepper__input {
        width: 51px;
        height: 40px;
      }
      .van-stepper__minus {
        &::before {
          width: 20px;
        }
      }
      .van-stepper__plus {
        &::before {
          width: 20px;
        }
        &::after {
          height: 20px;
        }
      }
      .van-stepper__input {
        background: #DCDCDC;
        font-size: 18px;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
</style>

<style lang="scss" scoped>
  .title {
    position: relative;
    height: 40px;
    padding: 0 0 0 15px;
    margin: 16px 0 0;
    line-height: 40px;
    font-size: 15px;
    font-weight: 400;
    color: #333;
    span {
      display: block;
      position: absolute;
      left: 5px;
      top: 50%;
      line-height: 1;
      transform: translate(0, -50%);
      color: #FA5151;
    }
  }
  // .input, .input:disabled {
  //   display: block;
  //   box-sizing: border-box;
  //   width: 100%;
  //   height: 40px;
  //   padding: 0 16.5px;
  //   background: #FAFAFA;
  //   border-radius: 4px;
  //   border: none;
  //   &.visitor-name {
  //     width: 181px;
  //   }
  // }
  // .field {
  //   display: flex;
  //   height: 40px;
  //   line-height: 40px;
  //   margin: 10px 0;
  //   .label {
  //     width: 100px;
  //   }
  // }

  .visitor-sexy {
    margin: 0 0 0 10px;
  }

  .submit {
    display: block;
    width: 300px;
    height: 40px;
    margin: 36px auto 20px;
    border-radius: 20px;
    border: none;
    font-size: 18px;
    font-weight: 500;
    color: #FFFFFF;
    background: linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%);
  }

  .search-house {
    min-height: 100vh;
    background: #F6F8FA;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0 12px;
      width: 100%;
      height: 54px;
      background: #FFFFFF;
    }
    .field {
      display: flex;
      align-items: center;
      width: 305px;
      height: 31px;
      background: rgba(245, 245, 245, 0.5);
      border-radius: 6px;
      .search-icon {
        width: 39px;
      }
      .input {
        width: 240px;
        border: none;
        font-size: 15px;
        background: inherit;
      }
    }
    .cancel {
      height: 21px;
      margin: 0 0 0 16 px;
      font-size: 15px;
      color: #BC8D58;
      line-height: 21px;
    }

    .house-list {
      width: 100%;
      height: auto;
      margin: 4px 0 0;
      background: #FFFFFF;
      .item {
        height: 53px;
        margin: 0 0 0 12px;
        line-height: 53px;
        border-bottom: 1px solid #EEEEEE;
        &:last-child{
          border: none
        }
      }
    }
  }
</style>
