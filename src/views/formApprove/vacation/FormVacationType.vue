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
      :placeholder="formLabel(opt, '请选择')"
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
        :columns="options"
        :defaultIndex="defaultIndex"
        @cancel="popupShow=false"
        @confirm="(value, index) => { selectItem(value, index) }"
      >
        <template #option="item" >
          <div
            :key="item.leave_vacation_type"
            :value="item.leave_vacation_type"
          >
            {{ item.name }}
            <strong v-if="item.type===3">(不限额)</strong>
            <strong v-else>
              <!-- (剩余1天) -->
              (剩余{{ item.usable_num }}{{ VacationUnit[item.grant_num_unit] }})
            </strong>
          </div>
        </template>
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixin from '../mixin'
import FormTextView from '../detail/FormTextView'
import { getWidgetVacationTypeList as getList } from '../api'
import { VacationUnit } from '@/utils/const'
export default {
  name: 'FormVacationType',
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
    }
  },
  data () {
    // {“3”:“天”，“2”：“小时”}
    const vactinUnitObj = {}
    VacationUnit.forEach(t => {
      vactinUnitObj[t.value] = t.label
    })

    return {
      sel: null,
      selLabel: '',
      popupShow: false,
      options: [],
      VacationUnit: vactinUnitObj,
      defaultIndex: undefined
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  created () {
    this.getOptions()

    this.sel = this.model[this.opt.code]
    this.selLabel = this.model[this.opt.code + '_desc']
    // 为空的时候情况数据
    this.$watch(`model.${this.opt.code}`, val => {
      if (!val) {
        this.selLabel = ''
      }
    })
  },
  watch: {
    'model.applyLauncher' (val) {
      if (val) {
        this.getOptions()
      } else {
        this.options = []
      }
    }
  },
  methods: {

    async getOptions () {
      const data = {
        staff_id: this.model.applyLauncher || this.userData.id
      }

      const res = await getList(data)
      if (res.code === 200) {
        const options = res.data.list || []
        this.options = options.map(t => {
          // 假期可以余额为0 && 不是 不限期限的
          t.disabled = t.usable_num === 0 && t.type !== 3
          return t
        })
        // 默认选中
        this.defaultIndex = this.options.findIndex(t => t.leave_vacation_type === this.sel)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 选择
    selectItem (item, index) {
      this.popupShow = false
      // console.log(item)
      this.selLabel = item.name || ''
      this.sel = item.leave_vacation_type || ''
      // 请假时长的单位
      this.$set(this.model, 'unit', item.grant_num_unit)
      // 假期余额
      this.$set(this.model, 'usable_num', item.usable_num)

      this.$set(this.model, this.opt.code, this.sel)
      this.$set(this.model, this.opt.code + '_desc', this.selLabel)

      this.$set(this.model, 'duration', 0)
      this.$set(this.model, 'duration_desc', '')
    }
  }
}
</script>
