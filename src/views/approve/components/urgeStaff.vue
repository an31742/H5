<template>
  <div>
    <van-field
      v-model="selTemp"
      clickable
      name="selTemp"
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
          v-model="tempName"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          placeholder="请选择催办人"
          @click="selectRelatedTemp"
        />
      </template>

      <!--右侧icon-->
      <template #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择员工弹层-->
    <van-popup
      v-model="popupShow"
      :get-container="getBodyContainer"
      position="bottom"
      class="fake-popup form-component"
    >
      <SelectStaff
        ref="ss"
        class="link-staff"
        :defaultSelected="selected"
        :flowInstanceId="flowInstanceId"
        searchTip="请输入员工姓名进行搜索"
        @cancel="popupShow=false"
        @confirm="confirmSelected"
      ></SelectStaff>
    </van-popup>
  </div>
</template>

<script>
import SelectStaff from './selectStaff'
import mixin from '@/views/formApprove/mixin'

export default {
  name: 'FormLinkStaff',
  components: { SelectStaff },
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    },
    flowInstanceId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selTemp: null,
      tempName: '',
      selected: [],
      list: [],
      popupShow: false
    }
  },
  computed: {},
  created () {
    // 填充默认值
    if (this.opt && this.opt.value) {
      this.confirmSelected()
    }
  },
  methods: {
    // 选择员工弹框
    selectRelatedTemp () {
      this.popupShow = true
      this.$nextTick(() => {
        this.$refs.ss.show()
      })
    },

    // 清空
    reset () {
      this.selected = []
      this.confirmSelected()
    },

    // 确认选择
    confirmSelected (arr, list = []) {
      this.selected = arr || this.selected
      this.selTemp = this.selected && this.selected.length ? JSON.stringify(this.selected) : ''
      this.tempName = this.selected && this.selected.length ? `已选择${this.selected.length}个` : ''

      this.$set(this.model, this.opt.code, this.selected)
      const names = list.map(item => item['staff_name']).join(',')
      this.$set(this.model, this.opt.code + '_desc', names)

      this.popupShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .fake-popup {
    height: 90%;width: 100%;font-family: PingFangSC-Regular, PingFang SC;
    position: fixed;
    left: 0;
    overflow: hidden;
    bottom: 0;
    border-radius: 0 !important;
  }
  .van-checkbox-group {
    height: 100%;
    ::v-deep .search-main {
      background: #F6F8FA;
    }
    .van-cell__title {
      font-size: 16px;
      color: #333333;
      line-height: 23px;
    }
    ::v-deep .van-index-bar__index {
      color: #BC8D58;
    }
    ::v-deep .van-index-anchor {
      color: #999999;
      font-size: 12px;
    }
    .van-checkbox {
      display: inline-block;
      float: left;
      padding-right: 12px;
      padding-top: 3px;
    }
  }
</style>
