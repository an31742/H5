<template>
  <div class="transfer-main">
    <div class="title">基础信息</div>
    <van-field :value="detailData.series || '-'" class="fw-field" input-align="left" :readonly="true" label="采购单号"></van-field>
    <van-field :value="detailData.create_name || '-'" class="fw-field" input-align="left" :readonly="true" label="提单人"></van-field>
    <van-field :value="detailData.create_time ? moment(detailData.create_time).format('YYYY-MM-DD HH:mm:ss') : '-'" class="fw-field" input-align="left" :readonly="true" label="提单日期"></van-field>
    <van-field :value="detailData.department || '-'" class="fw-field" input-align="left" :readonly="true" label="采购组织"></van-field>
    <van-field :value="detailData.warehouse_name || '-'" class="fw-field" input-align="left" :readonly="true" label="入库仓库"></van-field>
    <van-field :value="detailData.procurement_type===1?'月度采购':'临时采购'" class="fw-field" input-align="left" :readonly="true" label="采购类型"></van-field>
    <van-field :value="detailData.urgent===1?'加急':'不加急'" class="fw-field" input-align="left" :readonly="true" label="是否加急"></van-field>
    <van-field :value="detailData.remark || '-'" class="fw-field" input-align="left" :readonly="true" label="备注"></van-field>
    <!-- todo：这里需要后端确定一下-->
    <van-field :value="detailData.update_name || '-'" class="fw-field" input-align="left" :readonly="true" label="修改人"></van-field>
    <van-field :value="detailData.update_time ? moment(detailData.update_time).format('YYYY-MM-DD HH:mm:ss') : '-'" class="fw-field" input-align="left" :readonly="true" label="修改日期"></van-field>
    <div class="title">物资清单</div>
    <div class="table-main">
      <a-table
        :locale="locale"
        :columns="columns"
        :data-source="listData"
        bordered
        rowKey="id"
        :scroll="{x:1300}"
        :customRow="customRow"
        :expandedRowKeys.sync="expandedRowKeys"
        :pagination="false"
        size="small"
      >
        <template #customTitle1>
          <span style="color: red; margin-right: 5px">*</span>供应商参考价
        </template>
        <template #customTitle2>
          <span style="color: red; margin-right: 5px">*</span>申请数量
        </template>
        <span slot="yuan" slot-scope="text">
          <span v-if="text"> {{ centToYuan(text) }}</span>
          <span v-else>0.00</span>
        </span>
        <template slot="split_order_type" slot-scope="text, record">
          <span style="padding-left: 10px;" v-if="record._is_split">{{ record.split_order_type === 2 ? '正常采购' : '替货' }}</span>
          <span style="padding-left: 10px;" v-else>原需求单</span>
        </template>
      </a-table>
    </div>
    <div class="footer-storage-main">
      <div class="statistics">统计：</div>
      <div class="total-quantity">数量总计：{{ detailData.sum_number }}</div>
      <div class="total-amount">金额总计：{{ detailData.sum_amount ? detailData.sum_amount / 100 : 0.00 }}</div>
    </div>
  </div>
</template>

<script>
import { getItemByValueLabel } from '@/utils/index'

import { purachGet, warehouseAssetsStatus } from '@/api/storemanage.js'
import moment from 'moment'
// import { changeTitle } from 'utils/index'
export default {
  name: 'PutStorage',
  data () {
    return {
      expandedRowKeys: [],
      data: [],
      listData: [],
      newData: [],
      id: parseInt(this.$route.query.id),
      detailData: {},
      locale: {
        emptyText: '暂无数据'
      },
      relateType: [ // 入库类型
        {
          value: 1,
          label: '采购入库'
        },
        {
          value: 2,
          label: '调拨入库'
        },
        {
          value: 3,
          label: '归还入库'
        },
        {
          value: 4,
          label: '临时入库'
        },
        {
          value: 5,
          label: '盘盈入库'
        },
        {
          value: 6,
          label: '初始入库'
        }
      ]
    }
  },
  computed: {
    columns () {
      return [
        {
          title: '序号',
          dataIndex: 'id',
          width: 70,
          customRender (value, row, idx) {
            return row._is_split ? '' : idx + 1
          }
        },
        {
          title: '修改类型',
          dataIndex: 'split_order_type',
          scopedSlots: { customRender: 'split_order_type' }
        },
        {
          title: '物资分类',
          dataIndex: 'assets_level_name',
          customRender (text) { return text || '-' }
        },
        {
          title: '物资名称',
          dataIndex: 'assets_name',
          customRender (text) { return text || '-' }
        },
        {
          title: '物资编号',
          ellipsis: true,
          dataIndex: 'assets_series',
          customRender (text) { return text || '-' }
        },
        {
          title: '规格型号',
          ellipsis: true,
          dataIndex: 'model_specification',
          customRender (text) { return text || '-' }
        },
        {
          title: '单位',
          ellipsis: true,
          dataIndex: 'unit',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        {
          title: '供应商',
          ellipsis: true,
          dataIndex: 'supplier_name',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        // {
        //   title: '申请数量',
        //   ellipsis: true,
        //   dataIndex: 'relate_total',
        //   customRender: (value, row, index) => {
        //     const children = <div style="position:relative;color:#007aff;font-weight:bold;">{value}</div>
        //     return {
        //       children: children
        //     }
        //   },
        //   type: [1]
        // },
        // {
        //   title: '申请金额（元）',
        //   ellipsis: true,
        //   dataIndex: 'relate_amount',
        //   scopedSlots: { customRender: 'price' },
        //   type: [1]
        // },
        {
          ellipsis: true,
          dataIndex: 'supplier_price',
          slots: { title: 'customTitle1', customRender: 'yuan' },
          scopedSlots: { customRender: 'yuan' }
        },
        {
          title: '库存余量',
          ellipsis: true,
          dataIndex: 'inventory_total'
        },
        {
          ellipsis: true,
          dataIndex: 'procurement_total',
          slots: { title: 'customTitle2' }
        },
        {
          title: '申请金额（元）',
          ellipsis: true,
          dataIndex: 'procurement_amount',
          scopedSlots: { customRender: 'yuan' }
        }
        // {
        //   title: '申请数量',
        //   dataIndex: 'procurement_total',
        //   customRender: (value, row, index) => {
        //     const children = <div style="position:relative;color:#007aff;font-weight:bold;">{value}</div>
        //     return {
        //       children: children
        //     }
        //   }
        // },
      ]
    }
    // newData () {
    //   const result = []
    //   for (let i = 0; i < this.listData.length; i++) {
    //     const item = this.listData[i]
    //     if (!item.assets || item.assets.length === 0) {
    //       continue
    //     }
    //     for (let j = 0; j < item.assets.length; j++) {
    //       const child = item.assets[j]
    //       if (j === 0) {
    //         child.span = item.assets.length
    //         child.first = true
    //       } else {
    //         child.span = 0
    //       }
    //       child.assets_level_name = item.name
    //       result.push(child)
    //     }
    //   }
    //   return result
    // }
  },
  created () {
    this.id = this.$route.query.id
    this.getDetail()
  },
  methods: {
    customRow (record) {
      console.log('customRow record', record)
      return {
        class: record._is_split && 'split-bg'
      }
    },
    getItemByValueLabel,
    moment,
    centToYuan (dataStr) {
      if (!dataStr) {
        return '0.00'
      }
      return (Number(dataStr) / 100).toFixed(2)
    },
    queryClick () {
      warehouseAssetsStatus({ id: parseInt(this.id) }).then(res => {
        if (res.code === 200) {
          this.getDetail()
          this.$toast('确认成功')
        } else {
          this.$toast(res.msg)
        }
      }).catch(err => {
        this.$toast.error(err)
      })
    },
    getFormatAssets (assets) {
      return assets.map(item => {
        return {
          ...item,
          name: item.assets_name,
          //              // 价格单位 数据库为 分   控件为元
          series: item.assets_series,
          supplier_id: item.supplier_name, // item.supplier_version_id,
          // 存储字段转化
          inventory: item.inventory_total,
          // supplier_price: item.supplier_price / 100
          supplier_price: item.supplier_price
        }
      })
    },
    getDetail () {
      purachGet({ id: parseInt(this.id) }).then(res => {
        if (res.code === 200) {
          const resData = res.data || {}
          this.detailData = resData
          this.listData = res.data.items || []
          this.listData = this.getFormatAssets(this.listData)
          this.listData.forEach((item, index) => {
            item._index = index + 1
            item._key = item.id
            item.is_temp = item.is_new
            item.children = item.items?.map(tt => {
              return {
                ...tt,
                _parentKey: item._key,
                is_temp: tt.is_new,
                _key: tt.id,
                _is_split: true
              }
            }) || []

            if (item.children.length === 0) {
              delete item.children
            } else {
              item.children = this.getFormatAssets(item.children)
            }
            console.log(11111)
            console.log(this.listData)
            this.expandedRowKeys.push(item._key)
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer-main {
  overflow: scroll;
  ::v-deep .split-bg {
    background: #a9b8e9!important;
  }
  .footer-storage-main {
    display: flex;
    padding: 12px;
    font-weight: 600;
    color: #333;
    text-align: left;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    align-items: center;
    .statistics {
      padding-right: 24px;
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
