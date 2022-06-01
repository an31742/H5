<template>
  <div class="template">
    <!-- 搜索 -->
    <van-search
      v-model="searchValue"
      placeholder="查找模板"
      @search="startSearch"
      @input="startSearch"
      @clear="resetSearch"
      @cancel="resetSearch"
    ></van-search>

    <pull-list
      ref="pullList"
      style="overflow:auto;-webkit-overflow-scrolling:touch;"
      iconName="no-msg"
      listProp="list"
      :list.sync="templateList"
      :api="flowtplList"
      :pageSize="20"
      :apiParams.sync="apiParams"
      emptyText="暂无数据"
    >
      <div slot="content" style="margin-top: 5px;">
        <div v-for="(item, index) in templateList" v-if="item.type !== 2" :key="index" class="template-content template-item" @click="toEditPage(item)">
          <span class="template-item-name">{{ item.name }}</span>
          <span class="template-item-main">
            <svg-icon icon-class="arrow-right-gray"></svg-icon>
          </span>
        </div>
        <!--<div v-for="(child, ind) in templateList" :key="ind">-->
        <!--  <p class="template-title">{{ child.tpl_group_name }}</p>-->
        <!--  <div class="template-content">-->
        <!--    <div v-for="(item, index) in child.tpl_list" v-if="item.type !== 2" :key="index" class="template-item" @click="toEditPage(item)">-->
        <!--      <span class="template-item-name">{{ item.name }}</span>-->
        <!--      <span class="template-item-main">-->
        <!--        <span class="template-item-desc">{{ item.desc }}</span>-->
        <!--        <svg-icon icon-class="arrow-right-gray"></svg-icon>-->
        <!--      </span>-->
        <!--    </div>-->
        <!--  </div>-->
        <!--</div>-->
      </div>
    </pull-list>
  </div>
</template>

<script>
import pullList from 'views/components/pulllList'
import { flowtplList } from '@/api/approve'
import { mapGetters } from 'vuex'

export default {
  name: 'ApproveTemplate',
  components: { pullList },
  data () {
    return {
      searchValue: '',
      templateList: [],
      timer: null,
      flowtplList
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ]),
    apiParams () {
      return {
        status: 1,
        name: this.searchValue,
        platform_ids: 3, // 可见平台为员工H5
        role_ids: this.userData && this.userData['role_list'] && this.userData['role_list'][0] && this.userData['role_list'][0].id
      }
    }
  },
  methods: {
    // calcTotal (list) {
    //   let num = 0
    //
    //   list.forEach(item => { num += item.tpl_list.length })
    //
    //   return num
    // },

    startSearch () {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.pullList.pullingDown()
      }, 500)
    },

    resetSearch () {
      this.searchValue = ''
      this.$refs.pullList.pullingDown()
    },

    // 跳转
    toEditPage (val) {
      this.$router.push({
        name: 'ApproveEdit',
        query: {
          id: val.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .template {
    height: 100vh;
    background: #F6F8FA;

    &-title {
      padding: 12px 16px 4px;
      box-sizing: border-box;
      font-size: 12px;
      color: #999;
      font-weight: 400;
      line-height: 16px;
    }

    &-content {
      background: #fff;
    }

    &-item {
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #EFEFEF;

      &:last-child {
        border-bottom: 0;
      }

      &-main {
        display: flex;
        align-items: center;
      }

      &-name, &-desc {
        font-size: 14px;
        color: #333;
        font-weight: 400;
        line-height: 20px;
      }

      &-desc {
        color: #999;
        max-width: 210px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
        margin-right: 12px;
      }
    }

    &-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: calc(100vh - 59px);
      background: #fff;
      margin-top: 4px;
      padding-top: 127px;
      box-sizing: border-box;

      &-icon {
        height: 140px;
      }

      &-text {
        font-size: 14px;
        line-height: 20px;
        color: #EAC9A5;
        margin-top: 20px;
        font-weight: 400;
      }
    }
  }

  .svg-icon {
    font-size: 14px;
  }

  ::v-deep .van-search__content {
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.04);
    color: #999;
  }
  ::v-deep .van-icon-search {
    color: #999;
  }
  ::v-deep .van-field__control {
    font-size: 14px;
  }
  ::v-deep .van-pull-refresh {
    height: calc(100vh - 54px) !important;
    overflow: scroll;
  }
</style>
