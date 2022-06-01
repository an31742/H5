<template>
  <div class="transfer-main">
    <div class="title">基础信息</div>
    <van-field :value="getStatusValuse(detailData.status)" class="fw-field" input-align="left" :readonly="true" label="确认状态"></van-field>
    <!--    <van-field-->
    <!--      :value="detailData && detailData.procurement_series ? detailData.procurement_series : '-'"-->
    <!--      class="fw-field"-->
    <!--      input-align="left"-->
    <!--      :readonly="true"-->
    <!--      label="采购单"-->
    <!--    >-->
    <!--    </van-field>-->
    <van-field :value="detailData.series || '-'" class="fw-field" input-align="left" :readonly="true" label="调拨单号"></van-field>
    <van-field :value="getOutType(detailData.out_relate_type) || '-'" class="fw-field" input-align="left" :readonly="true" label="出库类型"></van-field>
    <van-field :value="detailData.warehouse_out_name || '-'" class="fw-field" input-align="left" :readonly="true" label="调出仓库"></van-field>
    <van-field :value="detailData.warehouse_in_name || '-'" class="fw-field" input-align="left" :readonly="true" label="调入仓库"></van-field>
    <van-field :value="detailData.create_by || '-'" class="fw-field" input-align="left" :readonly="true" label="提单人"></van-field>
    <van-field :value="detailData.create_time ? moment(detailData.create_time).format('YYYY-MM-DD HH:mm:ss') : '-'" class="fw-field" input-align="left" :readonly="true" label="提单日期"></van-field>
    <!--    <van-field :value="detailData.warehouse_in_name || '-'" class="fw-field" input-align="left" :readonly="true" label="附件"></van-field>-->
    <van-field v-if="fileList && fileList.length > 0" class="fw-field" input-align="left" :readonly="true" label="附件">
      <template #button>
        <a
          :style="{'margin-left': '-8px'}"
          v-for="(item, index) in fileList"
          target="_blank"
          :download="getFileName(item)"
          :key="index"
          type="primary"
          :url="item"
          size="small"
        >{{ getFileName(item) }}</a>
      </template>
    </van-field>
    <van-field
      v-else
      :value="'-'"
      class="fw-field"
      input-align="left"
      :readonly="true"
      label="附件"
    ></van-field>
    <!--    <van-field :value="detailData.confirm_time ? moment(detailData.confirm_time).format('YYYY-MM-DD HH:mm:ss') : '-'" class="fw-field" input-align="left" :readonly="true" label="确认时间"></van-field>-->
    <!--    <van-field :value="detailData.confirm_user_name || '-'" class="fw-field" input-align="left" :readonly="true" label="确认人"></van-field>-->
    <van-field :value="detailData.content || '-'" class="fw-field" input-align="left" :readonly="true" label="备注"></van-field>
    <div class="title">物资清单</div>
    <div class="table-main">
      <a-table
        :columns="columns"
        :locale="locale"
        :data-source="listData"
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
    <div v-if="fixedData.length" class="title">固资信息</div>
    <a-table v-if="fixedData.length" :columns="columnFixed" :data-source="fixedData" :scroll="{x:800}" :rowKey="(record,index)=>index" :pagination="false" bordered>
      <template slot="name" slot-scope="text">
        <span>{{ text }}</span>
      </template>
    </a-table>
    <div v-if="detailData && detailData.status === 2" class="fix-footer-storage">
      <div class="query-btn" @click="queryClick">确认出库</div>
    </div>
  </div>
</template>

<script>
import { schedulingGet, schedulingStatus } from '@/api/storemanage.js'
// import { changeTitle } from 'utils/index'
import moment from 'moment'

export default {
  name: 'Transfer',
  data () {
    return {
      fileList: [],
      data: [],
      // columns,
      id: parseInt(this.$route.query.id),
      detailData: {},
      listData: [],
      locale: {
        emptyText: '暂无数据'
      },
      columnFixed: [
        {
          title: '物资分类',
          dataIndex: 'assets_level_name',
          key: 'assets_level_name'
          // scopedSlots: { customRender: 'assets_level_name' }
        },
        {
          title: '物资名称',
          dataIndex: 'assets_name',
          key: 'assets_name'
        },
        {
          title: '资产编号',
          dataIndex: 'assets_number',
          key: 'assets_number'
        },
        {
          title: '设备序列号',
          dataIndex: 'serial',
          key: 'serial'
        }
      ],
      fixedData: []
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
          key: 'id',
          width: '70px',
          customRender (value, row, idx) { return idx + 1 }
        },
        {
          title: '物资分类',
          dataIndex: 'assets_level_name',
          key: 'assets_level_name',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        {
          title: '物资名称',
          dataIndex: 'name',
          key: 'name',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        {
          title: '物资编码',
          dataIndex: 'series',
          key: 'series',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        {
          title: '规格型号',
          dataIndex: 'model_specification',
          key: 'model_specification',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          key: 'brand',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        {
          title: '调拨数量',
          dataIndex: 'total',
          key: 'total',
          customRender (text, record, idx) {
            return text || '-'
          }
        },
        {
          title: '调拨金额（元）',
          dataIndex: 'amount',
          key: 'amount',
          scopedSlots: { customRender: 'yuan' }
        }
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
  methods: {
    getFileName (url) {
      const urlObj = new URL(url)
      const name = urlObj.searchParams.get('filename') || url
      return name
    },
    // 状态转码 状态 1审批中 2待出库 3已撤回 4已拒绝 5已出库
    getStatusValuse (value) {
      switch (value) {
        case 1:
          return '审批中'
        case 2:
          return '待出库'
        case 3:
          return '已撤回'
        case 4:
          return '已拒绝'
        case 5:
          return '已出库'
      }
      return ''
    },
    // 出库类型 1领用出库 2调拨出库 3报废出库 4盘亏出库 5临时出库
    getOutType (val) {
      switch (val) {
        case 1:
          return '领用出库'
        case 2:
          return '调拨出库'
        case 3:
          return '报废出库'
        case 4:
          return '盘亏出库'
        case 5:
          return '临时出库'
      }
      return ''
    },
    moment,
    centToYuan (dataStr) {
      if (!dataStr) {
        return '0.00'
      }
      return (Number(dataStr) / 100).toFixed(2)
    },
    queryClick () {
      schedulingStatus({ id: parseInt(this.id) }).then(res => {
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
      schedulingGet({ id: parseInt(this.id) }).then(res => {
        if (res.code === 200) {
          this.detailData = res.data || {}
          // 附件处理
          let appendix = []
          if (res.data.attachments) {
            try {
              appendix = JSON.parse(res.data.attachments)
            } catch (e) {
              appendix = []
            }
          }
          this.fileList = appendix
          this.listData = res.data.assets || []
          this.data = res.data.assets || []
          this.fixedData = []
          if (res.data.assets.length > 0) {
            res.data.assets.forEach(item => {
              const serialList = JSON.parse(item.serial_data)
              if (serialList.length > 0) {
                serialList.forEach(ele => {
                  this.fixedData.push(ele)
                })
              }
            })
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
