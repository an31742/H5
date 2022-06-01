<template>
  <div class="fw-container middle-content">
    <AlertModal ref="alertModal" />
    <div v-show="list&&list.length>0" class="btns">
      <div v-show="isEditMode" class="f-l">
        <span @click="readItems()">已读</span>
        <span v-if="routeName==='MessageNotice'" class="del" @click="delItems()">删除</span>
      </div>
      <span v-show="isEditMode" class="f-r" @click="setEditMode(false)">完成</span>
      <span v-show="!isEditMode" class="f-r" @click="setEditMode(true)">编辑</span>
    </div>

    <div style="height:39px;background-color: #fff;" ></div>
    <pull-list
      ref="pullList"
      style="overflow:auto;-webkit-overflow-scrolling:touch;"
      iconName="no-msg"
      listProp="list"
      :list.sync="list"
      :api="minipNoticeList"
      :apiParams.sync="apiParams"
      emptyText="暂无消息"
      @refresh="getCount()"
    >
      <div slot="content">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="item-card-c"
          :class="{'animate__slideOutLeft':item._isDelete}"
          @click="itemCardClick(item)"
        >
          <div v-if="!!item.cover_image" class="img">
            <img :src="item.cover_image" alt="" srcset="">
          </div>
          <div class="item-card" :class="{'border-top-less':!!item.cover_image}">
            <div class="header" :class="{'red-point':!item.read_time}">
              <span class="title one-line-dot">
                {{ item.title }}
              </span>
              <tip v-if="item.content_type!==4" :noticeType="item.content_type"/>
              <div style="display:flex">
                <van-button v-if="item.ext && delayHandle(item.ext)" class="notice-item-delay" size="mini" type="info">
                  <template slot>
                    <svg-icon class="notice-item-delay-icon" icon-class="notice-delay" />
                    <span>超时</span>
                  </template>
                </van-button>
                <van-button v-if="item.ext && urgentHandle(item.ext)" class="notice-item-urgent" size="mini" type="info">
                  <template slot>
                    <svg-icon class="notice-item-urgent-icon" icon-class="notice-urgent" />
                    <span>加急</span>
                  </template>
                </van-button>
              </div>
            </div>
            <div class="content">{{ item.summary }}</div>
            <div v-if="item.comment" class="content">备注：{{ item.comment }}</div>
            <div class="footer">
              {{ dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
            <svg-icon
              v-show="isEditMode"
              :icon-class="item._ischeck?'corner':'uncheck'"
              class="corner svg-icon2"
            />
          </div>
        </div>
      </div>
    </pull-list>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import tip from './components/MsgTypeTip'
import AlertModal from './components/alertModal'
import pullList from 'views/components/pulllList'
import { minipNoticeRead, minipNoticeDelete, minipNoticeList } from 'api/messageV2'
import { homeReclaim } from '@/utils/const'

export default {
  name: 'MessageList',
  components: { pullList, tip, AlertModal },
  data () {
    return {
      isEditMode: false,
      status,
      list: [],
      loading: false,
      delConfirmShow: true
    }
  },
  computed: {
    apiParams () {
      // 0 {系统消息，公告，调查问卷} 4 工单消息 6 审批流消息
      const flag = {
        MessageWork: 4,
        MessageApproval: 6,
        MessageNotice: 0
      }

      return {
        notice_type: flag[this.$route.name]
      }
    },
    ...mapGetters(['commonInfo']),
    routeName () {
      if (this.$route) {
        return this.$route.name
      }

      return ''
    }
  },
  watch: {
    routeName (val) {
      this.isEditMode = false
      this.getList()
    }
  },
  methods: {
    dayjs,
    minipNoticeList,

    getCount () {
      // 更新未读统计数量
      this.$store.dispatch('message/updateMessageStatistics')
    },

    goDetail (item) {
      // // 入库
      // this.$router.push({
      //   name: 'putStorageV2',
      //   query: {
      //     id: 705
      //   }
      // })
      switch (item.content_type) {
        // type  2是入库。 1是调拨  4是第二个版本的入库   5是第二个版本的调拨
        case 1:
          this.$store.dispatch('message/minipNoticeRead', [Number(item.id)])
          if (item.ext) {
            const ext = JSON.parse(item.ext)
            if (ext.type === 2) {
              // 跳转入库详情
              this.$router.push({
                name: 'putStorage',
                query: {
                  id: ext.id
                }
              })
            } else if (ext.type === 1) {
              // 跳转调拨详情
              this.$router.push({
                name: 'transfer',
                query: {
                  id: ext.id
                }
              })
            } else if (ext.type === 3) {
              // 跳转调拨详情
              this.$router.push({
                name: 'fixedAssets',
                query: {
                  id: ext.id,
                  assets_flow_id: ext.assets_flow_id
                }
              })
            } else if (ext.type === 24) {
              // 跳转仓库第二版本入库
              this.$router.push({
                name: 'putStorageV2',
                query: {
                  id: ext.id
                }
              })
            } else if (ext.type === 25) {
              // 跳转仓库第二版本调拨
              this.$router.push({
                name: 'transferV2',
                query: {
                  id: ext.id
                }
              })
            } else if (ext.type === 26) {
              // 跳转仓库第二版本采购
              this.$router.push({
                name: 'fixedAssetsV2',
                query: {
                  id: ext.id
                }
              })
            } else if (ext.type === 27) {
              // 盘点完成
              this.$router.push({
                name: 'MaterialsResult',
                query: {
                  id: ext.id,
                  assetType: ext.assetType || 1
                }
              })
            } else if (ext.type === 28) {
              // 复核盘点
              this.$router.push({
                name: 'ReviewDetail',
                query: {
                  id: ext.id,
                  assetType: ext.assetType || 1
                }
              })
            } else if (ext.type === 29) {
              // 出库单
              this.$router.push({
                name: 'MyOutDetail',
                query: {
                  receiveId: ext.receiveId
                }
              })
            } else if (ext.type === 210) {
              // 盘点回退，预警，通知
              this.$router.push({
                name: 'MaterialsCountedDetail',
                query: {
                  id: ext.id,
                  assetType: ext.assetType || 1
                }
              })
            } else if (ext.type === 212) {
              // 盘点回退，预警，通知
              this.$router.push({
                name: 'MaterialsCountedDetail',
                query: {
                  id: ext.id,
                  assetType: ext.assetType || 1
                }
              })
            } else {
              this.$router.push({
                name: 'MessageDetail',
                query: {
                  id: item.id,
                  goback: 1
                }
              })
            }
          } else {
            this.$router.push({
              name: 'MessageDetail',
              query: {
                id: item.id,
                goback: 1
              }
            })
          }
          break
        // 调查问卷
        case 3:
          this.$router.push({
            name: 'SurveyAdd',
            query: {
              id: item.material_id,
              msgId: item.id,
              goback: 1
            }
          })
          break
        // 工单消息
        case 4:
          this.$store.dispatch('message/minipNoticeRead', [Number(item.id)])
          if (item.ext) {
            const ext = JSON.parse(item.ext) || {}
            if (ext.jump_to === 3) {
              this.$router.push({
                name: 'WorkDetail',
                query: {
                  id: encodeURI(ext['flow_instance_record_id'])
                }
              })
            } else if (ext.jump_to === 1 || ext.jump_to === 2) {
              // 工单通知消息
              this.$router.push({
                name: 'MessageDetail',
                query: {
                  id: item.id,
                  goback: 1
                }
              })
            }
          }
          break
        // 审批消息
        case 6:
          if (item.ext) {
            const ext = JSON.parse(item.ext)
            this.$store.dispatch('message/minipNoticeRead', [Number(item.id)])
            if (ext.jump_to === 4 || ext.jump_to === 6) {
              this.$router.push({
                name: 'ApproveDetail',
                query: {
                  instanceId: encodeURI(ext['flow_instance_record_id'])
                }
              })
            } else if (ext.jump_to === 5) {
              this.$router.push({
                name: 'ApproveDetail',
                query: {
                  nodeId: encodeURI(ext['node_candidate_record_id'])
                }
              })
            }
          }
          break
        case 18:
          if (!item.ext) break
          const ext = JSON.parse(item.ext)
          this.$router.push({
            name: 'ReclaimOrderDetail',
            query: {
              type: Number(ext.order_type) === 1 ? homeReclaim.STATUS_NO_EVALUATE : homeReclaim.STATUS_NO_PICK_UP,
              order_id: ext.order_id
            }
          })
          break
        case 16:
          // EBA类型
          if (!item.ext) break
          const extData = JSON.parse(item.ext)
          // if (extData.jump_url) window.location.href = extData.jump_url
          if (extData.jump_url) window.open(extData.jump_url, '_self')
          break
        // 其他消息 - 系统公告等
        default:
          this.$router.push({
            name: 'MessageDetail',
            query: {
              id: item.id,
              goback: 1
            }
          })
          break
      }
    },

    setEditMode (val) {
      this.isEditMode = val
    },

    itemCardClick (item) {
      if (this.isEditMode) {
        item._ischeck = true
        this.$forceUpdate()
      } else {
        this.goDetail(item)
      }
    },

    // 超时
    delayHandle (val) {
      let result = false
      try {
        const data = JSON.parse(val)
        if (data && data.overtime_level > 0) {
          result = true
        }
      } catch (e) {}
      // overtime_level=0，正常
      return result
    },

    // 加急
    urgentHandle (val) {
      let result = false
      try {
        const data = JSON.parse(val)
        if (data && data.is_urgent === 1) {
          result = true
        }
      } catch (e) {}
      return result
    },

    async readItems () {
      const arr = this.list.filter(t => t._ischeck).map(t => t.id)

      const res = await minipNoticeRead({ ids: arr })

      if (res.code === 200) {
        this.isEditMode = false
        // this.getList()
        this.$refs.pullList.pullingDown()
      } else {
        this.$toast(res.msg)
      }
    },

    async delItems () {
      const arr = this.list.filter(t => t._ischeck).map(t => t.id)
      this.isEditMode = false
      const res = await minipNoticeDelete({ ids: arr })

      if (res.code === 200) {
        this.list.forEach(t => {
          if (t._ischeck) {
            t._isDelete = true
          }
        })

        this.isEditMode = false
        this.$forceUpdate()

        setTimeout(() => {
          this.$refs.pullList.pullingDown()
        }, 500)
      } else {
        this.$toast(res.msg)
      }
    },

    getList () {
      this.$nextTick(_ => {
        console.log('getList', JSON.stringify(this.apiParams))
        this.$refs.pullList.pullingDown()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes slideOutLeft {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}
.animate__slideOutLeft {
  animation-duration: 0.5s;
  animation-fill-mode: both;
  animation-name: slideOutLeft;

}

.list-wrap {
  height: calc(100% - 40px);
}
::v-deep .item-card-c{
  margin: 0 16px 12px 16px;
  .img,img{
    width: 100%;
    height: 150px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .border-top-less{
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
::v-deep .item-card{
  margin: 0;
}
.one-line-dot {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.flex-column {
  display: flex;
  flex-direction: column;
  position: relative;
  .expand {
     position: relative;
    flex: 1;
    overflow: scroll;
    display: flex;
    flex-direction: column;
  }
}
::v-deep .list-wrap {
  // height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  .empty-list {
    background-color: #fff;

    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .van-pull-refresh{
    flex: 1;
  }
}
::v-deep .red-point {
  position: relative;
}
::v-deep .red-point::before {
  content: ' ';
  border: 4px solid #FF4D4F; /*设置红色*/
  border-radius: 4px; /*设置圆角*/
  background-color: #FF4D4F;
  position: absolute;
  z-index: 10;
  left: -6px;
  top: -2px;
}
.btns {
  position: fixed;
  box-sizing:border-box;
  z-index: 100;
  top:44px;
  width: 100vw;
  height: 40px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #bc8d58;
  line-height: 23px;
  background-color: #f5f5f5;
  padding: 8px 16px 12px 16px;

  .f-r {
    display: block;
    float: right;
  }
  .f-l {
    display: block;
    float: left;
  }
  .del {
    margin-left: 20px;
    color: #fa5151;
  }
}
.item-card{
  position: relative;
}
.svg-icon2 { font-size: 29px;color: #DCDCDC; }
.corner{
  position: absolute;
  right: 0;
  bottom: 0;

}
.custom-image .van-empty__image {
  width: 90px;
  height: 90px;
}
.notice {
  &-tags {
    display: flex;

    &-content {
      background: #fff;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-item {
      width: 67px;
      height: 32px;
      color: #333333;
      background: #F5F5F5;
      border: 0;
      margin-right: 12px;
    }

    &-light {
      color: #BC8D58;
      background: #FAF1E8;
    }

    &-sign {
      font-size: 14px;
      color: #BC8D58;
      line-height: 20px;
    }
  }

  &-time {
    padding: 12px 16px 4px;
    box-sizing: border-box;
    color: #999;
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
  }

  &-item {
    background: #fff;
    padding: 12px 16px;
    box-sizing: border-box;

    &-title {
      font-size: 16px;
      color: #282828;
      line-height: 22px;
      font-weight: 400;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-desc {
      font-size: 14px;
      color: #666;
      font-weight: 400;
      line-height: 20px;
      overflow:hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2;
    }

    &-sign {
      position: relative;

      &::before {
        content: '';
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: -webkit-linear-gradient(#FD8989, #FF6464);
        display: block;
        position: absolute;
        left: -7px;
        top: 0;
      }
    }

    &-delay {
      width: 55px;
      background: #FA5151;
      border-radius: 4px;
      border: 0;
      font-size: 12px;
    }

    &-urgent {
      width: 55px;
      color: #FA5151;
      background: #FEE5E5;
      border-radius: 4px;
      font-size: 12px;
      border: 0;
    }
  }

  &-empty {
    height: calc(100vh - 142px);
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &-all {
      height: calc(100vh - 94px);
    }

    &-image {
      width: 250px;
      margin-bottom: 20px;
    }

    &-text {
      font-size: 14px;
      color: #BC8D58;
      line-height: 20px;
      font-weight: 400;
    }
  }
}
</style>
