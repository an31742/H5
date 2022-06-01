<template>
  <div>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
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
          <div class="content" v-for="(item, index) in list" :key="index">
            <img v-if="item.picture" class="image" :src="item.picture" alt="" />
            <img v-else :src="require('@/assets/noPicture.png')" style="width:80px;height:45px;" />
            <div class="text">
              <div>{{ `${item.name}(可用数量：${item.can_use_inventory})` }}</div>
              <div class="num">规格型号：{{ item.model_specification || '--' }}</div>
              <div class="num">品牌：{{ item.brand || '--' }}</div>
            </div>
            <van-stepper
              v-model="item.apply_amount"
              :min="0"
              :max="item.inventory"
              default-value="0"
              :button-size="16"
              theme="round"
              :integer="true"
            />
          </div>
        </template>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AssetsList',
  components: {},
  props: {
    api: {
      type: Function,
      default: () => {}
    },
    params: {
      type: Object,
      default: () => {}
    },
    downloadStatusText: {
      type: String,
      default: ''
    },
    isDownLoad: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showPicker: false,
      list: [],
      page: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      selectedData: []
    }
  },
  watch: {
    list: {
      handler (val, old) {
        const list = []
        let num = 0
        this.list.forEach(e => {
          if (e.apply_amount > 0) {
            list.push(e)
            num += e.apply_amount
          }
        })
        console.log(list)
        this.selectedData = list
        this.$emit('submit', list, num)
      },
      deep: true
    },
    params: {
      handler (val, old) {
        console.log('paramsdsfsdfs', this.params)
        this.onRefresh()
      },
      deep: true
    },
    selectList: {
      handler (val, old) {
        this.list.forEach(item => {
          val.forEach(v => {
            if (v.id === item.id) {
              item.apply_amount = v.apply_amount
            }
          })
        })

        let num = 0
        this.list.forEach(e => {
          if (e.apply_amount > 0) {
            num += e.apply_amount
          }
        })

        this.$emit('submit', val, num)
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['appConfig', 'selectList'])
  },
  methods: {
    // 下拉刷新
    onRefresh () {
      console.log('下拉刷新')
      this.page = 1
      this.onLoad(true)
    },
    noLoading () {
      this.loading = false
      this.finished = true
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
      if (!data.warehouse_id) {
        return
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
              this.list = this.deweight(this.list)
              this.$store.commit('workorder/SET_MATERIAL_LIST', this.list)
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
    },
    deweight (arr) {
      const newArr = []
      arr.forEach((a) => {
        const istrue = newArr.every((b) => {
          return a.id !== b.id
        })
        if (istrue) {
          newArr.push(a)
        }
      })
      return newArr
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .van-pull-refresh {
    height: calc(100% - 80px);
    margin-top: 101px;
    overflow-y: scroll;
  }
}

.content {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  align-items: flex-start;
  .image {
    width: 80px;
    height: 45px;
  }
  .text {
    width: 180px;
    font-size: 14px;
    margin-left: 10px;
  }
  .num {
    font-size: 13px;
    color: #999999;
  }
  ::v-deep .van-stepper {
    margin-top: 2px;
  }
}
</style>
