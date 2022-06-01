<template>
  <van-popup
    v-model="showPopup"
    class="select"
    position="bottom"
    :get-container="getBodyContainer"
  >
    <div class="service-title">
      <span class="service-num"> 共{{ goodsData.length }}个物资</span>
      <span class="service-btn" @click="addSelectedConst" v-if="costMaterial">添加已选收费材料</span>
    </div>
    <div class="fw-tree-select" v-if="goodsData.length">
      <div class="fw-tree-select__content">
        <div
          v-for="(item, index) in goodsData"
          :key="index"
          class="fw-tree-select__box"
        >
          <div class="fw-tree-select__box__item">
            <span style="width:25%;">{{ item.name }}</span>
            <div class="number" style="">
              <span>规格型号：<span style="color:#FF3B30;">{{
                `${item.model_specification}`
              }}</span></span>
              <span>品牌：<span style="color:#FF3B30;">{{
                `${item.brand}`
              }}</span></span>
              <van-stepper
                v-model="item.apply_amount"
                :min="0"
                :max="item.inventory"
                default-value="0"
                :button-size="15"
                theme="round"
                :key="item.id + item.warehouse_id"
                style="width: 120px;text-align:right;"
                :integer="true"
                @change="changeAmount"
              />
              <van-icon
                name="delete-o"
                color="red"
                style="font-size:16px;;margin-left: 10px;"
                @click="deleteItem(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!goodsData.length"
      class="empty-list h100 tc bgfff"
      style="height: calc(100% - 100px);"
    >
      <div>
        <p>您还未选择服务项目</p>
      </div>
    </div>
    <div class="btns">
      <div class="fw-btm-wrap btn">
        <div class="length">
          {{ `已选择`
          }}<span
            style="font-weight: bold;font-size:18px;color:#e1aa6c;margin-left:10px"
          >{{ `${num}` }}</span>
        </div>
        <div type="primary" class="round" @click="next">
          下一步
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'SelectedService',
  components: {},
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showPopup: false,
      active: 0,
      sideActive: 0,
      activeIndexes: [],
      num: 0,
      goodsData: []

    }
  },
  computed: {
    costMaterial () {
      return JSON.parse(localStorage.getItem('formModel')).srv_prop_is_cost_material
    }
  },
  watch: {
    data (val) {
      this.goodsData = val
    },
    goodsData: {
      handler (newData, old) {
        this.$emit('getGoodData', newData, this.num)
        this.$store.commit('workorder/SET_SELECT_LIST', newData)
      },
      deep: true
    }
  },
  created () {
    this.changeAmount()
  },
  methods: {
    addSelectedConst () {
      const materialData = JSON.parse(localStorage.getItem('formModel')).srv_prop_is_cost_material
      console.log('materialData', materialData)
      const materialDataName = materialData?.map(item => item.name).toString()
      const wareHouseList = JSON.parse(JSON.stringify(this.$store.getters.materialList))
      if (!materialData) {
        return false
      }
      // 如果仓库有数据
      if (wareHouseList.length > 0) {
        const wareFlag = wareHouseList.some(item => {
          const arrList = materialData.map(it => it.assets_id)
          return arrList.includes(item.id)
        })
        if (!wareFlag) {
          if (materialDataName.length === 0) {
            this.$notify(`暂无库存`)
          } else {
            this.$notify(`${materialDataName},暂无库存`)
          }
        } else {
          const tempData = []
          wareHouseList.forEach(t => {
            materialData.forEach(i => {
              if (i.assets_id === t.id) {
                t.apply_amount = i.number
                tempData.push(t)
              }
            })
          })

          /**
          * 需求
          * 1已有的就添加数量，
          * 2没有的就添加下一个不会继续添加
          * */
          if (this.goodsData.length > 0) {
            const insterDataId = []
            this.goodsData.forEach((item, index, arr) => {
              tempData.forEach((el, ind, arry) => {
                if (el.id === item.id) {
                  insterDataId.push(el.id)
                  item.apply_amount = el.apply_amount + item.apply_amount
                }
              })
            })
            const goodsDatas = JSON.parse(JSON.stringify(this.goodsData))
            const flag = tempData.every(v => insterDataId.includes(v.id))
            if (!flag) {
              const arr = tempData.filter(v => !insterDataId.includes(v.id))
              this.$nextTick(() => {
                this.goodsData = goodsDatas.concat(arr)
                this.$emit('getGoodData', this.goodsData)
                let num = 0
                this.goodsData.forEach(e => {
                  if (e.apply_amount > 0) {
                    num += e.apply_amount
                  }
                })
                this.num = num
                this.$emit('getGoodData', this.goodsData, num)
                this.$store.commit('workorder/SET_SELECT_LIST', this.goodsData)
              })
            } else {
              this.$nextTick(() => {
                this.goodsData = goodsDatas
                let num = 0
                this.goodsData.forEach(e => {
                  if (e.apply_amount > 0) {
                    num += e.apply_amount
                  }
                })
                this.num = num
                this.$emit('getGoodData', this.goodsData, num)
                this.$store.commit('workorder/SET_SELECT_LIST', this.goodsData)
              })
            }
          } else {
            this.goodsData = tempData
          }
        }
      } else {
        this.goodsData = []
        if (materialDataName.length === 0) {
          this.$notify(`暂无库存`)
        } else {
          this.$notify(`${materialDataName},暂无库存`)
        }
      }
    },
    show () {
      this.showPopup = true
    },
    next () {
      this.showPopup = false
      this.$emit('next')
    },
    deleteItem (index) {
      this.goodsData[index].apply_amount = 0
    },
    changeAmount () {
      let num = 0
      this.goodsData.forEach(e => {
        if (e.apply_amount > 0) {
          num += e.apply_amount
        }
      })
      this.num = num
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-sidebar-item--select::before {
  width: 2px;
  background: #e1aa6c;
  height: 20px;
}
::v-deep .van-tab--active .van-tab__text {
  color: #333333;
}
::v-deep .van-tab__text {
  color: #999999;
  font-size: 15px;
}
.select {
  width: 100%;
  height: 90%;
  z-index: 9999 !important;
}
.service-title {
  display: flex;
  justify-content: space-between;
  padding: 10px;
    border-bottom: 1px solid #f1f1f1;
  .service-num {
    font-size: 13px;
    color: #999999;
  }
  .service-btn{
    font-size: 13px;
    color: #02A7f0;

  }
}

.fw-tree-select {
  position: relative;
  display: flex;
  font-size: 14px;
  user-select: none;
  background: #ffffff;

  &__nav {
    //flex: 1;
    //width: 168px;
    flex-basis: 48%;
    overflow-y: auto;
    background-color: #fff;
    -webkit-overflow-scrolling: touch;

    &-item {
      padding: 14px 12px;
    }
  }

  &__content {
    //   display: flex;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  &__box {
    width: calc(100% - 40px);
    padding: 15px 20px 15px 20px;
    border-bottom: 1px solid #efefef;
    &__item {
      display: flex;
      justify-content: space-between;
    }
    &__text {
      font-size: 13px;
      color: #999999;
      margin-top: 10px;
    }
  }

  &__selected {
    position: absolute;
    top: 50%;
    right: 16px;
    margin-top: -8px;
    font-size: 16px;
  }
}

.fw-sidebar-item {
  position: relative;
  display: block;
  box-sizing: border-box;
  padding: 15px 0px 15px 16px;
  overflow: hidden;
  color: #333;
  font-size: 14px;
  line-height: 20px;
  background-color: #fff;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;

  &:active {
    background-color: #f2f3f5;
  }

  &__text {
    position: relative;
    word-break: break-all;
  }

  &:not(:last-child)::after {
    border-bottom-width: 1px;
  }

  &--select {
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #e1aa6c;
  }

  &--select,
  &--select:active {
    background-color: #f5f5f5;
    border-right-color: #f5f5f5;
  }

  &--select::before {
    position: absolute;
    top: 50%;
    left: 0;
    width: 2px;
    height: 24px;
    background-color: #e1aa6c;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    content: "";
  }

  &--disabled {
    color: #c8c9cc;
    cursor: not-allowed;
  }

  &--disabled:active {
    background-color: #f7f8fa;
  }
}
.btns {
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  justify-content: end;
  padding: 0 20px;
  border-top: 1px solid #f1f1f1;
  .length {
    line-height: 37px;
    margin-right: 20px;
  }
  .fw-btm-wrap {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
  }
  .round {
    width: 200px;
    background: #e1aa6c;
    border: 0.02667rem solid #e1aa6c;
    color: #fff;
    height: 35px;
    border-radius: 35px;
    text-align: center;
    line-height: 35px;
    font-size: 16px;
  }
}
.popup {
  padding: 0 20px 20px;
  border-radius: 10px;
  width: 80%;
  div {
    margin-bottom: 10px;
  }
}
.number {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 75%;
  font-size: 12px;
}
</style>
