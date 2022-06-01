<template>
  <van-checkbox-group v-model="selected" @change="changeSelected">
    <SearchList
      ref="sl"
      emptyText="没有搜索到催办人"
      placeholder="输入催办人姓名查找"
      :searchTip="searchTip"
      :api="ergentCandidateProcedureInstance"
      :apiParams="apiParams"
      :searchFun="searchFun"
      uni-key="id"
      @cancel="$emit('cancel')"
      @confirm="(list) => $emit('confirm', selected, list)"
    >
      <template #list="{ list }">
        <van-cell-group>
          <van-cell
            v-for="(chd, idx) in list"
            :key="idx"
            clickable
            :class="{active: selected.indexOf(chd['id']) > -1}"
          >
            <template #title>
              <van-checkbox
                :name="chd['id']"
                icon-size="0.4533rem"
                checked-color="#E1AA6C"
                shape="square"
              >
                <svg-icon v-if="props.checked" slot="icon" slot-scope="props" icon-class="checkbox-on" />
                <svg-icon v-else slot="icon" icon-class="checkbox" />
              </van-checkbox>
              {{ chd.name }}
            </template>
          </van-cell>
        </van-cell-group>
      </template>
    </SearchList>
  </van-checkbox-group>
</template>

<script>
import { ergentCandidateProcedureInstance } from '@/api/approve'
import SearchList from '../../formApprove/common/SearchList'
export default {
  name: 'SelectStaff',
  components: { SearchList },
  props: {
    defaultSelected: {
      type: Array,
      default: () => []
    },
    flowInstanceId: {
      type: String,
      default: ''
    },
    searchTip: {
      type: String,
      default: '请输入员工姓名进行搜索'
    }
  },
  data () {
    return {
      selected: [],
      ergentCandidateProcedureInstance
    }
  },
  computed: {
    apiParams () {
      return {
        flow_instance_id: this.flowInstanceId
      }
    }
  },
  created () {
    this.selected = [].concat(this.defaultSelected)
  },
  methods: {
    show () {
      this.$nextTick(() => {
        const param = this.selected ? { ids: this.selected.toString() } : ''
        this.$refs.sl.show(param)
      })
    },

    searchFun (list, key) {
      return list.filter(item => item.name.toLowerCase().indexOf(key.toLowerCase()) > -1)
    },

    changeSelected (arr) {
      this.$nextTick(() => {
        // this.$refs.sl.setSelected(arr)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
