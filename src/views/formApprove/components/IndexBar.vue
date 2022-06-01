<template>
  <van-index-bar :index-list="indexList" :sticky="false">
    <template v-for="(value, key, index) in columns">
      <!--右侧描点-->
      <van-index-anchor :key="index" :index="key"></van-index-anchor>

      <!--左侧列表-->
      <van-cell-group :key="'group' + index">
        <slot name="list" :value="value"></slot>
      </van-cell-group>
    </template>
  </van-index-bar>
</template>

<script>
export default {
  name: 'IndexBar',
  props: {
    list: { // 原始数组
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 按照pinyin排序后的数据
    orderData () {
      const res = {} // 返回的数据

      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].Pinyin) {
          let key = this.list[i].Pinyin.substr(0, 1)
          key = key.toLocaleUpperCase()

          const item = this.list[i]
          item.title = this.list[i].Name

          res[key] = res[key] || []
          res[key].push(item)
        }
      }

      return res
    },
    // 右侧描点列表
    indexList () {
      return Object.keys(this.orderData).sort()
    },
    // 左侧列表
    columns () {
      const res = {}
      this.indexList.map(item => {
        res[item] = this.orderData[item]
      })

      return res
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep {
    .van-index-bar__index {
      color: #BC8D58;
    }
    .van-index-anchor {
      color: #999999;
      font-size: 12px;
    }
  }
</style>
