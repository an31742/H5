<template>
  <div id="approveList">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" :finished-text="finished && list.length>0 ? '' : ''" @load="onLoad">
        <van-skeleton slot="loading" title avatar :row="5" :loading="loading"></van-skeleton>
        <template v-if="list.length>0">
          <div class="approve-list">
            <div v-for="(item, index) in list" :key="index" class="approve-item" @click="viewDetail(item)">
              <p class="approve-flex">
                <span class="approve-title" :class="{unread: item['flow_cc'] && item['flow_cc']['is_read'] === 0}">
                  {{ item.flow_instance.launcher_name }}的{{ item.flow_tpl.name }}
                </span>
                <span class="approve-tag" :class="`approve-tag${item.flow_instance.status}`">
                  {{ getNameByValue(approveStatus, item.flow_instance.status, 'label') }}
                </span>
              </p>
              <p class="approve-text">审批编号：{{ item.flow_instance.no }}</p>
              <p class="approve-text">流程主题：{{ item.flow_instance.subject }}</p>
              <p class="approve-text">{{ dayjs(item.flow_instance.created).format('YYYY.MM.DD') }}</p>
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
import { getNameByValue } from 'utils/index'
import dayjs from 'dayjs'
import { FLOW_INSTANCE_STATUS } from './const'

export default {
  name: 'ApproveList',
  props: {
    api: {
      type: Function,
      default: () => {}
    },
    params: {
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
      finished: false,
      getNameByValue,
      dayjs,
      approveStatus: FLOW_INSTANCE_STATUS
    }
  },
  created () {
    // console.log(this.api, 'this.api')
  },
  methods: {
    viewDetail (val) {
      this.$emit('viewDetail', val)
    },

    // 下拉刷新
    onRefresh () {
      this.page = 1
      this.onLoad(true)
    },

    // 加载数据
    onLoad (flag) {
      const data = {
        ...this.params,
        page: this.page,
        page_size: this.pageSize
      }
      this.loading = true
      // 筛选参数
      for (const key in data) {
        if (data[key] === undefined || data[key] === '') {
          delete data[key]
        }
      }

      this.api(data).then(res => {
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

      &-flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      &-title {
        font-size: 16px;
        color: #333;
        font-weight: 400;
        line-height: 22px;
      }

      &-tag {
        font-size: 12px;
        line-height: 16px;
        padding: 2px 4px;
        box-sizing: border-box;
        border-radius: 4px;
        font-weight: 500;
        min-width: 45px;
        text-align: center;

        &1 { // 草稿
          color: #BC8D58;
          background: rgba(225, 170, 108, 0.15);
        }

        &2 { // 审批中
          color: #FFAB2D;
          background: rgba(255, 171, 45, 0.15);
        }

        &4 { // 已撤回
          color: #999999;
          background: rgba(153, 153, 153, 0.15);
        }

        &5, &6 { // 异常停止, 已拒绝
          color: #FA5151;
          background: rgba(250, 81, 81, 0.15);
        }

        &7, &10 { // 已作废
          color: #D0D0D0;
          background: rgba(208, 208, 208, 0.15);
        }

        &9 { // 已审批
          color: #64CCA8;
          background: rgba(100, 204, 168, 0.15);
        }
      }

      &-text {
        font-size: 14px;
        color: #888;
        font-weight: 400;
        line-height: 20px;
        margin-top: 8px;
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
    height: calc(100vh - 96px);
    overflow: scroll;
  }
</style>
