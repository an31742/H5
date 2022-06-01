<template>
  <div class="fixed-assets">
    <div class="table-main">
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :scroll="{x:800}"
        :pagination="false"
        size="small"
      >
        <span slot="date" slot-scope="text">{{ moment(text).format('YYYY-MM-DD') }}</span>
      </a-table>
    </div>
    <div v-if="detailData.confirm_status === 1 && detailData.show_confirm" class="fix-footer">
      <div class="query-btn" @click="queryClick">确认</div>
    </div>
  </div>
</template>

<script>
import { flowListAssetsFlow, confirmFexchage } from '@/api/warehouse.js'
import { changeTitle } from 'utils/index'
import moment from 'moment'

export default {
  name: 'Transfer',
  data () {
    const status = {
      1: '未确认',
      2: '已确认'
    }
    const type = {
      1: '流转',
      2: '归还'
    }
    const columns = [
      {
        title: '物资名称',
        dataIndex: 'assets_name',
        width: 100
      },
      {
        title: '流转类型',
        ellipsis: true,
        width: 150,
        dataIndex: 'type',
        customRender (text) { return type[text] || '-' }
      },
      {
        title: '使用人',
        ellipsis: true,
        width: 150,
        dataIndex: 'use_user_name',
        customRender (text) { return text || '-' }
      },
      {
        title: '日期',
        dataIndex: 'exchange_time',
        width: 120,
        scopedSlots: { customRender: 'date' }
      },
      {
        title: '存放地点',
        ellipsis: true,
        width: 150,
        dataIndex: 'place'
      },
      {
        title: '备注',
        width: 150,
        dataIndex: 'content'
      },
      {
        title: '确认人',
        width: 150,
        dataIndex: 'confirm_user_name'
      },
      {
        title: '确认状态',
        width: 100,
        dataIndex: 'confirm_status',
        customRender (text) { return status[text] || '-' }
      }
    ]
    return {
      data: [],
      columns,
      id: this.$route.query.id,
      detailData: {},
      assets_flow_id: this.$route.query.assets_flow_id
    }
  },
  created () {
    this.id = this.$route.query.id
    this.assets_flow_id = this.$route.query.assets_flow_id
    this.getDetail()
  },
  methods: {
    moment,
    getAssetsFlow () {
      const params = {
        id: this.id,
        assets_flow_id: this.assets_flow_id
      }
      flowListAssetsFlow(params).then(res => {
        if (res && res.code === 200) {
          const list = res.data || []
          this.data = list
          this.detailData = list[0] || {}
        } else {
          this.$toast(res.msg)
        }
      })
    },
    queryClick () {
      const params = {
        id: this.detailData.id
      }
      confirmFexchage(params).then(res => {
        if (res.code === 200) {
          this.getAssetsFlow()
          this.$toast(`操作成功`)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    getDetail () {
      changeTitle('固资流转')
      this.getAssetsFlow()
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed-assets {
  padding-bottom: 60px;
  .fix-footer {
    width: 100vw;
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
    box-shadow: 0px 2px 11px 0px rgba(100, 101, 102, 0.12);
    background: #fff;
    position: fixed;
    bottom: 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
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
    margin-bottom: 60px;
    ::v-deep .ant-table-row-cell-break-word {
      background: #fff!important;
    }
  }
}
</style>
