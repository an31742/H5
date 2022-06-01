<template>
  <FormTextView v-if="isReadonly" :model="model" :opt="opt" />
  <div v-else>
    <van-field
      v-model="selTemp"
      clickable
      name="selTemp"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="isReadonly"
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
          :disabled="isReadonly"
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

    <!--选择组织架构弹层-->
    <van-popup
      v-model="popupShow"
      :get-container="getBodyContainer"
      :close-on-click-overlay="false"
      position="bottom"
      class="fake-popup form-component"
    >
      <van-radio-group v-model="selected">
        <SearchList
          ref="sl"
          emptyText="没有搜索到组织架构"
          searchTip="请输入组织架构名称进行搜索"
          placeholder="输入组织架构名称查找"
          :api="wfeWidgetDepartmentList"
          :apiParams="apiParams"
          :formatFun="trans"
          @cancel="cancelSelected"
          @confirm="confirmSelected"
        >
          <template #list="{ list }">
            <ul class="template-item">
              <li v-for="(item,index) in list" :key="index">
                <!--一级-->
                <div class="level-1" :class="{active: selected === item.id}">
                  <div class="title flex">
                    <div>
                      <van-radio
                        :name="item.id"
                        icon-size="0.4533rem"
                        checked-color="#E1AA6C"
                        @click.stop
                      >
                        <svg-icon v-if="props.checked" slot="icon" slot-scope="props" icon-class="checkbox-on" />
                        <svg-icon v-else slot="icon" icon-class="checkbox" />
                      </van-radio>
                      <span @click="item.expend = !item.expend">{{ item.name }}</span>
                    </div>
                    <svg-icon v-if="item.children && item.children.length" icon-class="arrow-down" style="font-size: 14px;color: #C7C7C7;" @click="item.expend = !item.expend" />
                  </div>
                  <!--二级-->
                  <div v-for="(ite, ind) in item.children" v-show="item.expend" :key="ind" :title="ite.name">
                    <div class="level-2" :class="{active: selected===ite.id}">
                      <div class="title flex">
                        <div>
                          <van-radio
                            :name="ite.id"
                            icon-size="0.4533rem"
                            checked-color="#E1AA6C"
                            @click.stop
                          >
                            <svg-icon v-if="props.checked" slot="icon" slot-scope="props" icon-class="checkbox-on" />
                            <svg-icon v-else slot="icon" icon-class="checkbox" />
                          </van-radio>
                          <span @click="ite.expend = !ite.expend">{{ ite.name }}</span>
                        </div>
                        <svg-icon v-if="ite.children && ite.children.length" icon-class="arrow-down" style="font-size: 14px;color: #C7C7C7;" @click="ite.expend = !ite.expend"/>
                      </div>
                      <!--三级-->
                      <div v-for="(child, idx) in ite.children" v-show="ite.expend" :key="idx" :title="child.name">
                        <div class="level-3" :class="{active: selected===child.id}">
                          <div class="title flex">
                            <div>
                              <van-radio
                                :name="child.id"
                                icon-size="0.4533rem"
                                checked-color="#E1AA6C"
                              >
                                <svg-icon v-if="props.checked" slot="icon" slot-scope="props" icon-class="checkbox-on" />
                                <svg-icon v-else slot="icon" icon-class="checkbox" />
                              </van-radio>
                              {{ child.name }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </SearchList>
      </van-radio-group>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import { mapGetters } from 'vuex'
import SearchList from './common/SearchList'
import { wfeWidgetDepartmentList } from './api'
import FormTextView from './detail/FormTextView'

export default {
  name: 'FormLinkOrganize',
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
      tempName: '',
      selTemp: undefined,
      selected: undefined,
      tempArr: undefined,
      popupShow: false,
      list: [],
      isReadonly: false,
      wfeWidgetDepartmentList
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ]),
    apiParams () {
      if (this.opt && this.opt.props && this.opt.props.permission) {
        return { data_authority: this.opt.props.permission }
      }
      return {}
    }
  },
  created () {
    this.isReadonly = this.formReadonly(this.opt)
    // 填充默认值
    if (this.model[this.opt.code]) {
      this.selected = this.model[this.opt.code]
    } else if (this.opt.props && this.opt.props.current) {
      this.selected = this.userData['dep_id'] || ''
    } else if (this.formDefaultValue(this.opt)) {
      this.selected = this.formDefaultValue(this.opt, '')
    }

    this.tempArr = this.selected
    this.confirmDefaultSelected()
  },
  methods: {
    // 选择组织架构弹框
    selectRelatedTemp () {
      this.tempArr = this.selected
      this.popupShow = true
      this.$nextTick(() => {
        this.$refs.sl.show()
      })
    },

    // 格式化数据
    trans (data) {
      if (!data) { return [] }

      data = [].concat(data)
      return data.map(item => {
        let children = []
        if (item.children instanceof Array) {
          children = this.trans(item.children)
        }
        return {
          name: item.name,
          id: item.id,
          key: item.id,
          children: children,
          expend: false
        }
      })
    },

    // 循环获取name
    getNames (deps, id) {
      let res = {}
      const loop = (list) => {
        for (let i = 0; i < list.length; i++) {
          if (id === list[i].id) {
            res = list[i]
          }
          if (list[i].children) {
            loop(list[i].children)
          }
        }
      }

      loop(deps)

      return res.name
    },

    // 取消选择
    cancelSelected (list) {
      this.popupShow = false
      this.selected = this.tempArr

      this.confirmSelected(list)
    },

    // 初始化选中，适用场景：当有默认值的时候，如果不打开弹层，并点击确认，则_desc赋值为id，导致详情页面显示为id的问题
    confirmDefaultSelected () {
      if (this.selected) {
        wfeWidgetDepartmentList(this.apiParams).then(res => {
          if (res.code === 200) {
            const list = this.trans(res.data || [])
            this.confirmSelected(list)
            this.tempName = this.getNames(list, this.selected)
          }
        })
      }
    },

    // 确认选择
    confirmSelected (list) {
      this.selTemp = this.selected

      this.tempName = this.getNames(list, this.selected) || this.model[this.opt.code + '_desc']

      this.$set(this.model, this.opt.code, this.selected)

      this.$set(this.model, this.opt.code + '_desc', this.tempName)

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

  .van-radio-group {
    height: 100%;
    .template-item {
      border-top: 1px solid #EFEFEF;

      .van-radio {
        display: inline-block;
        height: 17px;
        line-height: 20px;
        float: left;
        padding-left: 16px;
      }
      .level-1, .level-2, .level-3 {
        text-indent: 16px;
        width: 100%;
        box-sizing: border-box;
      }
      .level-2 {
        .van-radio {
          padding-left: 43px;
        }
      }
      .level-3 {
        .van-radio {
          padding-left: 70px;
        }
      }
      .title {
        border-bottom: 1px solid #EFEFEF;
        font-size: 14px;
        color: #333333;
        padding: 17px 16px 17px 0;
        line-height: 20px;
      }
    }
  }
</style>
