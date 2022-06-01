<template>
  <van-overlay
    :show="popupShow"
    :lock-scroll="false"
    class="my-overlay"
    style="background: #F7F8FA;"
    @click="popupShow=false"
  >
    <template #default>
      <div @click.stop>
        <van-index-bar>
          <div class="flex-column my-overlay">
            <van-search
              v-model="searchGroupVal"
              placeholder="请输入项目名"
              style="z-index: 99;"
              @search="selectGroup"
              @input="selectGroup"
              @blur="selectGroup"
              @clear="onCancel"
              @cancel="onCancel"
            />

            <div class="expand">
              <empty-list v-if="!Object.keys(groupColumns).length" style="height: 100% !important;"></empty-list>
              <van-checkbox-group v-model="selected" v-else>
                <template v-for="(value, key, index) in groupColumns">
                  <van-index-anchor :key="index" :index="key"/>
                  <van-cell-group :key="'group' + index">
                    <van-cell v-for="(chd, idx) in value" :key="idx" :title="chd.title">
                      <template #right-icon>
                        <van-checkbox
                          :name="chd['id']"
                          style="padding-right: 0.5rem;"
                          icon-size="0.533rem"
                          checked-color="#E1AA6C"
                          shape="square"
                          @click="onCheckBoxClick"
                        >
                          <svg-icon v-if="props.checked" slot="icon" slot-scope="props" icon-class="checkbox-on"/>
                          <svg-icon v-else slot="icon" icon-class="checkbox"/>
                        </van-checkbox>
                      </template>
                    </van-cell>
                  </van-cell-group>
                </template>
              </van-checkbox-group>
            </div>

            <div class="bottom-cop">
              <a class="sel-all">
                <span>
                  <van-checkbox
                    v-model="selAll"
                    style="padding-right: 0.2rem;"
                    icon-size="0.533rem"
                    checked-color="#E1AA6C"
                    shape="square"
                    name="selAll"
                    @click="ckbClick"
                  >
                    <svg-icon v-if="props.checked" slot="icon" slot-scope="props" icon-class="checkbox-on"/>
                    <svg-icon v-else slot="icon" icon-class="checkbox"/>
                  </van-checkbox>
                </span>
                <span>全选</span>
              </a>
              <van-button size="large" type="primary" class="round" @click="chooseGroup" :disabled="!selected.length">
                确定{{ selected.length ? '(' + selected.length + ')' : '' }}
              </van-button>
            </div>
          </div>
        </van-index-bar>
      </div>
    </template>
  </van-overlay>
</template>

<script>
import { mapGetters } from 'vuex'
import emptyList from '@/views/components/emptyList'

export default {
  name: '',
  props: {},
  components: { emptyList },
  data () {
    return {
      selAll: false,

      popupShow: false,

      selected: [],

      indexList: [],

      showList: [],

      searchGroupVal: ''
    }
  },
  computed: {
    ...mapGetters([
      'userGroupList'
    ]),
    groupColumns () {
      return this.formatGroup(this.showList)
    }
  },
  watch: {},
  created () {
    this.initGroupColumns(true)
  },
  methods: {
    // 显示弹框
    show () {
      this.popupShow = true
    },

    // 初始化组团列表
    initGroupColumns (flag) {
      this.showList = [].concat(this.userGroupList || [])
      this.selected = this.showList.map(i => i.id)
      this.selAll = true // 默认全选
      flag && this.chooseGroup()
    },

    // 搜索小区
    selectGroup () {
      this.showList = [].concat(this.userGroupList || []).filter(i => i.name.indexOf(this.searchGroupVal) > -1)

      // this.ckbClick()
      this.onCheckBoxClick()
    },

    onCancel (val) {
      // this.initGroupColumns()
      this.showList = [].concat(this.userGroupList || [])
    },

    // 格式化小区列表
    formatGroup (list) {
      const res = {}
      const obj = {}
      list = [].concat(list)
      for (let i = 0; i < list.length; i++) {
        if (list[i].pin_yin) {
          let key = list[i].pin_yin.substr(0, 1)
          key = key.toLocaleUpperCase()
          list[i].title = list[i].name
          res[key] = res[key] || []
          res[key].push(list[i])
        }
      }
      this.indexList = Object.keys(res).sort()
      this.indexList.map(item => {
        obj[item] = res[item]
      })

      return obj
    },

    // 全选 / 全不选
    ckbClick () {
      this.selected = this.selAll ? [].concat(this.showList || []).map(i => i.id) : []
    },
    onCheckBoxClick (a, b) {
      this.selAll = this.selected.length === this.userGroupList.length
    },

    // 选择小区
    chooseGroup () {
      this.$emit('confirm', {
        values: this.selected,
        isAll: this.selected.length && this.selected.length === this.userGroupList.length,
        labels: this.userGroupList.filter(i => this.selected.includes(i.id)).map(i => i.title || i.name)
      })
      this.popupShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.my-overlay{
    height: calc(100vh - constant(safe-area-inset-bottom));
    height: calc(100vh - env(safe-area-inset-bottom));
}
.form {
  .search-input {
    margin-top: 30px;
  }

  .van-field__body .van-field__control {
    text-align: left;
  }
}

.bottom-cop {
  padding: 10px 16px;
  background: #fff;
  margin-top: 2px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  .sel-all {
    padding-top: 8px;
    >span {
      float: left;
    }
  }
  .round {
    width: 165px;
    height: 44px;
    border: none;
    background: #E1AA6C;
    border-radius: 6px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 16px;
  }
}

::v-deep .vue-recycle-scroller__item-wrapper {
  .vue-recycle-scroller__item-view:not(:last-child) {
    .van-cell {
      border-bottom: 1px solid #eee;
    }
  }
}
::v-deep .van-search__content {
  border-radius: 15px;
}
</style>
