<template>
  <div class="flex-column h100">
    <div class="search-containe workSearch">
      <!--搜索框-->
      <div class="work-screen work-group">
        <!-- 物资名称搜索框 -->
        <van-search
          ref="search"
          v-model="searchParams.assets_name"
          shape="square"
          class="work-search bgfff"
          placeholder="请输入物资名称"
          clearable
          @search="onSearch"
          @input="onSearch"
          @clear="onClearSearch"
          @cancel="onSearch"
        >
        </van-search>
      </div>

      <!--筛选栏-->
      <div class="work-screen">
        <p
          v-for="(item, index) in screenList"
          :key="index"
          class="work-screen-item"
          :class="{
            'work-screen-light': active === index || item.actived,
            disabled: (index === 2 && selectedGroup.labels.length !== 1) || item.disabled,
          }"
          @click="screenTabsClick(index)"
        >
          <span class="work-screen-item-text">{{ item.label }}</span><span class="work-screen-arrow"></span>
        </p>
      </div>
    </div>
    <!--选择物资分类-->
    <template v-show="active === 1 && popupServiceShow">
      <van-overlay
        :show="active === 1 && popupServiceShow"
        :lock-scroll="false"
        class="service-lay my-overlay"
        style="z-index: 10"
        @click="overlayClose(popupServiceShow)"
      >
        <template #default>
          <div @click.stop>
            <SelectSupplies
              ref="ss"
              cancelText="重置"
              :apiParams="{}"
              @cancel="cancelService"
              @confirm="selectService"
            ></SelectSupplies>
          </div>
        </template>
      </van-overlay>
    </template>
    <!-- 选择仓库名称 -->
    <van-popup
      v-model="storeHouseShow"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-picker
        :columns="objArray2StringArray(storeHouseList, 'WarehouseName')"
        :show-toolbar="true"
        @confirm="onHouseConfirm"
        @cancel="onHouseCancel"
        :default-index="0"
      >
        <template #title>
          <span>选择仓库</span>
        </template>
      </van-picker>
    </van-popup>
    <!--物资列表-->
    <assets-list
      ref="al"
      :api="warehouseInventoryList"
      :params.sync="searchParams"
      @submit="onSelectAssets"
    />
    <!-- 已选列表 -->
    <selected ref="selected" :data="selectedData" @next="openAdd" @getGoodData="getGoodData"/>
    <!-- 添加领用申请 -->
    <AddApply
      ref="aa"
      :selectedData="selectedData"
      :warehouseId="searchParams.warehouse_id"
    />
    <div class="btns">
      <van-button
        type="default"
        round
        class="action-button"
        @click="openSelected"
      >
        已选择{{ selectedNum ? `(${selectedNum})` : "" }}
      </van-button>
      <van-button type="primary" round class="action-button" @click="openAdd">
        下一步
      </van-button>
    </div>
  </div>
</template>

<script>
import { wareHouseList, warehouseInventoryList } from '@/api/storeHouse'
import SelectSupplies from '@/views/storeHouse/receive/components/selectSupplies'
import AssetsList from '@/views/storeHouse/receive/components/assetsList'
import { objArray2StringArray } from 'utils/index'
import Selected from '@/views/storeHouse/receive/components/selected'
import AddApply from '@/views/storeHouse/receive/components/addApply'

export default {
  name: 'SearchWork',
  components: {
    SelectSupplies,
    AssetsList,
    Selected,
    AddApply
  },
  data () {
    return {
      active: null,
      searchName: '',
      launcherList: [],
      screenList: [
        { label: '仓库名称', actived: true, disabled: false },
        { label: '物资类型', actived: false, disabled: false }
      ],
      // 弹框 显示show // 可根据后续使用改动
      showInput: false,
      storeHouseShow: false,
      popupServiceShow: false,
      storeHouseList: [],
      assetsList: [],
      searchParams: {},
      selectedData: [],
      selectedNum: 0
    }
  },
  computed: {},
  created () {
    this.calendarReset()
    this.getWareHouseList()
  },
  activated () {},
  mounted () {},
  methods: {
    objArray2StringArray,
    warehouseInventoryList,
    getGoodData (value, num) {
      this.selectedNum = num
    },
    openAdd () {
      console.log('selectedData', this.selectedData)
      console.log('this.selectedNum', this.selectedNum)
      if (!this.selectedNum || !this.selectedData.length) {
        this.$toast('请先选择物资')
        return
      }
      this.selectedData.forEach((item) => {
        item.available_quantity = item.inventory
      })
      this.$refs.aa.show()
    },
    // 刷新列表
    getList () {
      this.$refs.al && this.$refs.al.onRefresh()
    },
    // 物资名称搜索
    onSearch (value) {
      this.searchParams.assets_name = value
      this.getList()
    },
    onClearSearch (e) {
      console.log(e)
      this.searchParams.assets_name = e.target.value
      this.getList()
    },
    // 仓库搜索
    onHouseConfirm (values, index) {
      this.storeHouseShow = false
      this.searchParams.warehouse_id = this.storeHouseList[index].WarehouseId
      this.screenList[0].label =
        this.storeHouseList[index] && this.storeHouseList[index].WarehouseName
      this.getList()
    },
    // 重置仓库搜索
    onHouseCancel () {
      this.storeHouseShow = false
    },
    // 筛选项高亮
    screenLight (val) {
      console.log(this.active, val)
      this.screenList[this.active].actived = val
      if (!val) {
        this.active = null
      }
      console.log(this.screenList)
    },
    // 弹框关闭
    overlayClose (name) {
      switch (name) {
        case 'popupServiceShow':
          this.popupServiceShow = false
          break
      }
      this.active = null
    },
    // 获取仓库列表
    getWareHouseList () {
      wareHouseList({ page_size: 500, page_index: 1 }).then((res) => {
        if (res.code === 200 && Array.isArray(res.data.data) && res.data.data.length > 0) {
          this.storeHouseList = res.data.data || []
          this.searchParams.warehouse_id =
            this.storeHouseList[0] && this.storeHouseList[0].WarehouseId
          this.screenList[0].label =
            this.storeHouseList[0] && this.storeHouseList[0].WarehouseName
          this.getList()
        } else {
          this.$refs.al && this.$refs.al.noLoading()
          this.$set(this.screenList[0], 'disabled', true)
        }
      })
    },
    // 表单reset
    calendarReset () {
      this.searchParams = {}
    },
    onSelectAssets (values, num) {
      this.selectedData = values
      this.$nextTick(() => {
        this.selectedNum = num
      })
    },
    openSelected () {
      this.$refs.selected.show()
      this.$refs.selected.changeAmount()
    },
    // 物资类型取消
    cancelService () {
      this.searchParams.assets_group_id = ''
      this.searchParams.assets_level_id = ''
      this.popupServiceShow = false
      this.screenLight(false)
      this.getList()
    },
    // 物资类型选择
    selectService (res) {
      this.popupServiceShow = false
      this.searchParams.assets_group_id = res.item.id || ''
      this.searchParams.assets_level_id = res.subItem.id || ''
      console.log(res)
      this.getList()
    },
    // 筛选项 - 点击
    screenTabsClick (ind) {
      if (this.screenList[ind].disabled) { return }
      this.active = ind
      switch (ind) {
        case 0:
          this.storeHouseShow = true
          break
        case 1:
          this.popupServiceShow = true
          this.$nextTick(() => {
            this.$refs.ss.show()
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btns {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 80px;
  width: calc(100% - 40px);
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
  font-size: 14px;
  z-index: 9;
  button {
    width: 45%;
  }
}
::v-deep .van-button--default {
  border: 1px solid #e1aa6c;
  color: #e1aa6c;
}
::v-deep .van-button--primary {
  background: #e1aa6c;
  border: 1px solid #e1aa6c;
  color: #fff;
}
.workSearch {
  background: #f6f8fa;
  padding-bottom: 4px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 11;
  .service-lay > div {
    height: 416px;
  }
}

  ::v-deep .van-overlay {
    z-index: 10;
  }

.work {
  font-family: PingFangSC-Regular, PingFang SC;

  &-group {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-bottom: 1px;
  }

  &-search {
    flex: auto;
    .van-search__content {
      padding-left: 0;
      border-radius: 17px;
    }
    ::v-deep .van-field {
      padding: 5px 8px 5px 0;
      margin-bottom: 0;
      background: #f5f5f5;
      text-indent: 6px;
      border-radius: 17px;
      color: #999;
      .van-field__body {
        height: 24px;
      }
    }
  }

  &-screen {
    background: #fff;
    padding: 10px 4px;
    display: flex;
    justify-content: space-around;

    &-item {
      font-size: 14px;
      color: #333;
      display: flex;
      align-items: center;
      &-text {
        max-width: 120px;
        padding-left: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      &.disabled {
        color: #c1c1c1;
      }
    }

    &-arrow {
      display: block;
      border: 4px solid transparent;
      border-top-color: #282828;
      margin-left: 4px;
      margin-top: 4px;
    }
    .disabled &-arrow {
      border-top-color: #c1c1c1;
    }

    &-light {
      color: #bc8d58;

      .work-screen-arrow {
        border-top-color: #bc8d58;
      }

      &.disabled {
        .work-screen-arrow {
          border-top-color: #c1c1c1;
        }
      }
    }
  }

  &-default-button {
    border-color: #e1aa6c;
    color: #e1aa6c;
  }

  &-button {
    width: 100%;
    padding: 10px 21px;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
  }

  &-status {
    padding: 12px;
    box-sizing: border-box;
    border-top: 1px solid #efefef;
    background: #fff;
    margin-right: -12px;
  }

  &-room {
    background: #fff;
    display: flex;

    &-main {
      flex: 1;
    }

    &-row {
      border-bottom: 1px solid #efefef;
      display: flex;
      flex-direction: column;
    }

    &-item {
      flex: 1;
      font-size: 14px;
      color: #333;
      line-height: 20px;
      padding: 12.5px 0;
      box-sizing: border-box;
      text-align: center;
    }
  }
}

.search-main {
  background: #ffffff;
  .search-sum {
    height: 34px;
    background: #ffffff;
    box-shadow: 0 0 0 0 #f1f1f1;
    font-size: 13px;
    color: #999999;
    line-height: 30px;
    padding-left: 16px;
  }
  .search-item {
    background: #ffffff;
    display: flex;
    border-top: 1px solid #eeeeee;
    align-items: center;
    padding: 12px 16px;
    height: 30px;
    font-size: 15px;
    line-height: 21px;
  }
  .search-empty {
    padding: 20px 0 30px;
  }
}

.cop-btn {
  width: 141px;
  height: 40px;
  font-size: 15px;
  border-radius: 10px;
}
</style>
