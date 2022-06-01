<template>
  <div id="approveList">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list
        class="approve"
        v-model="loading"
        :finished="finished"
        :finished-text="finished && list.length > 0 ? '没有更多了' : ''"
        @load="onLoad"
      >
        <van-skeleton
          slot="loading"
          title
          avatar
          :row="5"
          :loading="loading"
        ></van-skeleton>
        <template v-if="list.length > 0">
          <div class="approve-list">
            <div
              v-for="(item, index) in list"
              :key="index"
              class="approve-item"
              @click="viewDetail(item)"
            >
              <p class="approve-flex">
                <span class="approve-title">
                  {{ item.assets_name || "--" }}
                </span>
              </p>
              <p class="approve-text">申请单号：{{ item.series || "--" }}</p>
              <p class="approve-text">
                申请日期：{{
                  dayjs(item.apply_time).format("YYYY.MM.DD") || "--"
                }}
              </p>
              <p class="approve-text">
                仓库名称：{{ item.warehouse_name || "--" }}
              </p>
              <p class="approve-text">
                物资类型：{{ item.assets_group_name || "--" }}
              </p>
              <p class="approve-text" v-if="item.assets_type !== 2">
                物资编号：{{ item.assets_number || "--" }}
              </p>
              <p class="approve-text" v-if="item.assets_type !== 2">设备序列号：{{ item.serial || "--" }}</p>
              <p class="approve-text">
                领用日期：{{
                  dayjs(item.receive_time).format("YYYY.MM.DD") || "--"
                }}
              </p>
              <!--
                //  -->
              <p style="margin-top: 10px">
                <van-button
                  type="primary"
                  class="approve-button"
                  size="small"
                  style="width: 100%"
                  @click.stop="showReturn(item)"
                  v-if="
                    item.return_cycle_status === 1 &&
                      item.out_total -
                      item.receive_number -
                      item.receiving_count >
                      0
                  "
                >
                  归还
                </van-button>
                <van-button
                  type="primary"
                  class="approve-button-load"
                  size="small"
                  style="width: 100%"
                  v-if="
                    item.return_cycle_status === 2 &&
                      item.out_total -
                      item.receive_number -
                      item.receiving_count >
                      0
                  "
                >
                  归还中
                </van-button>
                <van-button
                  type="primary"
                  class="approve-button-load"
                  size="small"
                  style="width: 100%"
                  v-if="
                    item.return_cycle_status === 3 &&
                      item.out_total -
                      item.receive_number -
                      item.receiving_count <=
                      0
                  "
                >
                  {{ item.assets_type === 1 ? "已归还" : "已全部归还" }}
                </van-button>
              </p>
            </div>
          </div>
        </template>
      </van-list>
      <template v-if="finished && list.length === 0">
        <div class="approve-empty">
          <img
            :src="require('@/assets/image/approve/empty.png')"
            class="approve-empty-icon"
          />
          <span class="approve-empty-text">暂无内容</span>
        </div>
      </template>
    </van-pull-refresh>
    <van-popup v-model="isReturn" class="return-popup">
      <div>请输入归还数量</div>
      <van-form
        ref="approveForm"
        validate-first
        scroll-to-error
        @submit="handleSubmit"
        class="return-popup-center"
      >
        <!-- {{ this.returnItem }} -->
        <van-field
          v-model="returnNumber"
          label=""
          :placeholder="`不可超过可归还数量${
            this.returnItem &&
            (this.returnItem.out_total -
              this.returnItem.receive_number -
              this.returnItem.receiving_count)
          }`"
          style="border: 1px solid #ebedf0; width: 200px"
          :rules="[{ pattern: /^([1-9][0-9]*)$/, message: onServiceError }]"
        >
        </van-field>
      </van-form>
      <div class="btns">
        <div @click="cancel" style="border-right: 1px solid #eee;">取消</div>
        <div @click="$refs.approveForm.submit()" style="color:#e1aa6c;">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getNameByValue } from 'utils/index'
import dayjs from 'dayjs'
import { RECEIVE_STATUS } from './const'
import { returnDone } from '@/api/storeHouse.js'

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
    },
    type: {
      type: [Number, String],
      default: 0
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
      receiveStatus: RECEIVE_STATUS,
      isReturn: false,
      returnNumber: '',
      returnItem: {}
    }
  },
  created () {
    // console.log(this.api, 'this.api')
  },
  methods: {
    onServiceError () {
      console.log(this.returnNumber)
    },
    beforeClose () {
      console.log('haunbiqian', this.isReturn)
      return !this.isReturn
    },
    confirmNumber () {
      this.$refs.approveForm.submit()
    },
    cancel () {
      this.isReturn = false
      this.returnNumber = undefined
    },
    handleSubmit () {
      const userNum =
        this.returnItem.out_total -
        this.returnItem.receive_number -
        this.returnItem.receiving_count
      if (this.returnNumber > userNum) {
        this.$toast(`不可超过可归还数量${userNum}`)
        return
      }
      const item = this.returnItem
      console.log(item)
      const data = {
        id: item.receive_id, // 领用id
        relate_type: 1,
        relate_series: item.series
      }
      // 非固定资产
      data.assets = [
        {
          assets_version_id: item.assets_version_id, // 物资版本id
          total: Number(this.returnNumber), // 归还数量
          serial_data: ''
        }
      ]
      console.log(data)
      returnDone(data).then((res) => {
        console.log(res)
        this.isReturn = false
        if (res.code === 200) {
          this.$toast('归还申请已经提交')
          this.returnNumber = ''
          this.onRefresh()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    confirm () {
      const item = this.returnItem
      console.log(item)
      const data = {
        id: item.receive_id, // 领用id
        relate_type: 1,
        relate_series: item.series
      }
      if (item.assets_type === 1) {
        // 固定资产
        const serial = [
          {
            serial: item.serial,
            assets_number: item.assets_number
          }
        ]
        data.assets = [
          {
            assets_version_id: item.assets_version_id, // 物资版本id
            total: 1, // 归还数量
            serial_data: JSON.stringify(serial)
          }
        ]
      }
      console.log(data)
      returnDone(data).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.$toast('归还申请已经提交')
          this.onRefresh()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    showReturn (item) {
      this.returnItem = item
      console.log(item)
      if (item.assets_type === 1) {
        this.confirm()
      } else {
        this.isReturn = true
      }
    },
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

      this.api(data)
        .then((res) => {
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
        })
        .catch(() => {
          this.loading = false
          this.finished = true
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.return-popup {
  padding: 0.53333rem 0 0;
  width: 80%;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  // height: 140px;
  .return-popup-center {
    height: 48px;
    padding-top:10px;
  }
  .btns{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    border-top: 1px solid #eee;
    div {
    width: 50%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    }
  }
}
::v-deep .van-dialog__content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
::v-deep .van-dialog__confirm {
  color: #e1aa6c;
}
::v-deep .van-stepper {
  button {
    display: none;
  }
  input {
    width: 100%;
    background: #fff;
  }
}
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

    &1 {
      // 草稿
      color: #bc8d58;
      background: rgba(225, 170, 108, 0.15);
    }

    &2 {
      // 审批中
      color: #ffab2d;
      background: rgba(255, 171, 45, 0.15);
    }

    &4 {
      // 已撤回
      color: #999999;
      background: rgba(153, 153, 153, 0.15);
    }

    &5,
    &6 {
      // 异常停止, 已拒绝
      color: #fa5151;
      background: rgba(250, 81, 81, 0.15);
    }

    &7,
    &10 {
      // 已作废
      color: #d0d0d0;
      background: rgba(208, 208, 208, 0.15);
    }

    &9 {
      // 已审批
      color: #64cca8;
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
  &-button {
    background: #e1aa6c;
    border: 1px solid #e1aa6c;
    color: #fff;
  }
  &-button-load {
    background: #eee;
    border: 0.02667rem solid #eee;
    color: #a1a1a1;
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
      color: #eac9a5;
      margin-top: 20px;
      font-weight: 400;
    }
  }
}

.approve-title {
  position: relative;
  &.unread::before {
    content: " ";
    border: 0.10667rem solid #ff4d4f;
    border-radius: 0.10667rem;
    background-color: #ff4d4f;
    position: absolute;
    z-index: 9;
    left: -6px;
    top: -2px;
  }
}

::v-deep .van-pull-refresh {
  height: calc(100vh - 48px);
  overflow: scroll;
}
</style>
