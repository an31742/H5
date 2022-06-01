<template>
  <div style="padding-bottom: 24px;background-color: white;">
    <div class="title">基础信息</div>
    <van-field :value="detail.procurement_series||'-'" class="fw-field" input-align="right" :readonly="true" label="采购单号"></van-field>
    <van-field :value="detail.procurement_type === 1 ? '自用' : '代买'" class="fw-field" input-align="right" :readonly="true" label="采购用途"></van-field>
    <van-field :value="detail.department_name||'-'" class="fw-field" input-align="right" :readonly="true" label="部门/项目"></van-field>
    <template v-if="detail.procurement_type === 1">
      <van-field :value="detail.warehouse_in_name||'-'" class="fw-field" input-align="right" :readonly="true" label="入库仓库"></van-field>
      <van-field :value="detail.assets_type===1 ? '固定资产':'非固定资产'" class="fw-field" input-align="right" :readonly="true" label="资产类型"></van-field>
      <van-field :value="detail.procurement_sign===1?'月度采购':'零星采购'" class="fw-field" input-align="right" :readonly="true" label="采购类型"></van-field>
    </template>
    <div v-if="newData&&newData.length>0" class="title">物资信息</div>
    <div v-if="newData&&newData.length>0" class="table-content">
      <div style="text-align: center;margin-bottom: 5px;">{{ assetsTitle }}</div>
      <a-table
        size="small"
        :locale="locale"
        :columns="columns"
        :data-source="newData"
        :scroll="{x:1200}"
        rowKey="assets_id"
        :pagination="false"
        bordered
      >
        <span slot="procurement" slot-scope="text,scope">
          <span>{{ scope.warehouse_in_total || 0 }} / {{ scope.procurement_total || 0 }}</span>
        </span>
        <div style="position: relative;" slot="assets_name" slot-scope="text, record">
          <span>{{ text }}</span>
          <template v-if="record.is_temp===1">
            <span style="display: inline-block;width: 16px;height: 16px;text-align: center;line-height: 16px;background: rgb(254, 240, 240);color: rgb(245, 107, 109);font-size: 12px;transform: scale(0.8);position: absolute;top: -10px;right: -10px;">新</span>
          </template>
        </div>
        <span slot="yuan" slot-scope="text">
          <span v-if="text"> {{ centToYuan(text) }}</span>
          <span v-else>0.00</span>
        </span>
        <div style="display: flex;justify-content: space-between;" slot="link" slot-scope="text">
          <template v-if="text">
            <a style="color:#007AFF;" href="javascript:;" @click="openLink(text)">跳转链接</a>
            <a style="color:#007AFF;" href="javascript:;" @click="copyText(text)">复制链接</a>
          </template>
          <template v-else>-</template>
        </div>
        <div slot="footer" :size="24" class="footer">
          <div class="static-inner">
            <div class="item">数量总计：{{ detail.all_total }}</div>
            <div class="item">金额总计：{{ centToYuan(detail.all_amount) }}</div>
          </div>
          <template v-if="detail.procurement_type===1&&detail.dep_type===3">
            <div class="static-inner">
              <div class="item">可用预算：{{ centToYuan(detail.budget_remaining) }}</div>
              <div class="item">已用预算：{{ centToYuan(detail.budget_amount_used.fixed_assets_amount + detail.budget_amount_used.without_fixed_assets_amount) }}</div>
            </div>
            <div class="static-inner">
              <div class="item">固定资产已用：{{ centToYuan(detail.budget_amount_used.fixed_assets_amount) }}</div>
              <div class="item">非固定资产已用：{{ centToYuan(detail.budget_amount_used.without_fixed_assets_amount) }}</div>
            </div>
          </template>
        </div>
      </a-table>
    </div>
    <div class="title">备注信息</div>
    <div class="table-content">
      <div class="title">
        <span>附件：</span>
      </div>
      <FileList v-if="fileList&&fileList.length>0" :files="fileList"></FileList>
      <div class="content" v-else>-</div>
    </div>
    <div class="table-content">
      <div class="title">
        <span>用途：</span>
      </div>
      <div class="content">
        {{ detail.use_to||'-' }}
      </div>
    </div>
    <div class="table-content">
      <div class="title">
        <span>要求：</span>
      </div>
      <div class="content">
        {{ detail.ask_for||'-' }}
      </div>
    </div>
    <div class="table-content">
      <div class="title">
        <span>附言：</span>
      </div>
      <div class="content">
        {{ detail.content||'-' }}
      </div>
    </div>
  </div>
</template>

<script>
import { getWarehosePurchaseInfo } from 'views/formApprove/api'
import FileList from 'views/formApprove/detail/warehouse/widgets/FileList'
import dayjs from 'dayjs'

export default {
  name: 'FormPurchaseInfo',
  components: {
    FileList
  },
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      detail: {
        budget_amount_used: {}
      },
      listData: [],
      fileList: [],
      locale: {
        emptyText: '暂无数据'
      }
    }
  },

  computed: {
    columns () {
      return [
        {
          title: '序号',
          width: 80,
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
          dataIndex: 'assets_name',
          scopedSlots: { customRender: 'assets_name' }
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
          title: '购买链接',
          dataIndex: 'link',
          width: 140,
          scopedSlots: { customRender: 'link' }
        },
        {
          title: '申请数量',
          dataIndex: 'procurement_total',
          customRender: (value, row, index) => {
            const children = <div style="position:relative;color:#007AFF;font-weight:bold;">{value}</div>
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
          title: '申请方式',
          dataIndex: 'warehouse_type',
          customRender: (value, row, index) => {
            const map = {
              1: '调拨入库',
              2: '采买入库',
              3: '代买'
            }
            const label = map[value]
            const children = <div style="position:relative;color:#007AFF;font-weight:bold;">{label}</div>
            return {
              children: children
            }
          }
        }
      ]
    },
    /**
     * 随选项变化：非固定资产采购单/固定资产采购单；
     * 自用时资产类型可选，会存在“固定资产采购单”和“非固定资产采购单”；
     * 代买时资产类型不可选，只会展示“代买采购单”
     */
    assetsTitle () {
      if (this.detail.procurement_type === 2) {
        return '代买采购单'
      } else {
        if (this.detail.assets_type === 1) {
          return '固定资产采购单'
        } else {
          return '非固定资产采购单'
        }
      }
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

  created () {
    this.getPurchaseInfo()
  },

  methods: {
    dayjs,
    getPurchaseInfo () {
      const params = {
        id: this.model[this.opt.code],
        is_group: 1
      }
      getWarehosePurchaseInfo(params).then(res => {
        if (res.code === 200) {
          const resData = res.data || {}
          this.detail = resData
          this.listData = res.data.assets_level || []
          let appendix = []
          if (resData.appendix) {
            try {
              appendix = JSON.parse(resData.appendix)
            } catch (e) {
              appendix = []
            }
          }
          this.fileList = appendix
          console.log('this.fileList', this.fileList)
        }
      })
    },
    centToYuan (dataStr) {
      if (!dataStr) {
        return '0.00'
      }
      return (Number(dataStr) / 100).toFixed(2)
    },

    openLink (url) {
      if (~url.indexOf('http')) {
        window.open(url, '_blank')
      } else {
        window.open(`http://${url}`, '_blank')
      }
    },

    copyText (text) {
      if (!this.$copyText) {
        this.$toast('复制失败！')
        return
      }
      this.$copyText(text).then(res => {
        this.$toast('复制成功！')
      }).catch(_ => {
        this.$toast('复制失败！')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
    border-bottom: 1px solid #EFEFEF;

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

::v-deep .ant-table-tbody > tr:hover > td[rowspan] {
  background-color: unset;
}

::v-deep .ant-table-small.ant-table-bordered .ant-table-footer {
  background-color: white;
  padding: 5px;
}

.table-content {
  background: white;
  padding-top: 5px;

  .title {
    margin-right: 5px;
    font-weight: normal;
  }

  .content {
    font-size: 14px;
    padding: 0 12px;
    word-break: break-all;
  }
}

.footer {
  background: transparent;

  .static-inner {
    height: 24px;
    display: flex;
    font-size: 14px;
    justify-content: space-between;

    .item {
      margin-right: 10px;
      width: 50%;
    }
  }
}
</style>
