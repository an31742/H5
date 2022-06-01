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
      v-if="activeTab === 0"
      :columns="columns"
      rowKey="id"
      :data-source="data"
      bordered
      :pagination="false"
      :scroll="{x:300}"
      size="small"
    >
      <div slot="action" slot-scope="text, record">
        <p class="entry" @click="detailItem(record)">盘点录入 ></p>
      </div>
    </a-table>
    <a-table
      v-if="activeTab === 1"
      :columns="columns"
      rowKey="id"
      :data-source="data1"
      bordered
      :pagination="false"
      :scroll="{x:300}"
      size="small"
    >
      <div slot="action" slot-scope="text, record">
        <p class="entry" @click="detailItem(record)">盘点录入 ></p>
      </div>
    </a-table>
    <a-table
      v-if="activeTab === 2"
      :columns="columns"
      rowKey="id"
      :data-source="data2"
      bordered
      :pagination="false"
      :scroll="{x:300}"
      size="small"
    >
      <div slot="action" slot-scope="text, record">
        <p class="entry" @click="detailItem(record)">盘点录入 ></p>
      </div>
    </a-table>
  </div>
</template>

<script>
import { getDetailTable } from 'api/materials'

export default {
  name: 'Consumables',
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
          width: 50,
          scopedSlots: { customRender: 'date' }
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
      const map = this.jsonToMap(localStorage.getItem('entryMap1'))
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
    detailItem (text) {
      console.log(88888, text)
      this.$router.push({
        path: '/materials/entry',
        query: {
          type: 'consumables',
          id: Number(this.$route.query.id),
          itemId: text.id,
          assetType: this.assetType,
          detail: JSON.stringify(text)
        }
      })
    },
    getTableList (status) {
      const param = {
        id: Number(this.$route.query.id),
        check_status: status
      }
      getDetailTable(param).then(res => {
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
          sessionStorage.setItem('conNum', res.data.total)

          this.tabBar[1].number = res.data.finish_count
          this.tabBar[2].number = res.data.active_count
        } else {
          this.$toast(res.msg)
        }
      })
    },
    jsonToMap (jsonStr) {
      return new Map(JSON.parse(jsonStr))
    },
    // 获取已盘点数据
    getCheckedLength () {
      const map = this.jsonToMap(localStorage.getItem('entryMap1'))
      this.tabBar[1].number = map.size
      console.log(this.tabBar[0].number, '11111111')
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
