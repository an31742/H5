<template>
  <div>
    <van-field
      v-model="selGrid"
      clickable
      name="selGrid"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择')"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="gridName"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectRelatedGrid"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择网格弹层-->
    <van-popup v-model="popupGridShow" class="form-component" :get-container="getBodyContainer" position="bottom">
      <van-picker
        show-toolbar
        :loading="loading"
        :columns="objArray2StringArray(gridList, 'grid_name')"
        @cancel="popupGridShow=false"
        @confirm="(value, index) => { selectGrid(value, index) }"
      >
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import { wfeWidgetGridList } from './api'
import { objArray2StringArray } from 'utils/index'

export default {
  name: 'FwGrid',
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
      gridList: [],
      selGrid: null,
      gridName: '',
      loading: false,
      hasRequested: false,
      popupGridShow: false,
      objArray2StringArray
    }
  },
  mounted () {
    // this.getGridList()
  },
  methods: {
    // 网格列表
    getGridList () {
      this.loading = true
      wfeWidgetGridList({
        page: 1,
        page_size: 500
      }).then(res => {
        this.loading = false
        this.hasRequested = true
        if (res.code === 200) {
          this.gridList = res.data || []
          return
        }
        this.$toast(res.msg || '获取网格信息失败')
      })
    },
    // 选择网格弹框
    selectRelatedGrid () {
      this.popupGridShow = true
      if (!this.hasRequested) {
        this.getGridList()
      }
    },
    // 选择网格
    selectGrid (location, index) {
      const grid = this.gridList[index]
      this.popupGridShow = false

      this.gridName = grid.grid_name || ''
      this.selGrid = grid.grid_id || ''

      this.$set(this.model, this.opt.code, +grid.grid_id)
      this.$set(this.model, this.opt.code + '_desc', this.gridName)
    }
  }
}
</script>
