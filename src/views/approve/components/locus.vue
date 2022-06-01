<template>
  <van-steps
    class="bdn"
    active-color="#BC8D58"
    inactive-color="#E1AA6C"
    direction="vertical"
    :active="0"
  >
    <van-step v-for="(item, idx) in trackData" :key="idx" :class="'action-'+item.action">
      <!--<template #active-icon>-->
      <!--<img class="active-icon" :src="require('@/assets/image/step-icon.png')" />-->
      <!--</template>-->
      <template #inactive-icon>
        <!--审批中-->
        <img v-if="item.action===100" class="active-icon" :src="require('@/assets/image/step-doing.png')" />
        <!--未审批-->
        <img v-else-if="item.action===101 || item.action===200" class="active-icon" :src="require('@/assets/image/step-todo.png')" />
        <!--已审批-->
        <img v-else class="active-icon" :src="require('@/assets/image/step-icon.png')" />
      </template>

      <!--节点名称-->
      <div class="appeal-action">
        <span class="title dark appeal-extra" :class="'action-'+item.action">{{ item.extra.name }}</span>
        <span class="appeal-time">{{ item.created ? dayjs(item.created).format('YYYY-MM-DD HH:mm') : '' }}</span>
      </div>

      <div class="appeal-info">
        <components :is="traceConfig[item.action]" v-if="traceConfig[item.action]" :item="item"></components>
      </div>
    </van-step>
  </van-steps>
</template>

<script>
import dayjs from 'dayjs'

import NodeCloseByPerson from './widgets/NodeCloseByPerson'
import NodeSubmit from './widgets/NodeSubmit'
import NodeAgree from './widgets/NodeAgree'
import NodeCc from './widgets/NodeCc'
import NodeComment from './widgets/NodeComment'
import NodeRunning from './widgets/NodeRunning'
import NodeRemind from './widgets/NodeRemind'
import NodeFailBack from './widgets/NodeFailBack'
import NodeInvalid from './widgets/NodeInvalid'
import NodeRefuse from './widgets/NodeRefuse'
import NodeEdit from './widgets/NodeEdit'
import NodeAddSign from './widgets/NodeAddSign'
import NodeTrans from './widgets/NodeTrans'
import NodeCustomJump from './widgets/NodeCustomJump'
import NodeAutoJump from './widgets/NodeAutoJump'
import NodeAutoSkip from './widgets/NodeAutoSkip'
import NodeTodo from './widgets/NodeTodo'

export default {
  name: 'Locus',
  components: {
    NodeCloseByPerson,
    NodeSubmit,
    NodeAgree,
    NodeCc,
    NodeRunning,
    NodeComment,
    NodeRemind,
    NodeFailBack,
    NodeInvalid,
    NodeRefuse,
    NodeEdit,
    NodeAddSign,
    NodeTrans,
    NodeCustomJump,
    NodeAutoSkip,
    NodeTodo,
    NodeAutoJump
  },
  props: {
    trackData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dayjs,
      traceConfig: {
        1: 'NodeSubmit',
        2: 'NodeCc',
        3: 'NodeAddSign',
        4: 'NodeTrans',
        5: 'NodeAgree',
        6: 'NodeCustomJump',
        7: 'NodeAutoJump',
        8: 'NodeComment',
        9: 'NodeFailBack',
        10: 'NodeFailBack',
        11: 'NodeRefuse',
        12: 'NodeRemind',
        13: 'NodeCloseByPerson', // 人工结束
        // 14: 'NodeShowName',
        18: 'NodeEdit', // 编辑
        20: 'NodeAutoSkip',
        21: 'NodeInvalid', // 作废
        100: 'NodeRunning',
        101: 'NodeTodo' // 未审批
        // 200: 'NodeShowName' // 结束
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-step {
    margin: 4px 0 12px;
    height: calc(100vh - 44px);
    overflow: scroll;
  }

  .appeal-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .appeal-extra {
    padding: 1px 9px;
    box-sizing: border-box;
    background: rgba(225, 170, 108, 0.2);
    font-family: PingFangSC-Medium, PingFang SC;
    border-radius: 4px;
    color: #BC8D58;
    font-size: 15px;
    line-height: 21px;
    font-weight: 500;
    &.action-100 {
      background: #E1AA6C;
      color: #FFFFFF;
    }
    &.action-101, &.action-200 {
      background: rgba(153,153,153,.2);
      color: #999999;
    }
  }

  .appeal-time {
    color: #999999;
  }

  .appeal-info {
    padding: 0 8px;
    margin-top: 11px;
    color: #666666;
    display: flex;
    align-items: center;
  }

  .appeal-desc {
    padding: 12px 8px;
    box-sizing: border-box;
    background: #FAF7F4;
    font-size: 14px;
    font-weight: 400;
    color: #666;
    line-height: 20px;
    margin-top: 8px;
  }

  .appeal-link {
    padding: 8px 8px 0;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #6A98FF;
  }

  ::v-deep .van-grid-item__content {
    padding-top: 20px;
    padding-bottom: 0;
  }
  ::v-deep .van-tabs__line {
    z-index: 0 !important;
  }

  ::v-deep {
    .van-step__line {
      background-color: #EAC9A5;
    }
    .action-100, .action-101, .action-200 {
      .van-step__line {
        background-color: #E3E3E3 !important;
      }
    }
    .van-step__circle-container {
      width: 12px;
    }
    .van-step--process .van-step__line:after {
      border: none;
    }
    .van-steps__items {
      &>div {
        padding-left: 0;
        padding-top: 10px;
      }
    }

    .van-step--vertical:not(:last-child)::after {
      border-bottom-width: 0;
    }
  }
</style>
