<template>
  <div class="consumables">
    <ul>
      <li
        v-for="(item,key) in tabBar"
        :key="key"
        @click="changeTable(key)"
        :class="{active: activeTab === key}"
      >
        {{ item.name }}
        （{{ item.number }}）
      </li>
    </ul>
    <a-table
      v-show="activeTab === 0"
      :columns="columns"
      rowKey="id"
      :data-source="data"
      bordered
      :scroll="{x:500}"
      :pagination="false"
      size="small"
    >
      <div slot="action" slot-scope="text,record">
        <p class="entry" @click="detailItem(record)">盘点录入 ></p>
      </div>
    </a-table>
    <a-table
      :columns="columns"
      v-show="activeTab === 1"
      rowKey="id"
      :data-source="data1"
      bordered
      :scroll="{x:500}"
      :pagination="false"
      size="small"
    >
      <div slot="action" slot-scope="text,record">
        <p class="entry" @click="detailItem(record)">盘点录入 ></p>
      </div>
    </a-table>
    <a-table
      v-show="activeTab === 2"
      :columns="columns"
      rowKey="id"
      :data-source="data2"
      bordered
      :scroll="{x:500}"
      :pagination="false"
      size="small"
    >
      <div slot="action" slot-scope="text,record">
        <p class="entry" @click="detailItem(record)">盘点录入 ></p>
      </div>
    </a-table>
  </div>
</template>

<script>
import { getDetailTable1 } from 'api/materials'

export default {
  name: 'FixedCapital',
  props: {
    assetType: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      tabBar: [
        {
          name: '全部',
          number: ''
        },
        {
          name: '已盘点',
          number: ''
        },
        {
          name: '待盘点',
          number: ''
        }
      ],
      activeTab: 0,
      columns: [
        {
          title: '物资分类',
          dataIndex: 'assets_level_name',
          width: 50
        },
        {
          title: '物资名称',
          dataIndex: 'assets_name',
          width: 50

        },
        {
          title: '资产编号',
          dataIndex: 'series',
          width: 50

        },
        {
          title: '操作',
          width: 50,
          // fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      data1: [],
      data2: []
    }
  },
  created () {
    this.getTableList()
  },
  methods: {
    changeTable (key) {
      this.activeTab = key
      const map = this.jsonToMap(localStorage.getItem('entryMap'))
      const checkList = []
      const checkList1 = []
      for (let i = 0; i < this.data.length; i++) {
        for (const key of map.keys()) {
          if (this.data[i].id === key) {
            checkList.push(this.data[i])
          } else {
            checkList1.push(this.data[i])
          }
        }
      }
      if (key === 1) {
        // 已盘点
        this.getTableList(1)
      } else if (key === 2) {
        this.getTableList(2)
      } else {
        this.getTableList()
      }
    },
    jsonToMap (jsonStr) {
      return new Map(JSON.parse(jsonStr))
    },
    detailItem (item) {
      this.$router.push({
        path: '/materials/entry',
        query: {
          type: 'fixedCapital',
          id: Number(this.$route.query.id),
          assetType: this.assetType,
          itemId: item.id,
          detail: JSON.stringify(item)
        }
      })
    },
    getTableList (status) {
      status = Number(status)
      const param = {
        id: Number(this.$route.query.id),
        check_status: status
      }
      getDetailTable1(param).then(res => {
        if (res.code === 200) {
          if (status === 1) {
            // 已盘点
            this.data1 = res.data.list
          } else if (status === 2) {
            // 未盘点
            this.data2 = res.data.list
          } else {
            this.data = res.data.list
          }
          this.tabBar[0].number = res.data.check_total
          this.tabBar[1].number = res.data.finish_count
          this.tabBar[2].number = res.data.active_count
          sessionStorage.setItem('fixNum', res.data.total)
          // this.getCheckedLength()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 获取已盘点数据
    getCheckedLength () {
      const map = this.jsonToMap(localStorage.getItem('entryMap'))
      this.tabBar[1].number = map.size
      this.tabBar[2].number = this.tabBar[0].number === 0 ? 0 : this.tabBar[0].number - map.size
    }
  }
}
</script>

<style lang="scss" scoped>
.consumables{
  padding: 12px 16px;
  margin-bottom: 82px;
  box-sizing: border-box;
  background: #fff;
  margin-top: 4px;
  ul{
    display: flex;
    color: #E1AA6C;
    font-size: 14px;
    height: 30px;
    line-height: 27px;
    margin-bottom: 10px;
    li{
      flex: 1;
      text-align: center;
      border: 1px solid #e1aa6c;
      border-radius: 5px;
      &:not(:last-child){
        margin-right: 5px;
      }
    }
    .active{
      background: #E1AA6C;
      color: #fff;
    }
  }
  .entry{
    color: #E1AA6C;
  }
}
</style>
