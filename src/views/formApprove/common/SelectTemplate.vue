<template>
  <van-checkbox-group v-model="selected" :max="max" @change="changeSelected">
    <SearchListWithInit
      ref="sl"
      emptyText="没有搜索到流程模板"
      placeholder="输入流程模板名称查找"
      :searchTip="searchTip"
      :api="getProcedureTemplateListAll"
      :apiParams="apiParams"
      uni-key="id"
      @cancel="(list) => $emit('cancel', selected, list)"
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
                @click="ckbClick"
              >
                <svg-icon v-if="props.checked" slot="icon" slot-scope="props" icon-class="checkbox-on" />
                <svg-icon v-else slot="icon" icon-class="checkbox" />
              </van-checkbox>
              {{ chd.name }}
            </template>
          </van-cell>
        </van-cell-group>
      </template>
    </SearchListWithInit>
  </van-checkbox-group>
</template>

<script>
import { getProcedureTemplateListAll } from '../api'
import SearchListWithInit from './SearchListWithInit'
export default {
  name: 'SelectTemplate',
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
      default: '请输入流程模板名称进行搜索'
    }
  },
  data () {
    return {
      selected: [],
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
    this.show()
  },
  methods: {
    getProcedureTemplateListAll,
    // 显示浮层
    show () {
      this.selected = [].concat(this.defaultSelected)
      this.$nextTick(() => {
        const param = this.selected && this.selected.length ? { ids: this.selected.toString() } : ''

        this.$refs.sl.show(param)
      })
    },

    // 选择变化
    changeSelected (arr) {
      this.hasSelectedNum = 0

      this.$nextTick(() => {
        this.$refs.sl && this.$refs.sl.setSelected(arr)
      })

      setTimeout(() => {
        this.hasSelectedNum = arr.length
      }, 0)
    },

    /**
     * 选择超过限制时提示
     *    由于vant自带的checkbox-group组件，当超过选择限制的时候，不会给与提示，会让用户体验不好
     *    并且：changeSelected在ckbClick之前执行，也就是selected会在ckbClick之前被赋值，如果在该方法里，直接用max和selected.length进行比较，判断会不准确
     *
     *    所以：this下缓存一个hasSelectedNum，在changeSelected方法里延迟500ms对其进行赋值，然后用changeSelected和max进行比较判断
     */
    ckbClick () {
      if (this.max && this.hasSelectedNum >= this.max) {
        this.$toast(`最多只能选择${this.max}项`)
      }
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
  ::v-deep .search-main{
      max-height: calc(100vh - 50px);
  }

</style>
