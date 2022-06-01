<template>
  <div class="approve">
    <p class="approve-title">基本信息</p>
    <div class="approve-content">
      <div class="approve-item">计划名称：{{ detail.name }}</div>
      <div class="approve-item">盘点单号：{{ detail.series }}</div>
      <div class="approve-item">仓库名称：{{ detail.warehouse_name }}</div>
      <div class="approve-item">开始时间：{{ dayjs(detail.start_time).format('YYYY.MM.DD') }}</div>
      <div class="approve-item">结束时间：{{ dayjs(detail.end_time).format('YYYY.MM.DD') }}</div>
      <div class="approve-item">资产类型：{{ detail.assets_group_name }}</div>
      <div class="approve-item">状态：{{ getItemByValue(detail.status) }}</div>
      <div class="approve-item">盘点人：{{ detail.check_user_name.toString() }}</div>
      <div class="approve-item">提交时间：{{ dayjs(detail.submit_time).format('YYYY.MM.DD') }}</div>
    </div>
    <p class="approve-title">盘点结果</p>
    <div class="approve-content">
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :scroll="{x:800}"
        :pagination="false"
        size="small"
        v-if="assetType === 2"
      >
        <template slot="results" slot-scope="text">
          {{ CHECK_RESULTS[text] }}
        </template>
        <!--        <span slot="date" slot-scope="text">{{ moment(text).format('YYYY-MM-DD') }}</span>-->
      </a-table>
      <a-table
        :columns="columns1"
        :data-source="data"
        bordered
        :scroll="{x:800}"
        :pagination="false"
        size="small"
        v-if="assetType === 1"
      >
        <template slot="status" slot-scope="text">
          {{ taskStatus[text] }}
        </template>
        <template slot="results" slot-scope="text">
          {{ CHECK_RESULTS[text] }}
        </template>
        <!--        <span slot="date" slot-scope="text">{{ moment(text).format('YYYY-MM-DD') }}</span>-->
      </a-table>
      <div class="button-box">
        <van-button plain color="#E1AA6C" size="small" @click="submit('end')">终止</van-button>
        <van-button plain color="#E1AA6C" size="small" @click="submit('back')">回退</van-button>
        <van-button color="#E1AA6C" size="small" @click="submit('sure')">确认</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkTask, getDetailTable, getDetailTable1, getMaterialsDetail } from 'api/materials'
import dayjs from 'dayjs'
import { getItemByValue, arr2obj } from 'utils'
import { statusList } from 'views/materials/constData'

export default {
  name: 'ReviewDetail',
  data () {
    return {
      taskStatus: { 1: '正常', 2: '故障', 3: '维修中' },
      columns: [
        {
          title: '物资分类',
          dataIndex: 'assets_level_name',
          width: 120,
          scopedSlots: { customRender: 'date' }
        },
        {
          title: '物资名称',
          dataIndex: 'assets_name',
          width: 120,
          scopedSlots: { customRender: 'date' }
        },
        {
          title: '品牌',
          ellipsis: true,
          width: 150,
          dataIndex: 'brand'
        },
        {
          title: '规格型号',
          width: 150,
          dataIndex: 'model_specification'
        },
        {
          title: '单位',
          width: 150,
          dataIndex: 'unit'
        },
        {
          title: '库存数量',
          width: 100,
          dataIndex: 'total'
        },
        {
          title: '盘点数量',
          width: 150,
          dataIndex: 'check_total'
        },
        {
          title: '盘点差异',
          width: 150,
          dataIndex: 'diff'
        },
        {
          title: '盘点结果',
          width: 100,
          dataIndex: 'results'
        },
        {
          title: '盘亏盘盈情况说明',
          width: 130,
          dataIndex: 'content'
        }
      ],
      columns1: [
        {
          title: '物资分类',
          dataIndex: 'assets_level_name',
          width: 120,
          scopedSlots: { customRender: 'date' }
        },
        {
          title: '资产编号',
          dataIndex: 'series',
          width: 120,
          scopedSlots: { customRender: 'date' }
        },
        {
          title: '物资名称',
          dataIndex: 'assets_name',
          width: 120,
          scopedSlots: { customRender: 'date' }
        },
        {
          title: '品牌',
          ellipsis: true,
          width: 150,
          dataIndex: 'brand'
        },
        {
          title: '规格型号',
          width: 150,
          dataIndex: 'model_specification'
        },
        {
          title: '设备序列号',
          width: 150,
          dataIndex: 'serial'
        },
        {
          title: '单位',
          width: 150,
          dataIndex: 'unit'
        },
        {
          title: '使用状态',
          width: 150,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '使用部门',
          width: 150,
          dataIndex: 'department'
        },
        {
          title: '使用人',
          width: 150,
          dataIndex: 'user_name'
        },
        {
          title: '存放地点',
          width: 100,
          dataIndex: 'locale'
        },
        {
          title: '盘点数量',
          width: 150,
          dataIndex: 'total'
        },
        {
          title: '盘点差异',
          width: 150,
          dataIndex: 'diff'
        },
        {
          title: '盘点结果',
          width: 100,
          dataIndex: 'results'
        },
        {
          title: '盘亏盘盈情况说明',
          width: 130,
          dataIndex: 'content'
        }
      ],
      data: [],
      id: Number(this.$route.query.id),
      dayjs,

      detail: {},
      statusList: statusList,
      assetType: Number(this.$route.query.assetType)
    }
  },
  created () {
    this.getDetail()
    this.getTableList()
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ]),
    CHECK_RESULTS () {
      console.log(3333333)
      console.log(this.appConfig.CHECK_RESULTS)
      return arr2obj(this.appConfig.CHECK_RESULTS)
    }
  },
  methods: {
    getItemByValue (val) {
      const item = getItemByValue(this.statusList, val)
      return item
    },
    getTableList () {
      const param = {
        id: this.id
      }
      if (this.assetType === 1) {
        // 固资
        getDetailTable1(param).then(res => {
          if (res.code === 200) {
            this.data = res.data.list
          } else {
            this.$toast(res.msg)
          }
        })
      } else {
        getDetailTable(param).then(res => {
          if (res.code === 200) {
            this.data = res.data.list
          } else {
            this.$toast(res.msg)
          }
        })
      }
    },
    getDetail () {
      const param = {
        id: this.id
      }
      getMaterialsDetail(param).then(res => {
        if (res.code === 200) {
          this.detail = res.data
        } else {
          this.$toast(res.msg)
        }
      })
    },
    submit (type) {
      const param = {
        status: '',
        id: this.id
      }
      if (type === 'end') {
        param.status = 5
      } else if (type === 'back') {
        param.status = 1
      } else {
        param.status = 3
      }
      checkTask(param).then(res => {
        if (res.code === 200) {
          this.$toast('操作成功')
          this.$router.back()
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.approve{
  height: 100vh;
  background: #F6F8FA;
  &-title {
    padding: 12px 16px 4px;
    box-sizing: border-box;
    font-size: 12px;
    color: #999;
    font-weight: 400;
    line-height: 16px;
  }

  &-content {
    padding: 12px 16px;
    box-sizing: border-box;
    background: #fff;
    margin-top: 4px;
  }
  &-item {
    font-size: 14px;
    color: #888;
    font-weight: 400;
    line-height: 20px;
    margin-top: 8px;
  }
  .button-box{
    margin-top: 10px;
    display: flex;
    .van-button{
      flex: 1;
      justify-content: space-between;
      border-radius: 5px;
      &:not(:last-child){
        margin-right: 25px;
      }
    }
  }
}
</style>
