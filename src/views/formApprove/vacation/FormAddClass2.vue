<template>
  <FormTextView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else>
    <van-field
      v-model="sel"
      clickable
      name="sel"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择', true)"
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
          @click="popupShow=true"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>
    <p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>

    <!--选择网格弹层-->
    <van-popup v-model="popupShow" class="form-component" :get-container="getBodyContainer" position="bottom">
      <van-picker
        show-toolbar
        :columns="objArray2StringArray(options, 'label')"
        @cancel="popupShow=false"
        @confirm="(value, index) => { selectItem(value, index) }"
      >
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
import mixin from '../mixin'
import { mapGetters } from 'vuex'
import FormTextView from '../detail/FormTextView'
import { objArray2StringArray } from 'utils/index'
import { getStaffAttendanceAbnormalPlanList as getList } from '../api'
import moment from 'moment'
export default {
  name: 'FormAddClass2',
  components: {
    FormTextView
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
    launcherId: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      sel: null,
      selLabel: '',
      options: [],
      popupShow: false,
      objArray2StringArray
    }
  },
  computed: {
    ...mapGetters(['userData']),
    staffId () {
      let staffId = this.model[this.opt.props.staffKey] || 0
      /// 当前申请的用户
      if (this.opt.props.staffKey === 'CURRENT_USER') {
        // staffId = this.userData.id
        staffId = this.model['applyLauncher'] || this.launcherId
      }
      return staffId
    }
  },
  watch: {

  },
  created () {
    // 填充默认值
    if (this.formDefaultValue(this.opt)) {
      // const val = this.formDefaultValue(this.opt)

      // const index = this.opt.props.options.findIndex(t => t.value + '' === val + '')

      // index > -1 && this.selectItem('', index)
      this.sel = this.model[this.opt.code]
      this.selLabel = this.model[this.opt.code + '_desc']
    }
    this.getStaffPlanList()
  },
  methods: {
    reset () {
      this.options = []
      this.$set(this.model, this.opt.code, null)
      this.$set(this.model, this.opt.code + '_desc', null)

      this.selLabel = ''
      this.sel = ''
    },
    // 获取员工排班班次
    async getStaffPlanList () {
      // 添加查询条件 0 当前员工
      const data = {
        staff_id: this.staffId,
        month: this.opt.props.month
      }

      const res = await getList(data)
      if (res.code === 200) {
        const options = res.data || this.opt.props.options || []
        this.options = options.map(item => {
          return {
            label: `${item.date} ${item.term_name} ${item.clock_node}`,
            value: [item.plan_id, item.term_id, item.clock_id, item.clock_flag].join('-'),
            data: item
          }
        })
      } else {
        this.$toast(res.msg)
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

      // 用于限制 补卡时间组件
      this.$set(this.model, `_startTime`, moment(item.data.begin_time).format())
      this.$set(this.model, `_endTime`, moment(item.data.end_time).format())
    }
  }
}
</script>
