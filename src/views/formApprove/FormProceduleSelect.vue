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

    <!--选择审批单弹层-->
    <van-popup
      v-model="popupShow"
      :get-container="getBodyContainer"
      :close-on-click-overlay="false"
      position="bottom"
      class="fake-popup form-component"
    >
      <van-checkbox-group v-model="selected">
        <SearchList
          ref="sl"
          emptyText="没有搜索到审批单"
          searchTip="请输入审批单名称进行搜索"
          placeholder="输入审批单名称查找"
          :api="wfeWidgetFlowInstanceList"
          :apiParams="apiParams"
          :formatFun="trans"
          keyName="subject"
          @cancel="cancelSelected"
          @confirm="confirmSelected"
        >
          <template #list="{ list }">
            <ul>
              <li
                v-for="(item,index) in list"
                :key="index"
                class="search-item"
              >
                <div class="template-item" :class="{active: selected.indexOf(item.id) > -1}">
                  <div class="title">
                    <van-checkbox
                      :name="item.id"
                      icon-size="0.4533rem"
                      checked-color="#E1AA6C"
                      shape="square"
                    >
                      <svg-icon v-if="props.checked" slot="icon" slot-scope="props" icon-class="checkbox-on" />
                      <svg-icon v-else slot="icon" icon-class="checkbox" />
                    </van-checkbox>
                  </div>
                  <div>审批编号：{{ item.no }}</div>
                  <div>流程主题：{{ item.subject }}</div>
                  <div>{{ item.created | timeFilter }}</div>
                </div>
              </li>
            </ul>
          </template>
        </SearchList>
      </van-checkbox-group>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import { wfeWidgetFlowInstanceList } from './api'
import FormTextView from './detail/FormTextView'
import SearchList from './common/SearchList'

export default {
  name: 'FormProceduleSelect',
  components: { SearchList, FormTextView },
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
      selTemp: null,
      tempName: '',
      selected: [],
      tempArr: [],
      popupShow: false,
      wfeWidgetFlowInstanceList
    }
  },
  computed: {
    apiParams () {
      const params = {}
      if (this.opt && this.opt.props) {
        if (this.opt.props.permission) {
          params.type = this.opt.props.permission
        }

        if (this.opt.props.linkTemplate) {
          params.flow_tpl_id = this.opt.props.linkTemplate
        }
      }

      return params
    }
  },
  created () {
    // 填充默认值
    if (this.formDefaultValue(this.opt)) {
      this.selected = [].concat(this.formDefaultValue(this.opt, []))
      this.tempArr = this.copyArray(this.selected)

      this.confirmDefaultSelected()
    }
  },
  methods: {
    // 选择审批单弹框
    selectRelatedTemp () {
      this.tempArr = this.copyArray(this.selected)
      this.popupShow = true
      this.$nextTick(() => {
        this.$refs.sl.show()
      })
    },

    // 格式化list
    trans (data) {
      if (!data) { return [] }

      const arr = data.list || []

      return arr.map(item => item['flow_instance'] || {})
    },

    // 取消选择
    cancelSelected (list) {
      this.popupShow = false
      this.selected = this.tempArr

      this.confirmSelected(list)
    },

    // 初始化选中，适用场景：当有默认值的时候，如果不打开弹层，并点击确认，则_desc赋值为id，导致详情页面显示为id的问题
    confirmDefaultSelected () {
      if (this.selected && this.selected.length) {
        wfeWidgetFlowInstanceList(this.apiParams).then(res => {
          if (res.code === 200) {
            this.confirmSelected(this.trans(res.data || []))
          }
        })
      }
    },

    // 确认选择
    confirmSelected (list = []) {
      // 筛选掉selected中有，但是list里没有的数据
      // const ids = list.map(item => item.id)
      // this.selected = this.selected.filter(id => ids.indexOf(id) > -1)

      this.selTemp = this.selected && this.selected.length ? JSON.stringify(this.selected) : ''
      this.tempName = this.selected && this.selected.length ? `已选择${this.selected.length}个` : ''

      this.$set(this.model, this.opt.code, this.selected)

      const arr = list.filter(item => this.selected.indexOf(item.id) > -1)
      const names = arr && arr.length ? arr.map(ite => ite.subject || ite.id).join(',') : this.selected.join(',')
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
    .template-item {
      width: 100%;
      border-radius: 4px;
      border: 1px solid #D0D0D0;
      padding: 12px 16px;
      &.active {
        border: 1px solid #EAC9A5;
      }
      > div {
        font-size: 14px;
        color: #888888;
        line-height: 20px;
        margin-top: 8px;
      }
      > div.title {
        font-size: 16px;
        color: #333333;
        line-height: 23px;
        margin-top: 0;
        margin-bottom: 4px;
        .van-checkbox {
          float: right;
          padding-top: 3px;
        }
      }
    }
  }
</style>
