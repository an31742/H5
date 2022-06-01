<template>
  <div>
    <van-field
      v-model="selStaff"
      clickable
      name="selStaff"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择')"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="staffName"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectRelatedStaff"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择员工弹层-->
    <van-popup
      v-model="popupStaffShow"
      :get-container="getBodyContainer"
      position="bottom"
      class="fake-popup form-component"
    >
      <SearchList
        ref="sl"
        emptyText="没有搜索到员工"
        placeholder="输入姓名/电话查找员工"
        :apiParams="apiParams"
        :api="getWidgetStaffListNoticeCandidate"
        @confirm="selectStaff"
        @cancel="popupStaffShow=false"
      >
        <template #item="{ item }">
          <div class="item-img">
            <van-image
              v-if="item.staff_avatar"
              round
              fit="cover"
              :src="item.staff_avatar"
              style="vertical-align: middle;width: 100%;height: 100%;"
            ></van-image>
          </div>
          <div class="user-name">
            {{ item.staff_name }} {{ item.staff_mobile }}
          </div>
          <div class="item-extra">
            {{ item.role_name }}
          </div>
        </template>
      </SearchList>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import { getWidgetStaffListNoticeCandidate } from './api'
import SearchList from './common/SearchList'

export default {
  name: 'FwStaff',
  components: { SearchList },
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    },
    extData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      selStaff: null,
      staffName: '',
      popupStaffShow: false,
      getWidgetStaffListNoticeCandidate,
      apiParams: {
        scope: this.opt.props && this.opt.props.scope,
        biz_service_id: this.extData && this.extData.biz_service_id,
        group_id: this.extData && this.extData.group_id
      }
    }
  },
  methods: {
    // 选择员工弹框
    selectRelatedStaff () {
      this.popupStaffShow = true
      this.$nextTick(() => {
        this.$refs.sl.show()
      })
    },

    // 选择员工
    selectStaff (res) {
      this.popupStaffShow = false

      if (!res) { return }

      this.selStaff = `${res['staff_id']}`
      this.staffName = `${res['staff_name']} ${res['staff_mobile']}`

      this.$set(this.model, this.opt.code, res['staff_id'])
      this.$set(this.model, this.opt.code + '_desc', this.staffName)
    }
  }
}
</script>

<style lang="scss" scoped>
  .fake-popup {
    height: 90%;width: 100%;font-family: PingFangSC-Regular, PingFang SC;
    position: fixed;
    left: 0;
    overflow: hidden;
    bottom: 0;
    border-radius: 0 !important;
  }

  .item-img {
    width: 30px;
    height: 30px;
    background: #eee;
    border-radius: 50%;
  }
  .item-extra {
    font-size: 14px;
    color: #999999;
    line-height: 20px;
  }
  .user-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 10px;
    text-align: left;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
  }
</style>
