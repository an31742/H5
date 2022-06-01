<template>
  <van-checkbox-group v-model="selected" :max="max" @change="changeSelected">
    <SearchListWithInit
      ref="sl"
      emptyText="没有搜索到员工"
      placeholder="输入员工姓名查找"
      :searchTip="searchTip"
      :api="getWidgetStaffListNoticeCandidate"
      :apiParams="apiParams"
      uni-key="staff_id"
      @cancel="(list) => $emit('cancel', selected, list)"
      @confirm="(list) => $emit('confirm', selected, list)"
    >
      <template #list="{ list }">
        <van-cell-group>
          <van-cell
            v-for="(chd, idx) in list"
            :key="idx"
            clickable
            :class="{active: selected.indexOf(chd['staff_id']) > -1}"
          >
            <template #title>
              <van-checkbox
                :name="chd['staff_id']"
                icon-size="0.4533rem"
                checked-color="#E1AA6C"
                shape="square"
              >
                <svg-icon v-if="props.checked" slot="icon" slot-scope="props" icon-class="checkbox-on" />
                <svg-icon v-else slot="icon" icon-class="checkbox" />
              </van-checkbox>
              {{ chd.staff_name }}({{ numberMask(chd.staff_mobile) }})
            </template>
          </van-cell>
        </van-cell-group>
      </template>
    </SearchListWithInit>
  </van-checkbox-group>
</template>

<script>
import { getWidgetStaffListNoticeCandidate } from '../api'
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
    },
    dataProps: {
      type: Object,
      default: null
    },
    extData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      selected: [],
      getWidgetStaffListNoticeCandidate
    }
  },
  computed: {
    apiParams () {
      if (typeof this.dataAuthority === 'number') {
        if (this.dataAuthority === 4) {
          return {
            scope: this.dataAuthority,
            biz_service_id: this.dataProps.serviceId || this.extData.biz_service_id,
            group_id: this.extData.group_id
          }
        } else {
          return { scope: this.dataAuthority }
        }
      }
      return {}
    }
  },
  created () {
    this.selected = [].concat(this.defaultSelected)
  },
  methods: {
    numberMask (number) {
      if (!number) {
        return number
      }
      number = number + ''
      const start = number.slice(0, 3)
      const end = number.slice(-4, number.length)
      return `${start}****${end}`
    },
    show () {
      this.selected = [].concat(this.defaultSelected)
      this.$nextTick(() => {
        const param = { ...this.apiParams }
        if (this.selected && this.selected.length) {
          param.ids = this.selected.toString()
        }

        this.$refs.sl.show(param)
      })
    },

    changeSelected (arr) {
      this.$nextTick(() => {
        this.$refs.sl && this.$refs.sl.setSelected(arr)
      })
    }
  }
}
</script>

<style type="text/css" lang="scss" scoped>
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
