<template>
  <div class="work-detail">
    <div class="work-between work-mgb20">
      <span class="work-detail-title">基本信息</span>
    </div>
    <div class="work-detail-content">

      <!--申请标题：-->
      <p class="work-detail-row">
        <span class="work-detail-label">申请标题：</span>
        <span class="work-detail-desc">
          {{ detail.title || '--' }}
        </span>
      </p>

      <!--申请单号：-->
      <p class="work-detail-row">
        <span class="work-detail-label">申请单号：</span>
        <span class="work-detail-desc">{{ detail.series || '--' }}
        </span>
      </p>

      <!--申请日期：-->
      <p class="work-detail-row">
        <span class="work-detail-label">申请日期：</span>
        <span class="work-detail-desc">{{ detail.apply_time ? dayjs(detail.apply_time).format('YYYY.MM.DD') : '--' }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">申请人：</span>
        <span class="work-detail-desc">{{ detail.apply_user_name || '--' }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">使用人：</span>
        <span class="work-detail-desc">{{ detail.use_user_name || '--' }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">使用人组织：</span>
        <span class="work-detail-desc">{{ detail.use_organization || '--' }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">仓库名称：</span>
        <span class="work-detail-desc">{{ detail.warehouse_name || '--' }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">用途：</span>
        <span class="work-detail-desc">{{ detail.purpose || '--' }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">备注：</span>
        <span class="work-detail-desc">{{ detail.remark || '--' }}</span>
      </p>
      <p class="work-detail-row">
        <span class="work-detail-label">状态：</span>
        <span class="work-detail-desc">{{ getItemByValue(RECEIVE_STATUS, detail.status) || '--' }}</span>
      </p>
      <p class="work-detail-row" v-if="detail.status === 2">
        <span class="work-detail-label">审核拒绝日期：</span>
        <span class="work-detail-desc">{{ detail.process_time ? dayjs(detail.process_time).format('YYYY.MM.DD') : '--' }}</span>
      </p>
      <p class="work-detail-row" v-if="detail.status === 3">
        <span class="work-detail-label">撤回人：</span>
        <span class="work-detail-desc">{{ detail.process_staff_name || '--' }}</span>
      </p>
      <p class="work-detail-row" v-if="detail.status === 3">
        <span class="work-detail-label">撤回日期：</span>
        <span class="work-detail-desc">{{ detail.process_time ? dayjs(detail.process_time).format('YYYY.MM.DD') : '--' }}</span>
      </p>
      <p class="work-detail-row" v-if="detail.status === 5 || detail.status === 4">
        <span class="work-detail-label">审核通过日期：</span>
        <span class="work-detail-desc">{{ detail.process_time ? dayjs(detail.process_time).format('YYYY.MM.DD') : '--' }}</span>
      </p>
      <p class="work-detail-row" v-if="detail.status === 4 || detail.status === 3|| detail.status === 5">
        <span class="work-detail-label">最近出库日期：</span>
        <span class="work-detail-desc">{{ detail.exit_warehouse ? dayjs(detail.exit_warehouse).format('YYYY.MM.DD') : '--' }}</span>
      </p>
    </div>
    <div class="work-between work-mgb20">
      <span class="work-detail-title">物资信息</span>
    </div>
    <!-- 物资信息 -->
    <div class="work-detail-content" v-for="(item, index) in detail.goods_list" :key="index">
      <!--申请标题：-->
      <div>

        <p class="work-detail-row">
          <span class="work-detail-label">物资分类：</span>
          <span class="work-detail-desc">
            {{ item.assets_level_name || '--' }}
          </span>
        </p>

        <!--申请单号：-->
        <p class="work-detail-row">
          <span class="work-detail-label">物资名称：</span>
          <span class="work-detail-desc">{{ item.assets_name || '--' }}
          </span>
        </p>

        <!--申请日期：-->
        <p class="work-detail-row">
          <span class="work-detail-label">品牌：</span>
          <span class="work-detail-desc">{{ item.brand || '--' }}</span>
        </p>
        <p class="work-detail-row">
          <span class="work-detail-label">规格型号：</span>
          <span class="work-detail-desc">{{ item.model_specification || '--' }}</span>
        </p>
        <p class="work-detail-row">
          <span class="work-detail-label">单位：</span>
          <span class="work-detail-desc">{{ item.unit || '--' }}</span>
        </p>
        <!-- <p class="work-detail-row">
          <span class="work-detail-label">库存数量：</span>
          <span class="work-detail-desc">{{ item.can_use_inventory || '--' }}</span>
        </p> -->
        <p class="work-detail-row">
          <span class="work-detail-label">申请数量：</span>
          <span class="work-detail-desc">{{ item.number || '--' }}</span>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import { receiveInfo } from '@/api/storeHouse.js'
import { getItemByValue } from '@/utils/index'
import { RECEIVE_STATUS } from '@/views/storeHouse/receive/components/const.js'
import dayjs from 'dayjs'

export default {
  name: 'BasicDetail',
  components: {
  },
  props: {
  },
  data () {
    return {
      receiveId: this.$route.query.receiveId,
      detail: {},
      getItemByValue,
      RECEIVE_STATUS,
      dayjs
    }
  },
  watch: {
    'receiveId' (val) {
      this.getApplyDetail()
    }
  },
  computed: {
  },
  created () {
    this.getApplyDetail()
  },
  methods: {
    getApplyDetail () {
      receiveInfo({ receive_id: Number(this.receiveId) }).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.detail = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.work-detail {
  position: relative;
  z-index: 2001;
}
.van-overlay{
  z-index: 3000 !important;
}
.submit-btn{
  color: #fff;
    background: linear-gradient(
45deg
, rgb(242, 213, 165) 0%, rgb(225, 170, 108) 100%);
    border: none;
    width: 105%;
}
.sub-title {
  padding-top: 0.8rem;
  text-align: center;
  font-weight: 600;
  overflow: hidden;
}
.sub-list {
  width: 100%;
  padding: 30px 0 30px 14px;
  display: flex;
  flex-wrap: wrap;
  &::after{
    content: '';
    flex-grow: 1;
  }
}
  .sub-item {
    display: inline-block;
    margin-bottom: 0.32rem;
    font-size: 0.4rem;
    color: #333333;
    line-height: 0.56rem;
    padding: 0.21333rem 0.45333rem;
    background: #fff;
    border-radius: 0.53333rem;
    border: 1px solid #e6e7e8;
    margin:0 10px 10px 0;
  }
  .active {
    background: #F9EEE2;
    color: #BC8D58;
    border: 1px solid #F9EEE2;
  }
  .edit-basic{
    color: #bc8d58;
    margin-left:30px
  }
  .work {
    font-family: PingFangSC-Regular, PingFang SC;
    height: 100%;
    background: #F6F8FA;

    .flex-column.van-tab__pane {
      height: calc(100vh - 44px);
      overflow-y: auto;
    }

    &-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-mgb20 {
      padding: 10px 0 7px 10px;
    }

    &-mgb16 {
      margin-bottom: 16px;
    }

    &-detail {
      overflow: scroll;
      margin-bottom: 4px;

      &-content {
        padding: 12px 16px;
        box-sizing: border-box;
        background: #fff;
        margin-top: 4px;
      }

      &-title {
        font-size: 15px;
        color: #a19f9f;
        line-height: 22px;
        font-weight: 500;
      }

      &-label, &-status, &-desc, &-yellow {
        font-size: 14px;
        color: #666;
        line-height: 20px;
        font-weight: 400;
        overflow-wrap: anywhere;
      }

      &-status {
        color: #999;
        margin-left: 12px;
      }

      &-label {
        min-width: 70px;
      }

      &-yellow {
        color: #BC8D58;
        margin-left: 8px;
      }

      &-row {
        display: flex;
        align-items: flex-start;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      &-pictures {
        display: flex;
        flex-wrap: wrap;
      }

      &-image {
        margin-right: 7px;
        background: #f00;
        border-radius: 2px;

        &:nth-child(4n) {
          margin-right: 0;
        }
      }

      &-action {
        padding: 0 16px;
        box-sizing: border-box;
        background: #fff;
        border-top: 1px solid #F6F8FA;
      }

      &-urgent {
        width: 55px;
        color: #FA5151;
        background: #FEE5E5;
        border-radius: 4px;
        font-size: 12px;
        border: 0;

        &-content {
          display: flex;
          align-items: center;
        }
      }

      &-disabled {
        align-items: flex-start;

        &-content {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
        }
      }
    }

    &-flexstart {
      align-items: flex-start;
    }
  }
</style>
