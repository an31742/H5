<template>
  <div>
    <div class="work-detail-content" style="padding: 0;">
      <van-cell v-if="appealHistory && appealHistory.length" clickable class="block">
        <van-steps
          class="bdn bgfff"
          active-color="#E1AA6C"
          inactive-color="#E1AA6C"
          direction="vertical"
          active="0"
        >
          <van-step v-for="(item, idx) in appealHistory" :key="idx">
            <template #active-icon>
              <img class="active-icon" :src="require('@/assets/image/step-icon.png')" />
            </template>
            <template #inactive-icon>
              <img class="active-icon" :src="require('@/assets/image/step-icon.png')" />
            </template>

            <!--动作、创建时间-->
            <div class="appeal-action">
              <a
                class="title"
                :class="{'dark': darkActions.indexOf(item.action) > -1}"
              >{{ item.action_name || '' }}</a>
              <span v-if="item.created">
                {{ dayjs(item.created).format('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </div>

            <!--描述-->
            <div class="appeal-desc">
              <div v-if="turnActions.includes(item.action)" style="display: flex;justify-content: space-between;">
                <span>
                  <span>{{ item.title }}：</span>
                  {{ item.author_name }}
                </span>
                <span v-if="item.biz_node_code === 'NODE_CODE_HANDLE'" @click="editLocus(item)"> 编辑</span>
              </div>
              <template v-else-if="onlyTitle.includes(item.action)">
                <span>{{ item.author_name }}</span>
                {{ item.title }}
              </template>
              <template v-else>
                <span>{{ item.author_name }}</span>
                {{ item.title }}
              </template>
              <div v-if="item.extra&&item.extra.co_user&&item.extra.co_user.length>0" class="label">
                <span>协办人</span>
                {{ item.extra.co_user.join(' ') }}
              </div>
            </div>

            <!--内容-->
            <div v-if="item.content" class="appeal-reason">{{ item.content }}</div>

            <!--表单-->
            <div v-if="item.form_data && string2obj(item.form_data)">
              <detail :formData="string2obj(item.form_data)"></detail>
            </div>

            <!--图片-->
            <div v-if="formatPictures(item.pictures)" class="appeal-img">
              <van-image
                v-for="(img, ind) in formatPictures(item.pictures)"
                :key="ind"
                lazy-load
                fit="cover"
                :src="cosImage(img)"
                style="vertical-align: top;"
                @click="previewImage(formatPictures(item.pictures), ind)"
              ></van-image>
            </div>
          </van-step>
        </van-steps>
      </van-cell>
      <empty-list v-if="!loading && (!appealHistory || !appealHistory.length)"></empty-list>
    </div>

    <!--图片预览插件-->
    <van-image-preview
      v-model="showPreview"
      :images="previewImages"
      :startPosition="previewIndex"
      @change="(num) => previewIndex = num"
    >
    </van-image-preview>
  </div>
</template>

<script>
import { wfeFlowInstanceLocus } from '@/api/wfe'
import detail from '@/views/formComponents/detail'
import emptyList from '@/views/components/emptyList'
import { string2obj } from '@/utils'
import dayjs from 'dayjs'

export default {
  name: 'Locus',
  components: {
    emptyList,
    detail
  },
  data () {
    return {
      dayjs,
      loading: false,
      appealHistory: [],
      onlyTitle: [12], // 只展示title
      turnActions: [1, 2, 3], // 姓名和动作反转
      darkActions: [1, 2, 3, 4], // 节点，需要跟动作的背景色区分开
      orderId: this.$route.query.id || '',

      showPreview: false,
      previewIndex: 0,
      previewImages: []
    }
  },
  watch: {
    '$route.query.id' (val) {
      if (val) {
        this.orderId = val
        this.getAppealLocus()
      }
    }
  },
  created () {
    if (!this.orderId) {
      this.$toast('参数错误')
      this.$router.back()
      return
    }

    this.getAppealLocus()
  },
  methods: {
    editLocus (item) {
      this.$store.commit('workorder/setNodeData', item)
      this.$router.push({ name: 'WorkEditLocus' })
    },
    string2obj,

    // 图片数组格式化
    formatPictures (str) {
      return string2obj(str)
    },

    // 图片预览
    previewImage (pictures, ind) {
      if (pictures && pictures.length) {
        this.previewImages = pictures.map(img => this.cosImage(img))
        this.previewIndex = ind
        this.showPreview = true
      }
    },

    // 获取进度详情
    getAppealLocus () {
      this.loading = true
      wfeFlowInstanceLocus({
        flow_instance_id: this.orderId
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          const list = res.data || []
          this.appealHistory = list.reverse()
        } else {
          this.$toast(res.msg || '获取进度信息失败')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .work {
    font-family: PingFangSC-Regular, PingFang SC;
    height: 100%;
    background: #F6F8FA;

    .flex-column.van-tab__pane {
      height: calc(100vh - 44px);
      overflow-y: auto;
    }

    &-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-mgb20 {
      margin-bottom: 20px;
    }

    &-mgb16 {
      margin-bottom: 16px;
    }

    &-detail {
      overflow: scroll;
      margin-bottom: 4px;

      &-content {
        padding: 12px 16px;
        box-sizing: border-box;
        background: #fff;
        margin-top: 4px;
      }

      &-title {
        font-size: 15px;
        color: #282828;
        line-height: 22px;
        font-weight: 500;
      }

      &-label, &-status, &-desc, &-yellow {
        font-size: 14px;
        color: #666;
        line-height: 20px;
        font-weight: 400;
      }

      &-status {
        color: #999;
        margin-left: 12px;
      }

      &-label {
        min-width: 70px;
      }

      &-yellow {
        color: #BC8D58;
        margin-left: 8px;
      }

      &-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      &-pictures {
        display: flex;
        flex-wrap: wrap;
      }

      &-image {
        margin-right: 7px;
        background: #f00;
        border-radius: 2px;

        &:nth-child(4n) {
          margin-right: 0;
        }
      }

      &-action {
        padding: 0 16px;
        box-sizing: border-box;
        background: #fff;
        border-top: 1px solid #F6F8FA;
      }

      &-urgent {
        width: 55px;
        color: #FA5151;
        background: #FEE5E5;
        border-radius: 4px;
        font-size: 12px;
        border: 0;

        &-content {
          display: flex;
          align-items: center;
        }
      }

      &-disabled {
        align-items: flex-start;

        &-content {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
        }
      }
    }

    &-flexstart {
      align-items: flex-start;
    }
  }

  .block {
    padding-left: 5px;
    padding-bottom: 0;

    .appeal-action {
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 21px;
      margin-bottom: 8px;
      position: relative;
      min-height: 21px;
      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999999;
        line-height: 21px;
        position: absolute;
        top: 0px;
        right: 0;
      }
      .title {
        background: #F9EEE2;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 500;
        color: #BC8D58;
        line-height: 21px;
        padding: 1px 8px;
        &.dark {
          background: #E1AA6C;
          color: #fff;
        }
      }
    }

    .appeal-desc {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #333333;
      line-height: 22px;
      margin-bottom: 12px;
      span {
        color: #BC8D58;
      }
    }

    .appeal-reason {
      background: #FAF7F4;
      padding: 12px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #666666;
      line-height: 20px;
      margin-bottom: 12px;
    }

    .appeal-img {
      margin-right: -10px;
      .van-image {
        width: 70px;
        height: 70px;
        border-radius: 4px;
        margin: 0 8px 8px 0;
        img.van-image__img {
          border-radius: 2px;
        }
      }

    }
  }

  ::v-deep {
    .van-step__line {
      background-color: #EAC9A5;
    }
    .van-step__circle-container {
      width: 12px;
    }
    .van-step--process .van-step__line:after {
      border: none;
    }
    .van-steps__items {
      &>div {
        padding-left: 10px;
        border-radius: 3px;
        padding-top: 10px;
        padding-bottom: 1px;
        &:first-child {
          background: #FFF6EA;
        }
      }
    }

    .van-step--vertical:not(:last-child)::after {
      border-bottom-width: 0;
    }
  }
</style>
