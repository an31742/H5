<template>
  <div>
    <van-field
      v-model="selStaff"
      clickable
      name="selStaff"
      input-align="right"
      class="fw-field pr"
      label="选择员工"
      :readonly="true"
      placeholder="请选择"
      :required="true"
      :rules="[{ required: true, message: '请输入用途' }]"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="staffName"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="false"
          placeholder="请选择"
          @click="selectRelatedStaff"
        />
      </template>

      <!--右侧icon-->
      <template #right-icon>
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
        :api="getStaffList"
        @confirm="selectStaff"
        @cancel="popupStaffShow=false"
      >
        <template #item="{ item }">
          <div @click="selectStaff(item)" style="width: 100%">
            <span class="user-name">
              {{ item.name }} {{ item.mobile }}
            </span>
            <span class="item-extra">
              {{ (item.role_list&& item.role_list.length&& item.role_list[0].name) || '' }}
            </span>
          </div>
        </template>
      </SearchList>
    </van-popup>
  </div>
</template>

<script>
import { getStaffList } from '@/api/storeHouse.js'
import SearchList from '@/views/storeHouse/receive/components/searchStaffList'

export default {
  name: 'FwStaff',
  components: { SearchList },
  mixins: [],
  props: {
  },
  data () {
    return {
      selStaff: null,
      staffName: '',
      popupStaffShow: false,
      getStaffList,
      apiParams: {
        // scope: this.opt.props && this.opt.props.scope
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
      this.$refs.sl.close()

      if (!res) { return }

      this.selStaff = `${res['staff_id']}`
      this.staffName = `${res['name']} ${res['mobile']}`
      console.log(this.selStaff, this.staffName)
      this.$emit('submit', res)
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
