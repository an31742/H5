<template>
  <div id="approveList">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" :finished-text="finished && list.length>0 ? '' : ''" @load="onLoad">
        <van-skeleton slot="loading" title avatar :row="5" :loading="loading"></van-skeleton>
        <template v-if="list.length>0">
          <div class="approve-list">
            <div v-for="(item, index) in list" :key="index" class="approve-item" @click="viewItem(item)">
              <p class="approve-title">
                {{ item.name }}
              </p>
              <div class="approve-text">
                <p>
                  盘点单号：{{ item.series }}
                </p>
                <p>
                  仓库名称：{{ item.warehouse_name }}
                </p>
              </div>
              <div class="approve-text">
                <p>
                  开始时间：{{ dayjs(item.start_time).format('YYYY.MM.DD') }}
                </p>
                <p>
                  结束时间：{{ dayjs(item.end_time).format('YYYY.MM.DD') }}
                </p>
              </div>
              <div class="approve-text">
                <p>
                  资产类型：{{ item.assets_group_name }}
                </p>
                <p>
                  状态：{{ getItemByValue(item.status) }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </van-list>
      <template v-if="finished && list.length===0">
        <div class="approve-empty">
          <img :src="require('@/assets/image/approve/empty.png')" class="approve-empty-icon">
          <span class="approve-empty-text">暂无内容</span>
        </div>
      </template>
    </van-pull-refresh>
  </div>
</template>

<script>
import { materialsList } from 'api/materials'
import dayjs from 'dayjs'
import { getItemByValue } from 'utils'
import { statusList } from 'views/materials/constData'

export default {
  name: 'ReviewList',
  props: {
    searchParams: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      list: [],
      page: 1,
      pageSize: 10,
      dayjs,
      finished: false,
      statusList: statusList
    }
  },
  created () {
  },
  methods: {
    getItemByValue (val) {
      const item = getItemByValue(this.statusList, val)
      return item
    },
    viewItem (record) {
      this.$router.push({
        path: '/materials/reviewDetail',
        query: {
          id: record.id,
          assetType: record.assets_type
        }
      })
    },
    // 下拉刷新
    onRefresh () {
      this.page = 1
      this.onLoad(true)
    },

    // 加载数据
    onLoad (flag) {
      const param = {
        ...this.searchParams,
        page: this.page,
        page_size: this.pageSize
      }
      this.loading = false
      materialsList(param).then(res => {
        this.loading = false
        if (res.code === 200) {
          if (res.data) {
            const arr = res.data.list || []

            if (!flag) {
              this.list = [...this.list, ...arr]
            } else {
              this.list = [...arr]
            }
            this.page++
            this.finished = this.list.length >= res.data.total || !arr.length
            console.log(this.list, '复核list')
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
    }
  }
}
</script>

<style lang="scss" scoped>
#approveList {
  .approve {
    font-family: PingFangSC-Regular, PingFang SC;

    &-item {
      padding: 12px 16px;
      box-sizing: border-box;
      background: #fff;
      margin-top: 4px;
    }

    &-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: calc(100vh - 101px);
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

    &-title {
      font-size: 16px;
      color: #333;
      font-weight: 400;
      line-height: 22px;
      margin-bottom: 12px;
    }

    &-text {
      font-size: 14px;
      color: #888;
      font-weight: 400;
      line-height: 20px;
      margin-top: 8px;
      p{
        display: inline-block;
        &:first-child{
          width: 55%;
        }
        span{
          color: #1A7AFF;
        }
      }
    }
  }

  .approve-title {
    position: relative;
    &.unread::before {
      content: " ";
      border: 0.10667rem solid #FF4D4F;
      border-radius: 0.10667rem;
      background-color: #FF4D4F;
      position: absolute;
      z-index: 9;
      left: -6px;
      top: -2px;
    }
  }
}

::v-deep .van-pull-refresh {
  height: calc(100vh - 52px);
  overflow: scroll;
}
</style>
