<template>
  <div class="work-record">
    <div class="work-record-content">
      <van-form @submit="onSubmit">
        <van-field
          readonly
          clickable
          required
          class="work-record-field"
          :value="form.customer"
          label="选择客户"
          placeholder="请选择客户"
        >
          <template #right-icon><svg-icon icon-class="arrow-right-gray" class="work-record-field-icon"/></template>
        </van-field>
        <van-field
          v-model="form.type"
          readonly
          clickable
          required
          name="picker"
          class="work-record-field"
          label="服务类型"
          placeholder="请选择服务类型"
        >
          <template #right-icon><svg-icon icon-class="arrow-right-gray" class="work-record-field-icon"/></template>
        </van-field>
        <div class="work-record-field work-record-urgent">
          <span class="work-record-urgent-text">是否加急</span>
          <div class="work-record-urgent-button">
            <van-button
              v-for="(item, index) in urgentStatusList"
              :key="index"
              class="choice-button white"
              native-type="button"
              :class="form.urgent === item.value ? 'active' : ''"
              size="small"
              @click="selectUrgentStatus(item, index)"
            >
              {{ item.label }}
              <svg-icon v-if="form.urgent === item.value" class="corner" icon-class="corner" />
            </van-button>
          </div>
        </div>
      </van-form>
    </div>
    <div class="work-record-button">
      <van-button round block type="info" native-type="submit" color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)">
        提交
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkRecord',
  data () {
    return {
      form: {
        customer: '',
        type: '',
        urgent: 0
      },
      urgentStatusList: [
        {
          value: 0,
          label: '不加急'
        },
        {
          value: 1,
          label: '加急'
        }
      ]
    }
  },
  methods: {
    onSubmit () {

    },
    // 加急 / 不加急
    selectUrgentStatus (val, ind) {
      console.log(val, ind)
      this.form.urgent = val.value
    }
  }
}
</script>

<style lang="scss" scoped>
  .work {
    &-record {
      font-family: PingFangSC-Regular, PingFang SC;
      min-height: 100vh;
      background: #F6F8FA;

      &-field {
        padding-top: 15px;
        padding-bottom: 15px;
        margin-top: 12px;

        &::after {
          border-bottom: 0;
        }

        &-icon {
          color: #C7C7C7;
          font-size: 15px;
        }
      }

      &-button {
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        background: #fff;
        padding: 16px 34px;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }

      &-urgent {
        padding: 9px 16px;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-text {
          font-size: 14px;
          color: #333;
          line-height: 24px;
          font-weight: 400;
        }

        &-button {
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
