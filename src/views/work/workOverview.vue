<template>
  <div class="flex-column h100">
    <div class="search-containe workSearch">
      <!--搜索框-->
      <div class="work-screen work-group">
        <p
          class="work-screen-item"
          :class="{'work-screen-light': selectedGroup.labels.length}"
          @click="selectGroup"
        >
          <span class="van-ellipsis">
            {{ (selectedGroup.isAll || selectedGroup.labels.length === 0) ? '全部项目' : (selectedGroup.labels.length === 1 ? selectedGroup.labels[0] : `已选${selectedGroup.labels.length}个项目`) }}
          </span>
          <span class="work-screen-arrow"></span>
        </p>

        <van-search
          v-model="param.key"
          shape="round"
          class="work-search bgfff"
          placeholder="输入姓名/电话查找员工"
          @cancel="cancelSearch"
          @search="onSearch"
          @input="onSearch"
          @clear="cancelSearch"
        >
        </van-search>
      </div>
    </div>
    <div class="work-overview-content">
      <div class="cont">
        <div class="cont-top">
          <div class="title">
            <p>项目工单完成情况</p>
            <p class="date-box">
              <img src="@/assets/date.png" alt="" class="date">
              <van-cell is-link :title="title" @click="show = true" />
            </p>
          </div>
          <div class="circle">
            <van-circle
              v-model="currentRate"
              :rate="0"
              :speed="100"
              :text="text"
              :stroke-width="120"
              :color="gradientColor"
              :clockwise="false"
              layer-color="#E3EDFC"
              :size="108"
            >

            </van-circle>
            <div class="circle-total">
              <ul>
                <li>
                  <span class="total">工单总数：{{ statistics.total }}</span>
                </li>
                <li>
                  <span class="complete">已完成工单：{{ statistics.completed_total }}</span>
                </li>
                <li>
                  <span class="no-complete">未完成工单：{{ statistics.notfinished }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="cont-bottom">
          <div class="title">
            <p>员工完成度排行</p>
          </div>
          <van-pull-refresh v-model="loading" @refresh="onRefresh">
            <van-list v-model="loading" :finished="finished" :finished-text="param.key? list.length===0?'未找到该员工':'没有更多了':'没有更多了'" @load="onLoad">
              <van-skeleton slot="loading" title avatar :row="5" :loading="loading"></van-skeleton>
              <template v-if="list.length>0">
                <div v-for="(item, key) in list" :key="key" class="progress-list">
                  <p class="desc">
                    <span>{{ item.staff_name }}</span>
                    <span>{{ item.completed_total }}/{{ item.total }}</span>
                  </p>
                  <van-progress
                    :percentage="item.completed_total"
                    color="#F7B500"
                    stroke-width="10"
                    pivot-text=""
                  />
                </div>
              </template>
              <div v-if="finished && list.length===0">
                <img src="@/assets/image/work/nouser.svg" alt="">
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </div>
    </div>
    <!--项目筛选-->
    <selectGroup ref="selectGroup" @confirm="confirmGroup"></selectGroup>
    <!--    选择时间-->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="show=false"
      @select="onSelect"
    ></van-action-sheet>
  </div>
</template>

<script>
import selectGroup from './components/selectGroup'
import { workTotal } from 'api/work'

export default {
  name: 'WorkOverview',
  components: {
    selectGroup
  },
  data () {
    return {
      param: {
        // 搜索条件
        key: '',
        company_id: JSON.parse(localStorage.getItem('userDate')).company_id,
        group_id_str: '',
        date_type: 1
      },
      // 项目选择
      selectedGroup: {
        labels: [],
        values: []
      },
      searchParams: {},
      gradientColor: {
        '0%': '#68A1FF',
        '100%': '#3768FD'
      },
      currentRate: 0,
      list: [],
      loading: false,
      finished: false,
      show: false,
      page: 1,
      pageSize: 10,
      actions: [
        { name: '本周', key: 1 },
        { name: '本月', key: 2 },
        { name: '本季度', key: 3 },
        { name: '本年', key: 4 }
      ],
      statistics: {},
      title: '本周'
    }
  },
  computed: {
    text () {
      return this.currentRate.toFixed(1) + '%  \n  完成率'
    }
  },
  created () {
  },
  methods: {
    onRefresh () {
      this.page = 1
      this.onLoad(true)
    },
    // 加载数据
    onLoad (flag) {
      const param = {
        ...this.param,
        page: this.page,
        page_size: this.pageSize
      }
      this.loading = true
      this.page > 1 ? param.id = this.id : param.id = 0
      workTotal(param).then(res => {
        this.loading = false
        if (res.code === 200) {
          if (res.data) {
            const arr = res.data.list || []
            this.id = res.data.id
            if (!flag) {
              this.list = [...this.list, ...arr]
            } else {
              this.list = [...arr]
            }
            console.log('this.list', this.list)
            if (this.page === 1) {
              localStorage.setItem('statistics', JSON.stringify(res.data.statistics))
              this.statistics = res.data.statistics
              this.currentRate = (res.data.statistics.completed_total / res.data.statistics.total) * 100
              if (Object.is(this.currentRate, NaN)) {
                this.currentRate = 0
              }
            } else {
              this.statistics = JSON.parse(localStorage.getItem('statistics'))
              this.currentRate = (this.statistics.completed_total / this.statistics.total) * 100
              if (Object.is(this.currentRate, NaN)) {
                this.currentRate = 0
              }
            }
            if (res.data.list === null) {

            } else {
              this.page++
            }

            this.finished = this.list.length >= res.data.total || !arr.length
          } else {
            this.finished = true
          }
        } else {
          this.$toast(res.msg)
        }
      }).catch(() => {
        this.loading = false
        this.finished = true
      })
    },
    onSelect (item) {
      this.param.date_type = item.key
      this.title = item.name
      this.show = false
      this.onRefresh()
    },
    // 搜索
    onSearch () {
      // this.onRefresh()
      this.page = 1
      this.onLoad(true)
    },

    // 取消搜索
    cancelSearch () {
      this.param.key = ''

      this.onRefresh()
    },

    // 选择项目
    selectGroup () {
      this.$refs.selectGroup.show()
    },
    // 全部项目-确认选择
    confirmGroup (obj) {
      this.selectedGroup = obj
      this.param.group_id_str = obj.values.join(',')
      this.page = 1

      this.onLoad(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.workSearch{
  background: #F6F8FA;
  padding-bottom: 4px;
  .service-lay>div {
    height: 416px;
  }
}

.work {
  font-family: PingFangSC-Regular, PingFang SC;

  &-group {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-bottom: 1px;
    .work-screen-item {
      width: 90px;
      padding-left: 16px;
    }
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
      background: #F5F5F5;
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
      &.disabled {
        color: #C1C1C1;
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
      border-top-color: #C1C1C1;
    }

    &-light {
      color: #BC8D58;

      .work-screen-arrow {
        border-top-color: #BC8D58;
      }

      &.disabled {
        .work-screen-arrow {
          border-top-color: #C1C1C1;
        }
      }
    }
  }

  &-default-button {
    border-color: #E1AA6C;
    color: #E1AA6C;
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
    border-top: 1px solid #EFEFEF;
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
      border-bottom: 1px solid #EFEFEF;
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

.work-overview-content{
  padding: 12px;
  overflow-y: scroll;
  .cont{
    background: #fff;
    border-radius: 6px;
    padding: 13px;
    .title{
      margin-bottom: 22px;
      display: flex;
      justify-content: space-between;
      .date-box{
        display: flex;
        .date{
          width: 17.5px;
          height: 17.5px;
          position: relative;
          top: 3px;
          right: 5px;
        }
      }
      .van-cell{
        padding: 0;
      }
      p{
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #1A1A1A;
        letter-spacing: 0;
        font-weight: 500;
      }
    }
    .cont-top{
      padding-bottom: 23px;
      border-bottom: 1px dashed #CDCDCD;
      .circle{
        display: flex;
        .circle-total{
          margin-left: 44px;
          ul{
            margin-top: 18px;
          }
          li{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #546E91;
            letter-spacing: 0;
            line-height: 16px;
            font-weight: 400;
            margin-bottom: 8px;
            .total{
              &:before{
                content: '';
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 100%;
                background: #F7B500;
                position: relative;
                top: -2px;
                right: 5px;
              }
            }
            .complete{
              &:before{
                content: '';
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 100%;
                background: #3B6DFD;
                position: relative;
                top: -2px;
                right: 5px;
              }
            }
            .no-complete{
              &:before{
                content: '';
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 100%;
                background: #E3EDFC;
                position: relative;
                top: -2px;
                right: 5px;
              }
            }
          }
        }
      }
    }
    .cont-bottom{
      margin-top: 18px;
      .progress-list{
        margin-bottom: 25px;
        .desc{
          display: flex;
          justify-content: space-between;
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #546E91;
          letter-spacing: 0;
          line-height: 16px;
          font-weight: 400;
          margin-bottom: 5px;
        }
      }
    }
  }
}
::v-deep .van-circle__text{
  white-space:pre-line;
}
</style>
