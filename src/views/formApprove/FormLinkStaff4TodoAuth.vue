<template>
  <FormTextView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else>
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
      :style="{marginBottom: `${marginBottom}px`}"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="tempName"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectRelatedTemp"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>
    <p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>

    <!--选择员工弹层-->
    <van-popup
      v-model="popupShow"
      :get-container="getBodyContainer"
      :close-on-click-overlay="false"
      position="bottom"
      class="fake-popup form-component"
    >
      <SelectStaff
        ref="ss"
        class="link-staff"
        :max="maxSelectNum"
        :searchTip="searchTip"
        :defaultSelected="selected"
        :data-authority="opt.props.permission"
        @cancel="cancelSelected"
        @confirm="confirmSelected"
      ></SelectStaff>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import { mapGetters } from 'vuex'
import { wfeWidgetStaffList } from './api'
import FormTextView from './detail/FormTextView'
import SelectStaff from '@/views/formApprove/common/SelectStaff'

export default {
  name: 'FormLinkStaff',
  components: { SelectStaff, FormTextView },
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
    max: {
      type: Number,
      default: 0
    },
    searchTip: {
      type: String,
      default: '请输入员工姓名进行搜索'
    },
    marginBottom: {
      type: Number,
      default: 12
    }
  },
  data () {
    return {
      selTemp: null,
      tempName: '',
      selected: [],
      tempArr: [],
      list: [],
      popupShow: false,
      maxSelectNum: 0 // 0为多选不限制
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  created () {
    // 填充默认值
    if (this.model[this.opt.code]) {
      this.selected = [].concat(this.model[this.opt.code])
    } else if (this.opt.props && this.opt.props.current) {
      this.selected = [].concat(this.userData.id)
    } else if (this.formDefaultValue(this.opt)) {
      this.selected = [].concat(this.formDefaultValue(this.opt, []))
    }

    this.selected = this.selected.map(t => {
      if (typeof t === 'string') {
        return parseInt(t.replace(/B#/g, ''))
      }
      return null
    })

    const desc = this.model[this.opt.code + '_desc']
    if (desc) {
      this.tempName = desc
    }

    // 单选或者多选
    this.maxSelectNum = this.max || 0
    if (this.opt.props && this.opt.props.mode && this.opt.props.mode === 'single') {
      this.maxSelectNum = 1
    }
    this.tempArr = this.copyArray(this.selected)
    // this.confirmDefaultSelected()
  },
  methods: {
    // 选择员工弹框
    selectRelatedTemp () {
      this.tempArr = this.copyArray(this.selected)
      this.popupShow = true
      this.$nextTick(() => {
        this.$refs.ss.show()
      })
    },

    // 初始化选中，适用场景：当有默认值的时候，如果不打开弹层，并点击确认，则_desc赋值为id，导致详情页面显示为id的问题
    confirmDefaultSelected () {
      if (this.selected && this.selected.length) {
        const param = { ids: this.selected.toString() }

        wfeWidgetStaffList(param).then(res => {
          if (res.code === 200) {
            this.confirmSelected(this.selected, res.data || [])
          }
        })
      }
    },

    // 清空
    reset () {
      this.selected = []
      this.confirmSelected()
    },

    // 取消选择
    cancelSelected (arr, list) {
      this.popupShow = false
      this.selected = this.tempArr
    },

    // 确认选择
    confirmSelected (arr, list = []) {
      this.selected = arr || this.selected

      // 筛选掉selected中有，但是list里没有的数据
      // const ids = list.map(item => item['staff_id'])
      // this.selected = this.selected.filter(id => ids.indexOf(id) > -1)

      this.selTemp = this.selected && this.selected.length ? JSON.stringify(this.selected) : ''

      if (this.selected.length > 1) {
        this.tempName = `已选择${this.selected.length}个`
      } else if (this.selected.length === 1) {
        this.tempName = list[0].staff_name
      } else {
        this.tempName = null
      }

      // 单选时，返回int，而不是array
      if (this.opt.props && this.opt.props.mode && this.opt.props.mode === 'single') {
        this.$set(this.model, this.opt.code, this.selected[0] ? 'B#' + this.selected[0] : '')
      } else {
        this.$set(this.model, this.opt.code, this.selected.map(t => `B#${t}`))
      }
      const names = list.map(item => item['staff_name'] || item['staff_id']).join(',')
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
  ::v-deep .search-main {
    background: #F6F8FA;
  }
  .van-checkbox-group {
    height: 100%;

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
      padding-right: 12px;
      padding-top: 3px;
    }
  }
</style>
