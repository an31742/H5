<template>
  <div class="transfer-main">
    <van-field :value="detailData && detailData.confirm_status === 1 ? '待确认' : '已确认'" class="fw-field" input-align="left" :readonly="true" label="确认状态"></van-field>
    <van-field
      :value="detailData && detailData.procurement_series ? detailData.procurement_series : '-'"
      class="fw-field"
      input-align="left"
      :readonly="true"
      label="采购单"
    >
    </van-field>
    <van-field :value="detailData.series || '-'" class="fw-field" input-align="left" :readonly="true" label="调拨单号"></van-field>
    <van-field :value="detailData.warehouse_out_name || '-'" class="fw-field" input-align="left" :readonly="true" label="调出仓库"></van-field>
    <van-field :value="detailData.warehouse_in_name || '-'" class="fw-field" input-align="left" :readonly="true" label="调入仓库"></van-field>
    <van-field :value="detailData.scheduling_user_name || '-'" class="fw-field" input-align="left" :readonly="true" label="调拨人"></van-field>
    <van-field :value="detailData.create_time ? moment(detailData.create_time).format('YYYY-MM-DD HH:mm:ss') : '-'" class="fw-field" input-align="left" :readonly="true" label="调拨时间"></van-field>
    <van-field :value="detailData.confirm_time ? moment(detailData.confirm_time).format('YYYY-MM-DD HH:mm:ss') : '-'" class="fw-field" input-align="left" :readonly="true" label="确认时间"></van-field>
    <van-field :value="detailData.confirm_user_name || '-'" class="fw-field" input-align="left" :readonly="true" label="确认人"></van-field>
    <van-field :value="detailData.content || '-'" class="fw-field" input-align="left" :readonly="true" label="备注"></van-field>
    <div class="title">物资信息</div>
    <div class="table-main">
      <a-table
        :columns="columns"
        :locale="locale"
        :data-source="newData"
        rowKey="assets_id"
        bordered
        :scroll="{x:1300}"
        :pagination="false"
        size="small"
      >
        <span slot="yuan" slot-scope="text">
          <span v-if="text"> {{ centToYuan(text) }}</span>
          <span v-else>0.00</span>
        </span>
      </a-table>
    </div>
    <div class="footer-storage-main">
      <div class="statistics">
        统计：
      </div>
      <div class="total-quantity">
        数量总计：{{ detailData.all_total }}
      </div>
      <div class="total-amount">
        金额总计：{{ detailData.all_amount ? detailData.all_amount / 100 : 0.00 }}
      </div>
    </div>
    <div v-if="detailData && detailData.confirm_status === 1" class="fix-footer-storage">
      <div class="query-btn" @click="queryClick">确认入库</div>
    </div>
  </div>
</template>

<script>
import { schedulingGet, schedulingStatus } from '@/api/warehouse.js'
// import { changeTitle } from 'utils/index'
import moment from 'moment'

export default {
  name: 'Transfer',
  data () {
    return {
      data: [],
      // columns,
      id: this.$route.query.id,
      detailData: {},
      listData: [],
      locale: {
        emptyText: '暂无数据'
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getDetail()
  },
  computed: {
    columns () {
      return [
        {
          title: '序号',
          dataIndex: 'id',
          customRender (value, row, idx) { return idx + 1 }
        },
        {
          title: '物资分类',
          dataIndex: 'assets_level_name',
          customRender: (value, row, index) => {
            const children = <div style="position:relative;">{value}</div>
            return {
              children: children,
              attrs: {
                rowSpan: row.span === 1 ? undefined : row.span
              }
            }
          }
        },
        {
          title: '物资名称',
          dataIndex: 'assets_name'
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        {
          title: '规格型号',
          dataIndex: 'model_specification',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        {
          title: '单位',
          dataIndex: 'unit'
        },
        {
          title: '参考价',
          dataIndex: 'price',
          scopedSlots: { customRender: 'yuan' }
        },
        {
          title: '申请数量',
          dataIndex: 'procurement_total',
          customRender: (value, row, index) => {
            const children = <div style="position:relative;color:#007aff;font-weight:bold;">{value}</div>
            return {
              children: children
            }
          }
        },
        {
          title: '申请金额',
          dataIndex: 'procurement_amount',
          scopedSlots: { customRender: 'yuan' }
        },
        {
          title: '供应商',
          dataIndex: 'supplier_name'
        },
        {
          title: '调拨数量',
          dataIndex: 'warehouse_in_total'
        },
        {
          title: '调拨金额',
          dataIndex: 'warehouse_in_amount',
          scopedSlots: { customRender: 'yuan' }
        }
      ]
    },
    newData () {
      const result = []
      for (let i = 0; i < this.listData.length; i++) {
        const item = this.listData[i]
        if (!item.assets || item.assets.length === 0) {
          continue
        }
        for (let j = 0; j < item.assets.length; j++) {
          const child = item.assets[j]
          if (j === 0) {
            child.span = item.assets.length
            child.first = true
          } else {
            child.span = 0
          }
          child.assets_level_name = item.name
          result.push(child)
        }
      }
      return result
    }
  },
  methods: {
    moment,
    centToYuan (dataStr) {
      if (!dataStr) {
        return '0.00'
      }
      return (Number(dataStr) / 100).toFixed(2)
    },
    queryClick () {
      schedulingStatus({ id: this.id }).then(res => {
        if (res.code === 200) {
          this.$toast('确认成功')
          this.getDetail()
        } else {
          this.$toast(res.msg)
        }
      }).catch(err => {
        this.$toast(err)
      })
    },
    getDetail () {
      schedulingGet({ id: this.id }).then(res => {
        if (res.code === 200) {
          this.detailData = res.data || {}
          if (res.data && res.data.assets_level) {
            let arr = []
            // changeTitle((res.data && res.data.title) || '调拨单')
            res.data.assets_level.forEach(x => {
              if (x.assets && x.assets.length > 0) {
                x.assets.forEach(y => {
                  y.assets_level_name = x.name
                  y.assets_level_id = x.id
                })
                arr = [...arr, ...x.assets]
              }
            })
            this.listData = res.data.assets_level || []
            this.data = arr
          }
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer-main {
  overflow: scroll;
  .footer-storage-main {
    display: flex;
    //height: 20px;
    padding: 12px;
    //font-size: 16px;
    font-weight: 600;
    color: #333;
    text-align: left;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    align-items: center;
    ::v-deep .ant-statistic {
      display: inline-block;
    }
    ::v-deep .ant-statistic-content {
      font-size: 16px;
      line-height: 54px;
      .ant-statistic-content-value-decimal {
        font-size: 16px;
      }
    }
    .statistics {
      flex: 1;
    }
    .total-quantity {
      padding-right: 24px;
    }
    .total-amount {
      padding-right: 24px;
    }
  }
  .fix-footer-storage {
    width: 100vw;
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
    box-shadow: 0px 2px 11px 0px rgba(100, 101, 102, 0.12);
    background: #fff;
    position: sticky;
    bottom: 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    .query-btn {
      background: #E1AA6C;
      border-radius: 6px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      width: 80%;
      color: #fff;
      font-size: 16px;
    }
  }
  .table-main {
    background: #fff;
    ::v-deep .ant-table-row-cell-break-word {
      background: #fff!important;
    }
  }
  .title {
    font-size: 14px;
    color: #333333;
    font-weight: bold;
    line-height: 20px;
    margin: 10px;
  }
  ::v-deep .fw-field {
    &.van-cell.van-field {
      padding: 17px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 19px;
      &.rich {
        display: block;
        .van-field__control {
          margin-top: 5px;
          max-height: 72px;
        }
        .van-field__label {
          width: 100%;
        }
      }
      .van-field__label {
        color: #333;
      }
      .van-field__control {
        color: #999;
      }
    }
  }
}
</style>
