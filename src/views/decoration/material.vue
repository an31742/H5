<template>
  <div class="questionCom">
    <van-sticky>
      <van-search v-model="params.keyword" placeholder="请输入房屋信息/申请编号" @input="onRefresh"/>
    </van-sticky>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-skeleton slot="loading" title avatar :row="5" :loading="loading"></van-skeleton>
        <template v-if="list.length>0">
          <ul>
            <li v-for="(item,index) in list" :key="index">
              <van-row>
                <van-col span="16" class="name">
                  <p>
                    <span v-if="item.apply_status === 1">{{ item.apply_status_txt }}</span>
                    {{ item.room_name }}
                  </p>
                  <p>申请编号：{{ item.no }}</p>
                </van-col>
                <van-col span="8" style="display: flex;justify-content: end;">
                  <van-button color="#E1AA6C" plain @click="viewItem(item)">资料补充</van-button>
                </van-col>
              </van-row>
            </li>
          </ul>
        </template>
        <div v-if="finished && list.length===0">
          <div class="empty">
            <img src="@/assets/image/decoration/empty.png" alt="" class="empty-img">
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { applyList } from '@/api/decoration'
export default {
  name: 'Material',
  data () {
    return {
      params: {
        keyword: ''
      },
      list: [],
      finished: true,
      loading: false
    }
  },
  created () {
    this.onRefresh()
  },
  methods: {
    viewItem (item) {
      this.$router.push(`/decoration/replenish?id=${item.id}`)
    },
    // 下拉刷新
    onRefresh () {
      this.page = 1
      this.onLoad(true)
    },

    // 加载数据
    onLoad (flag) {
      const data = {
        ...this.params,
        page: this.page,
        page_size: this.pageSize
      }
      this.loading = true

      applyList(data).then(res => {
        this.loading = false
        if (res.code === 200) {
          if (res.data) {
            const arr = res.data.list || []

            if (!flag) {
              this.list = [...this.list, ...arr]
            } else {
              this.list = [...arr]
            }
            console.log('this.list', this.list)
            this.page++
            this.finished = this.list.length >= res.data.total || !arr.length
          } else {
            this.finished = true
          }
        } else {
          this.$toast(res.msg)
        }
      }).catch(() => {
        this.loading = false
        this.finished = true
      })
    }
  }
}
</script>

<style scoped lang="scss">
.questionCom{
  .van-search__content{
    border-radius: 20px;
  }
  ul{
    padding: 12px 16px;
    box-sizing: border-box;
    li{
      padding: 22px 12px;
      box-sizing: border-box;
      background: #fff;
      border-radius: 6px;
      margin-bottom: 12px;
      .name{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size: 15px;
        color: #333333;
        p:first-child{
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          font-size: 15px;
          color: #333333;
          span{
            width: 44px;
            height: 20px;
            display: inline-block;
            text-align: center;
            line-height: 20px;
            background: #FEE8E7;
            border-radius: 4px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FF4D4F;
          }
        }
        p:last-child{
          font-size: 12px;
          color: #999;
        }
      }
      .van-button{
        width: 80px;
        height: 30px;
        font-size: 14px;
        padding: 0;
        border-radius: 6px;
      }
    }
  }
  .empty{
    text-align: center;
    padding-top: 20px;
    .empty-img{
      width: 200px;
      height: 106px;
    }
  }
}
</style>
