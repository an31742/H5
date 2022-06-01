<template>
  <div>
    <DescArea>
      <div v-for="(candidateItem, idx) in candidates" :key="idx" style="display: flex;justify-content: space-between;align-items: center;">
        <div class="linkUsers">
          <PersonItem :person="candidateItem.candidate"></PersonItem>
          <span style="color: #FFAB2D;">审批中</span>
        </div>
        <span v-if="fromAdmin" :size="16">
          <van-button
            type="default"
            round
            size="small"
            class="action-button"
            @click="showTrans(candidateItem.record_id)"
          >转办</van-button>
          <van-button
            type="default"
            round
            size="small"
            class="action-button"
            @click="showJump(candidateItem.record_id)"
          >跳过</van-button>
        </span>
      </div>
    </DescArea>
    <!--<TransModal ref="TransModal" @ok="handleOk"></TransModal>-->
    <!--<SkipModal ref="SkipModal" @ok="handleOk"></SkipModal>-->
  </div>
</template>

<script>
import PersonItem from './PersonItem'
import DescArea from './DescArea'
// import TransModal from '@/views/procedure/components/actions/TransModal'
// import SkipModal from '@/views/procedure/components/actions/SkipModal'

export default {
  name: 'NodeRunning',
  components: {
    PersonItem,
    DescArea
    // SkipModal,
    // TransModal
  },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    fromAdmin: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    candidates () {
      return this.item.extra.candidates
    }
  },
  methods: {
    // fromAdmin && 跳过、转办逻辑     这里不需要展示，只是后台的"审批处理"入口处需要展示
    showTrans (candidateId) {
      this.$refs.TransModal.show(candidateId)
    },
    showJump (candidateId) {
      this.$refs.SkipModal.show(candidateId)
    },
    handleOk () {
      this.$emit('ok')
    }
  }
}
</script>
