<template>
  <div ref="container2" class="fw-container2 ">
    <!-- 选择小区 -->
    <div ref="content" class="content-c">
      <div style="height:50px">
        <van-search
          ref="search"
          v-model="searchKey"
          autofocus
          shape="round"
          class="search tl"
          placeholder="请输入员工姓名"
          show-action
          clearable
          @search="startSearch"
          @clear="resetSearch"
          @blur="onBlur"
          @cancel="resetSearch"
          @focus="onFocus"
        >
          <template #action >
            <div class="flex-row-center">
              <a href="JavaScript:;" class="linkbtn" @click="showDep()">
                {{
                  group.id?group.name:'所属项目'
                }}
              </a>
              <svg-icon icon-class="arrow-down-2" />
            </div>
          <!-- -->
          </template>
        </van-search>
      </div>
      <div v-if="isShowDep" class="menu-container">
        <ul class="memu">
          <li
            v-for="(item ,i ) in userGroupList"
            :key="i"
            :class="{'selected':group.id===item.id}"
            @click="selectDep(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div v-show="resultCount>0&!isShowDep" class="content-toolbar" >
        <span>
          请选择员工
        </span>
        <span>
          <a
            v-show="showSelecteMode"
            class="f2"
            href="Javascript:;"
            @click="selectAll()"
          >
            {{ isAllSelect?'取消':'全选' }}
          </a>
          <!-- <a
            v-show="showSelecteMode"
            class="f2"
            href="Javascript:;"
            @click="cancel()"
          >
            退出
          </a> -->
        </span>
      </div>
      <div
        v-show="resultCount>0&!isShowDep"
        class="content-list"
      >
        <van-index-bar
          :sticky-offset-top="0"
          :sticky="false"
          z-index="100"
          :index-list="indexList"
        >
          <div v-for="(val,key) in loadData" :key="key">
            <van-index-anchor :index="key" class="index-title" />
            <ul>
              <li
                v-for="(item,index) in val"
                :key="index"
                :class="{'selected': item._checked, 'content-list__item': true}"
              >

                <!-- 复选框 -->
                <span v-if="showSelecteMode" style="margin-right: 10px;">
                  <van-checkbox
                    v-model="item._checked"
                    icon-size="16"
                    @click="onCheckBoxClick"
                  >
                    <template #icon="props">
                      <svg-icon v-if="props.checked" icon-class="checkbox-on" />
                      <svg-icon v-else icon-class="checkbox" />
                    </template>
                  </van-checkbox>
                </span>

                <span style="flex: none; margin-right: 10px;">{{ item.name }}</span>
                <span class="grey">
                  <slot name="role" :user="item">
                    {{ item.dep_name }}
                  </slot>
                </span>
                <span
                  v-if="!showSelecteMode"
                  class="f2 right"
                >
                  <slot name="op" :user="item"></slot>
                  <van-icon name="arrow" />
                </span>
              </li>
            </ul>
          </div>
        </van-index-bar>
      </div>

      <div
        v-if="resultCount===0&&!loading&&!isShowDep"
        style="flex:1"
        class="empty flex-center"
      >
        <img src="./no-staff.png" alt="" srcset="">
        <p class="f1">暂时没有员工</p>
      </div>

    </div>

  </div>
</template>

<script>
import dayjs from 'dayjs'
import { miniStaffList } from '@/api/staff'
import { mapGetters } from 'vuex'
import { getGroupId } from '@/utils/auth'
export default {
  name: 'Face',
  props: {
    showSelecteMode: {
      type: Boolean,
      default: false
    },
    selectedUser: {
      type: Array,
      default: () => []
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    codeType: {
      type: Number,
      default: 4
    },
    // 是否输入状态
    isInputFocus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dayjs,
      searchKey: '',
      isShowDep: false,
      isAllSelect: undefined,
      loadData: {},
      group: {
        id: 0,
        name: ''
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userGroupList']),
    resultCount () {
      return Object.keys(this.loadData).length
    },
    indexList () {
      return Object.keys(this.loadData)
    }
  },
  watch: {
    selectedUser (arr) {
      if (arr.length === 0) {
        Object.values(this.loadData)
          .forEach(list => {
            list.forEach(user => {
              this.$set(user, '_checked', false)
            })
          })
      }
    }
  },
  mounted () {
    this.init()
    // const height = this.$refs.container2.clientHeight
    // console.log(height)
    // 样式兼容   点击索引 不全屏
    // this.$refs.content.style.position = 'relative'
    // this.$refs.content.style.height = `${height}px`
    // .
  },
  methods: {

    init () {
      // 默认选中当前小区
      let groupId = getGroupId()
      groupId = parseInt(groupId)
      const group = this.userGroupList.find(t => t.id === groupId)
      if (group) {
        this.group.name = group.name
        this.group.id = group.id
      }

      this.getList()
    },
    startSearch () {
      this.getList()
    },
    resetSearch () {},

    next (item) {
      this.$router.push({
        name: 'entranceFaceEdit',
        query: {
          id: item.id,
          name: encodeURIComponent(item.name)
        }
      })
    },
    showDep () {
      this.isShowDep = !this.isShowDep
    },
    selectDep (item) {
      if (this.group.id === item.id) {
        this.group = {}
      } else {
        this.group = item
      }
      this.$forceUpdate()
      this.isShowDep = false
      this.getList()
    },
    onCheckBoxClick () {
      const listUser = []
      Object.values(this.loadData)
        .forEach(list => {
          list.forEach(user => {
            if (user._checked) {
              listUser.push(user)
            }
          })
        })

      this.$emit('update:selectedUser', listUser)
    },
    selectAll () {
      this.isAllSelect = !this.isAllSelect
      Object.values(this.loadData)
        .forEach(list => {
          list.forEach(user => {
            this.$set(user, '_checked', this.isAllSelect)
          })
        })
      this.onCheckBoxClick()
    },
    cancel () {
      this.$emit('update:showSelecteMode', false)
    },

    async getList () {
      this.$emit('loading', true)
      this.loading = true
      try {
        const res = await miniStaffList({
          staff_name: this.searchKey,
          group_id: this.group.id,
          code_type: this.codeType
        })
        if (res.code === 200) {
          this.loadData = res.data
          this.$nextTick(() => {
            this.$emit('update:isEmpty', this.resultCount === 0)
          })
        }
      } catch (error) {
        console.log(error)
      }

      this.$emit('loading', false)
      this.loading = false
    },
    onFocus () {
      this.$emit('update:isInputFocus', true)
    },
    onBlur () {
      this.$emit('update:isInputFocus', false)
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.fw-container2{
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.linkbtn{
  display: inline-block;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #BC8D58;
  line-height: 23px;
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
    text-align: right;
    margin-right: 5px;

}

.f1{

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
   color: #999999;
}
.f2{
font-size: 16px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #BC8D58;
line-height: 23px;
}

.empty{
  img{
    width: 250px;
    margin-bottom: 50px;
  }

}

.flex-center{
  flex:1;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
}
.flex-row-center{
  flex:1;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
}
.flex-row-between{
  flex:1;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  justify-items: center;
}

ul{
  li{
    padding: 12.5px 16px;
    border-bottom: #EFEFEF solid 1px;

    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 21px;

    span{
      display: inline-block;
    }
    span.right{
      flex: none;
      // width: 80px;
      margin-right: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      align-content: center;
      justify-items: center;
      position: relative;
    }
  }
  li.selected{
    background: #FAF7F4;
  }
}

.index-title{
  color: #999999;
  line-height: 17px;
  background: #F6F8FA;
  border-bottom: #EFEFEF solid 0px;
}

.grey{
  color: #999999;
  flex: 1;
  overflow: hidden;
  text-overflow:ellipsis;
}
ul.memu{
  li.selected{
    background: #FAF7F4;
    position: relative;
  }
  li.selected:before{
    width: 2px;
    height: 20px;
    content:" ";
    display: inline-block;
    position: absolute;
    left: 0px;
    background-color: #E1AA6C;
  }

}
.content-c{
  flex:1;
  // margin-top:200px;
  width: 100%;
  // position: fixed;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.content-toolbar{
    height: 30px;
    // background-color: red;
    padding: 12.5px 16px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 21px;

    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    justify-items: center;

    .f2{
        font-size: 14px;
    }
}

.content-list{
  flex:1;
  height:100%;
  position: relative;
  overflow: scroll;
  &__item {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
}

.test{
  height: 1000px;
  width: 20px;
  background-color: #000;
}

.menu-container{
  z-index: 1000;
  background-color: #fff;
  flex: 1;
  height: calc(100vh - 50px);
  overflow-y: scroll;

}
::v-deep .van-popover__wrapper{
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
}
  ::v-deep .van-checkbox__icon{
      height: auto;
  }
</style>
