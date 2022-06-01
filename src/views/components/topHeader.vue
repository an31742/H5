<template>
  <div class="top-head">
    <!--切换小区-->
    <h3 v-if="userGroupList.length" class="cur-group">
      <span class="group-name" @click="selectGroup">{{ userSelect }}</span>
      <svg-icon icon-class="work-on" style="font-size: 9px;"/>
    </h3>
    <!--切换小区-->
    <van-popup v-model="popupShow" position="bottom">
      <van-picker
        show-toolbar
        :columns="objArray2StringArray(userGroupList, 'name')"
        @cancel="popupShow=false"
        @confirm="(value, index) => { selectGroup(value, index) }"
      >
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
import { getGroupId } from '@/utils/auth'
import { objArray2StringArray } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'TopHeader',
  data () {
    return {
      objArray2StringArray,
      popupShow: false,
      currentGroup: ''
    }
  },
  computed: {
    ...mapGetters([
      'userGroupList'
    ]),
    userSelect () {
      if (this.userGroupList && this.userGroupList.length) {
        let arr = this.userGroupList.filter(item => {
          return item.id === +this.currentGroup
        })
        arr = arr[0] || this.userGroupList[0]

        return arr.name || ''
      }

      return ''
    }
  },
  created () {
    this.currentGroup = getGroupId()
  },
  methods: {
    // 跳转到选择小区页面
    selectGroup (name, index) {
      this.$router.push({ name: 'GroupSelect' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .top-head{
    display: inline-block;
  }
  .group-name{
    max-width: 155px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
  .cur-group {
    margin: 0;position: relative;height: 25px;
    font-size: 16px;
    // color: #fff;
    color: #333;
    font-family: PingFangSC-Medium, PingFang SC;
    margin-right: 7px;
    line-height: 25px;
    .down-group {
      width: 0;height: 0;font-size: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 8px solid #fff;
      padding-bottom: 1px;display: inline-block;margin-left: 5px;margin-bottom: 1px;
    }
    img {
      width: 30px;height: 30px;position: absolute;right: 16px;top: 11px;border-radius: 50%;
    }
  }
</style>
