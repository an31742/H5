<template>

  <SearchListWithInit
    ref="sl"
    emptyText="没有搜索到员工"
    placeholder="输入员工姓名查找"
    :searchTip="searchTip"
    :api="wfeWidgetStaffList"
    :apiParams="apiParams"
    uni-key="staff_id"
    @cancel="(list) => $emit('cancel', selected, list)"
    @confirm="confirm"
  >
    <template #list="{ list }">
      <van-radio-group v-model="selectedItem" @change="changeSelected">
        <van-cell-group>
          <van-cell
            v-for="(chd, idx) in list"
            :key="idx"
            clickable
            :class="{active: selectedItem===chd.staff_id}"
          >
            <template #title>
              <van-radio
                :name="chd['staff_id']"
                icon-size="0.4533rem"
                checked-color="#E1AA6C"
              >
                <svg-icon v-if="props.checked" slot="icon" slot-scope="props" icon-class="checkbox-on" />
                <svg-icon v-else slot="icon" icon-class="checkbox" />
                <span style="font-size:16px">
                  {{ chd.staff_name }}
                </span>
              </van-radio>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </template>
  </SearchListWithInit>
</template>

<script>
import { wfeWidgetStaffList } from '../api'
import SearchListWithInit from './SearchListWithInit'
export default {
  name: 'SelectStaff',
  components: { SearchListWithInit },
  props: {
    defaultSelected: {
      type: Array,
      default: () => []
    },
    dataAuthority: {
      type: [Number, String],
      default: undefined
    },
    max: {
      type: Number,
      default: 0
    },
    searchTip: {
      type: String,
      default: '请输入员工姓名进行搜索'
    }
  },
  data () {
    return {
      selected: [],
      selectedItem: undefined,
      wfeWidgetStaffList,
      hasSelectedNum: 0
    }
  },
  computed: {
    apiParams () {
      if (typeof this.dataAuthority === 'number') {
        return { data_authority: this.dataAuthority }
      }
      return {}
    }
  },
  created () {
    this.selected = [].concat(this.defaultSelected)
    if (this.defaultSelected.length > 0) {
      this.selectedItem = this.defaultSelected[0]
    }
  },
  methods: {
    // 显示浮层
    show () {
      this.selected = [].concat(this.defaultSelected)
      this.$nextTick(() => {
        const param = this.selected && this.selected.length ? { ids: this.selected.toString() } : ''

        this.$refs.sl.show(param)
      })
    },

    // 选择变化
    changeSelected (id) {
      this.$nextTick(() => {
        this.$refs.sl && this.$refs.sl.setSelected([id])
      })
    },
    confirm (list) {
      this.$emit('confirm', [this.selectedItem], list)
    }
  }
}
</script>

<style type="text/css" lang="less">
  @import "../common.less";
</style>
<style type="text/css" lang="less" scoped>
  .van-checkbox-group {
    height: 100%;
    ::v-deep .search-main {
      background: #F6F8FA;
    }
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
      float: left;
      padding-right: 12px;
      padding-top: 3px;
    }
  }
</style>
