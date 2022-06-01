<template>
  <div>
    <van-field
      v-model="selAddress"
      clickable
      name="selAddress"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择', true)"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="selAddress"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="true"
          :placeholder="formLabel(opt, '请选择')"
          @click="popupShow = true"
        />
      </template>

      <!--右侧icon-->
      <template v-if="false" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>
    <!--<p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>-->

    <!--选择省市区弹层-->
    <van-popup
      v-model="popupShow"
      :get-container="getBodyContainer"
      position="bottom"
      class="fake-popup form-component"
    >
      <div class="pop-wrapper">
        <div class="selected">
          <van-steps
            class="bdn bgfff"
            direction="vertical"
            active="0"
          >
            <van-step v-for="(item, idx) in selectedItems" :key="idx" class="bdn" :class="{hollow: !item.Name}">
              <div @click="stepClick(idx, item)">
                {{ item.Name || `请选择${{1:'省份',2:'城市',3:'地区'}[currentStep]}` }}
              </div>
            </van-step>
          </van-steps>
        </div>
        <div class="tree">
          <indexBar :list.sync="currentList">
            <template #list="{ value }">
              <van-cell
                v-for="(chd, idx) in value"
                :key="idx"
                clickable
                :title="chd.title"
                @click="itemClick(chd)"
              ></van-cell>
            </template>
          </indexBar>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import mixin from '../mixin'
import { getRegionTree } from '../api'
import indexBar from '../components/IndexBar'

export default {
  name: 'FormLocation',
  components: { indexBar },
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
      selAddress: null,
      currentStep: 1,

      selectedProvince: {},
      selectedCity: {},
      selectedDistrict: {},
      selected: [],

      list: [],
      popupShow: false
    }
  },
  computed: {
    currentList () {
      if (this.currentStep === 1) {
        return this.list
      }

      if (this.currentStep === 2) {
        return this.selectedProvince.Children
      }

      return this.selectedCity.Children
    },
    selectedItems () {
      const arr = [this.selectedProvince, this.selectedCity, this.selectedDistrict]

      return arr.splice(0, this.currentStep)
    }
  },
  created () {
    this.getRegionData()
  },
  methods: {
    // 获取省市区数据
    getRegionData () {
      getRegionTree({ level: 3 }).then(res => {
        if (res.code === 200) {
          this.list = res.data || []

          this.setDefault()
          return
        }
        this.$toast(res.msg || '获取城市数据失败')
      })
    },

    // 填充默认值
    setDefault () {
      // 填充默认值
      if (this.model[this.opt.code] || this.formDefaultValue(this.opt)) {
        const arr = this.model[this.opt.code] || this.formDefaultValue(this.opt, [])

        this.setSelect(arr)
      }
    },

    // 填充选择项
    setSelect (arr) {
      arr = arr.reverse()

      while (arr.length) {
        const id = arr.pop()
        const list = this.currentList.filter(item => item.ID === id)

        list && list[0] && this.itemClick(list[0])
      }
    },

    // 选择
    itemClick (item) {
      this.selected.push(item.ID)

      if (this.currentStep === 3) {
        this.selectedDistrict = item
        this.confirmSelected()
      } else if (this.currentStep === 1) {
        this.selectedProvince = item
        this.currentStep++
      } else {
        item.Children = item.Children || []
        this.selectedCity = item
        this.currentStep++
      }
    },

    // 顶部选择
    stepClick (idx, item) {
      if (!item || !item.Name) { return }

      this.currentStep = idx + 1
      const arr = ['selectedProvince', 'selectedCity', 'selectedDistrict']

      while (3 - idx) {
        idx++
        const key = arr.pop()
        this.selected.pop()
        this[key] = {}
      }
    },

    // 确认选择
    confirmSelected () {
      this.selAddress = `${this.selectedProvince.Name}${this.selectedCity.Name}${this.selectedDistrict.Name}`

      this.$set(this.model, this.opt.code, this.selected)
      this.$set(this.model, this.opt.code + '_desc', this.selAddress)

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
    .pop-wrapper {
      height: 100%;
      background: #F6F8FA;
      display: flex;
      flex-direction: column;
      .tree {
        font-size: 16px;
        color: #333333;
        line-height: 23px;
        flex: 1;
        overflow-y: scroll;
      }

      ::v-deep .van-steps {
        .van-hairline.van-step.van-step--vertical {
          font-size: 16px;
          color: #333333;
          line-height: 23px;
          .van-step__title {
            font-size: 16px;
            color: #333333;
            line-height: 23px;
          }
          .van-step__icon, .van-step__circle {
            color: #E1AA6C;
            height: 8px;
            width: 8px;
            background: #E1AA6C;
            border-radius: 8px;
          }
          .van-icon-checked::before {
            content: none;
          }
          .van-step__line {
            background: #E1AA6C;
          }
          &::after {
            border-bottom-width: 0;
          }
          &.hollow {
            .van-step__title {
              color: #E1AA6C;
            }
            .van-step__icon, .van-step__circle {
              color: #E1AA6C;
              height: 2px;
              width: 2px;
              background: #fff;
              border-radius: 8px;
              border: 3px solid #E1AA6C;
            }
          }
        }
      }
    }
  }

  ::v-deep .fw-field {
    &.van-cell.van-field {
      padding: 17px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 19px;
      border-bottom: 1px solid #EFEFEF;
      &.rich {
        display: block;
        .van-field__control {
          margin-top: 5px;
        }
        .van-field__label {
          width: 100%;
        }
      }
      .van-field__label {
        color: #333;
      }
      .van-field__control {
        color: #999;
        -webkit-text-fill-color: #999;
      }
    }
  }

  // 只读状态
  .readonly {
    ::v-deep .fw-field.van-field {
      margin-bottom: 0;
    }
  }
</style>
