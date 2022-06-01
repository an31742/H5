<template>
  <van-index-bar :index-list="indexList">
    <div>
      <van-search
        v-model="searchGroupVal"
        show-action
        placeholder="请输入项目名"
        @search="selectGroup"
        @cancel="onCancel"

        @input="selectGroup"
        @clear="onCancel"
      />
    </div>
    <template v-for="(value, key, index) in options.groupColumns">
      <van-index-anchor :key="index" :index="key"/>
      <van-cell-group :key="'group' + index">
        <van-cell v-for="(chd, idx) in value" :key="idx" :title="chd.title" @click="chooseGroup(chd)" />
      </van-cell-group>
    </template>
    <div v-show="Object.keys(options.groupColumns).length <=0" class="empty-list tc" >
      <slot name="content">
        <div>
          <svg-icon icon-class="empty-o" />
          <p>暂无数据</p>
        </div>
      </slot>
    </div>
  </van-index-bar>

</template>

<script>
import { mapGetters } from 'vuex'
import { setGroupId } from '@/utils/auth'
export default {
  name: '',
  components: {
  },
  props: {
  },
  data () {
    return {

      indexList: [],

      options: {
        groupColumns: {}
      },
      searchGroupVal: ''
    }
  },
  computed: {
    ...mapGetters([
      'userGroupList'
    ])
  },
  watch: {
  },
  created () {
    this.initGroupColumns()
  },
  methods: {
    // 搜索小区
    selectGroup (val) {
      const list = [].concat(this.userGroupList || [])
      const arr = []
      list.map(e => {
        if (e.name.indexOf(val) !== -1) {
          arr.push(e)
        }
      })
      this.formatGroup(arr)
    },
    onCancel (val) {
      const list = [].concat(this.userGroupList || [])
      this.formatGroup(list)
    },
    // 格式化小区列表
    formatGroup (list) {
      const res = {}
      const obj = {}
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
      this.options.groupColumns = obj
    },
    // 显示弹框
    show () {
      this.popShow = true
    },
    // 初始化组团列表
    initGroupColumns () {
      const list = [].concat(this.userGroupList || [])
      this.formatGroup(list)
    },

    // 选择小区
    chooseGroup (chd) {
      setGroupId(chd.id)
      location.href = '/'
    }
  }
}
</script>

<style lang="scss">
.form{
  .search-input{
    margin-top: 30px;
  }
  .van-field__body .van-field__control{
    text-align: left;
  }
}
  ::v-deep .vue-recycle-scroller__item-wrapper {
    .vue-recycle-scroller__item-view:not(:last-child) {
      .van-cell {
        border-bottom: 1px solid #eee;
      }
    }
  }
</style>
