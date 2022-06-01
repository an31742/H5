<template>
  <div class="form-component">
    <template v-for="(item, index) in options">
      <component :is="item.type" :key="index" :model="model" :opt="item" :extData="extData"></component>
    </template>
  </div>
</template>

<script>
import FwGrid from './FwGrid'
import FwJudge from './FwJudge'
import FwSign from './FwSign'
import FwHouse from './FwHouse'
import FwParking from './FwParking'
import FwPosition from './FwPosition'
import FwUploadPhoto from './FwUploadPhoto'
import FwTakePhoto from './FwTakePhoto'
import FwUploadFile from './FwUploadFile'
import FwTextArea from './FwTextArea'
import FwGetMaterial from './FwGetMaterial'
import FwInput from './FwInput'
import FwUserRole from './FwUserRole'
import FwTime from './FwTime'
import FwTimeRange from './FwTimeRange'
import FwDateTime from './FwDateTime'
import FwDate from './FwDate'
import FwDateRange from './FwDateRange'
import FwStaff from './FwStaff'
import FwCarSelect from './FwCarSelect'
import FwStarAppraise from './FwStarAppraise'
import FwSatisfiedAppraise from './FwSatisfiedAppraise'
// import FwDeviceReport from './FwDeviceReport'
import FwStaffOnNextNode from './FwStaffOnNextNode'
import FwIsCost from './FwIsCost'
import FwInpuQrcode from './FwInpuQrcode'
import FwUploadVideo from './FwUploadVideo'
export default {
  name: 'FromComponentsIndex',
  components: {
    FwSatisfiedAppraise,
    FwStarAppraise,
    FwCarSelect,
    FwUploadPhoto,
    FwUploadFile,
    FwTextArea,
    FwStaff,
    FwInput,
    FwHouse,
    FwPosition,
    FwUserRole,
    FwSign,
    FwTime,
    FwTimeRange,
    FwDateTime,
    FwDate,
    FwDateRange,
    FwGrid,
    FwJudge,
    FwParking,
    FwTakePhoto,
    FwGetMaterial,
    // FwDeviceReport,
    FwStaffOnNextNode,
    FwIsCost,
    FwInpuQrcode,
    FwUploadVideo
  },
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Array,
      default: () => []
    },
    extData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  created () {},
  methods: {}
}
</script>

<style lang="scss">
  .form-component {
    .form {
      font-family:PingFangSC-Regular,PingFang SC;
      ::-webkit-input-placeholder { color: rgba(220,220,220,1);font-size: 15px; }
      &.gold {
        .van-cell__value, .van-field__control { font-size: 15px;font-family: PingFangSC-Regular,PingFang SC;color: rgba(188,141,88,1);line-height: 21px; }
        input::-webkit-input-placeholder { color: $disable-bg-color; }
      }
      .van-field__label { font-size: 16px;color: $main-text-color;line-height: 23px; }
      .van-field__control { text-align: right;font-size: 15px;color: #555; }
      .van-cell-group__title { font-size: 12px;color: $minor-text-color;line-height: 17px;padding: 14px 16px 7px; }
      .block {
        &.disabled {
          opacity: .6;
          .van-field__label, .van-field__control { color: $minor-text-color;cursor: not-allowed; }
        }
        .van-field__label { width: auto; }
        .van-field__control {
          text-align: left;font-size: 14px;color: $main-text-color;line-height: 20px;margin-top: 8px;
          .van-radio__label { color: $minor-text-color;margin-left: 5px; }
        }
      }
      .block.pr {
        .van-cell__right-icon { position: absolute;bottom: 12px;right: 14px }
      }
      .block.inner {
        .van-cell__right-icon { position: absolute;bottom: 0;right: 0 }
      }
      .block.van-cell { display: block;font-size: 14px;color: $main-text-color; }
      .van-field--min-height .van-field__control { min-height: 40px; }
      .danger {
        .van-field__control { font-weight: 600 !important;color: $error-color !important;-webkit-text-fill-color: $error-color; }
      }

      .fw-field, .fw-inline-field {
        &.van-cell {
          display: block;font-size: 14px;color: $main-text-color;border-bottom: none;padding: 12px 16px;
          &:hover { background: #fff; }
        }
        .van-field__label { width: auto; }
        .van-field__body, .van-field__control { background: rgba(250,250,250,1);border-radius: 4px;min-height: 40px;font-size: 15px;font-weight: 400;line-height: 23px;text-align: left; }
        .van-field__control:disabled { opacity: .5; }
        &.no-bg {
          .van-field__body, .van-field__control { background: transparent; }
        }
        .van-field__body {padding: 0 9px;margin-top: 7px;}
        &.half {
          .van-field__body { background: none;padding: 0; }
          .van-field__control { padding: 0 9px; }
        }
        &.outer {
          .van-field__body { padding: 0 5px; }
          &.van-field--error {
            >.van-field__value >.van-field__body { border: none; }
          }
        }
        &.custom {
          .van-field__body, .van-field__control { background: none;padding: 0;margin: 0; }
        }
        &.van-field--min-height { /* textarea */
          //.van-cell__value { background: #fafafa;margin-left: -16px;margin-right: -16px; }
          .van-cell__value { background: #fafafa;border-radius: 4px; }
          .van-field__word-limit { padding: 0 10px 5px 0; }
          .van-field__body { padding: 0 16px; }
          &.inner-textarea {
            .van-cell__value { margin-left: 0;margin-right: 0; }
          }
          .van-field__error-message { padding-left: 16px; }
        }
        .corner { bottom: 0;position: absolute;right: 0;font-size: 18px; }
        .van-field__error-message { text-align: left;padding-top: 5px; }
        textarea { padding: 5px 0; }
        textarea::placeholder, input::placeholder {font-size:15px;color:rgba(220,220,220,1);line-height:23px; }
        &.van-field--error {
          textarea::placeholder, input::placeholder {color: #FA5151; }
          .van-field__body { border: 1px solid #FA5151; }
          &.van-field--min-height {
            .van-field__body { border: none; }
            .van-cell__value { border: 1px solid #FA5151; }
          }
          &.half {
            .van-field__body { border: none; }
            .van-field__control { border: 1px solid #FA5151; }
          }
        }
        .inner-field { padding: 0 !important; }
        .inner-field .van-cell, .inner-field.van-cell {
          border-bottom: none;margin: 0;padding: 6px 0;
          .van-field__label { line-height: 40px; text-align: left;padding-right: 10px; }
          .van-field__control {margin-top: 0;}
          .van-field__body { margin-top: 0; }
        }
        .van-radio--horizontal { margin: 0 0 0 0.32rem; }
        .sec-tip { font-size: 12px;color: rgba(196,196,196,1);line-height: 17px;margin-top: 6px;text-align: left; }
      }
      .fw-inline-field.van-cell {
        display: flex;
        &.van-cell--required::before { line-height: 40px; }
        .van-field__body {margin-top: 0;}
        .van-field__label { line-height: 40px;padding-right: 10px;font-size: 15px;font-weight: 400;color: #666666; }
      }
    }
    .flex {
      display: flex;justify-content: center;align-items: center;
      >div { flex: 1;word-break: break-all; }
      .title { font-size: 14px;color: $minor-text-color;line-height: 20px; }
      .label { width: 100px;flex: unset; }
    }
    .van-search {
      background: transparent;padding: 10px 16px;
      .van-cell { padding: 0 10px;height: 34px;background: rgba(255,255,255,1);border-radius: 6px;line-height: 34px; }
      .van-icon-search { font-size: 18px; }
      .van-search__content { padding-left: 0;background-color: $cold-bg-color;font-size: 14px; }
    }
    .van-field {
      margin-bottom: 12px;
      .van-cell__title.van-field__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #333333;
        line-height: 24px;
      }
      .van-field__label {
        width: auto;
      }
      .van-field__control {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999999;
        line-height: 20px;
      }
      .van-field__right-icon {
        line-height: 20px;
        font-size: 0;
      }
      .van-field__right-icon .svg-icon {
        vertical-align: -6px;
      }
    }
    .van-cell {
      height: auto;line-height: 23px;padding: 16px 15px;font-size: inherit;
      &.inside { padding: 16px 31px 16px 0;margin-left: 15px; }
      &.wide { background: transparent;margin: 0 0 14px;padding: 0; }
      &:not(:last-child)::after { left: 0;border-bottom: none; }
      &:not(:last-child) { border-bottom: 1px solid #eeeeee; }
      &.bdn::after { left: 0; border-bottom: none; }
      &.bdnafter::after { border-bottom: none; }
      &.round-input {
        margin-bottom: 19px !important;padding: 0;
        .van-field__body { min-height: 40px;background: rgba(250,250,250,1);border-radius: 20px !important;line-height: 40px;padding: 0 16px !important; }
        .van-field__left-icon { font-size: 20px;margin-right: 10px;margin-top: 10px; }
      }
      .van-cell__right-icon { color: #cccccc; }
    }
  }
</style>
