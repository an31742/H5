<template>
  <FormTextView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else>
    <van-field
      ref="approvalTemplate"
      v-model="selLabel"
      clickable
      name="selLabel"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="rules"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="selLabel"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="showPopup()"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择网格弹层-->
    <van-popup
      v-model="popupShow"
      class="fake-popup form-component"
      style="height: 90vh;"
      :get-container="getBodyContainer"
      position="bottom"
    >
      <SelectTemplate
        ref="ss"
        class="link-staff"
        :max="maxSelectNum"
        :searchTip="searchTip"
        :defaultSelected="defaultSelected"
        @cancel="cancelSelected"
        @confirm="confirmSelected"
      ></SelectTemplate>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import FormTextView from './detail/FormTextView'
import { getProcedureTemplateListAll as getList } from './api'
import SelectTemplate from '@/views/formApprove/common/SelectTemplate'

export default {
  name: 'FormTemplateSelect',
  components: {
    FormTextView,
    SelectTemplate
  },
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
    rules: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      sel: null,
      selLabel: '',
      tempName: '',
      popupShow: false,
      options: [],
      searchTip: '',
      maxSelectNum: 0,
      defaultSelected: [],
      tempArr: []
    }
  },
  created () {
    // 填充默认值
    if (this.formDefaultValue(this.opt)) {
      const val = this.formDefaultValue(this.opt)
      this.tempArr = this.copyArray(val)
      this.sel = val
      this.selected = val
      this.defaultSelected = val
      const desc = this.model[this.opt.code + '_desc']
      if (desc) {
        this.selLabel = this.selected && this.selected.length ? `已选择${this.selected.length}个` : ''
      }
    }

    this.init()
  },
  methods: {
    async init () {
      const res = await getList()
      if (res.code === 200) {
        if (res.data && res.data.length > 0) {
          const filteredData = res.data.filter(item => item.status !== 2 && item.del_status !== 1)
          this.options = filteredData.map(item => {
            return {
              label: item.name,
              value: item.id
              // item: item
            }
          })
        }
      }
    },
    // 选择
    selectItem (location, index) {
      const item = this.options[index] || {}
      this.popupShow = false

      this.selLabel = item.label || ''
      this.sel = item.value || ''

      this.$set(this.model, this.opt.code, this.sel)
      this.$set(this.model, this.opt.code + '_desc', this.selLabel)
    },

    // 清空
    reset () {
      this.selected = []
      this.confirmSelected()
    },

    // 取消选择
    cancelSelected (arr, list) {
      this.popupShow = false
    },

    // 确认选择
    confirmSelected (arr, list = []) {
      this.selected = arr || this.selected
      this.selLabel = this.selected && this.selected.length ? `已选择${this.selected.length}个` : ''

      this.$set(this.model, this.opt.code, this.selected)

      const names = list.map(item => item['name']).join(',')

      this.$set(this.model, this.opt.code + '_desc', names)

      this.popupShow = false
      this.defaultSelected = this.selected
    },
    showPopup () {
      this.popupShow = true
      this.defaultSelected = this.selected
      // 显示时会设置默认值
      if (this.$refs.ss) {
        this.$refs.ss.show()
      }
    },
    // 触发校验
    validateField () {
      if (this.$refs.approvalTemplate) {
        this.$refs.approvalTemplate.onBlur()
      }
    }

  }
}
</script>
