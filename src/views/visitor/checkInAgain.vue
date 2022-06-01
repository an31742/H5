<template>
  <div>
    <div class="check-in-wrapper">
      <div class="field">
        <div class="label">
          <span>*</span>
          <div>通过门禁</div>
        </div>
        <div class="content">
          <input type="text" class="input" value="北1门-进">
        </div>
      </div>

      <div class="field">
        <div class="label">
          <span>*</span>
          <div>到访家庭</div>
        </div>
        <div class="content">
          <input type="text" class="input" value="3号楼 5单元">
        </div>
      </div>

      <div class="field">
        <div class="label">
          <span>*</span>
          <div>到访事由</div>
        </div>
        <div class="content">
          <input type="text" class="input" value="外卖餐饮">
        </div>
      </div>

      <div class="field">
        <div class="label">
          <span>*</span>
          <div>到访人数</div>
        </div>
        <div class="content">
          <input type="text" class="input">
        </div>
      </div>

      <div class="field">
        <div class="label">
          <span>*</span>
          <div>当日体温</div>
        </div>
        <div class="content">
          <input type="text" class="input" placeholder="请输入当前体温">
        </div>
      </div>
    </div>

    <div class="bottom">
      <button type="button" class="btn cancel" @click="handleCancel">取消</button>
      <button type="button" class="btn confirm" @click="handleConfirm">确定</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VisitorCheckInAgain'
}
</script>

<style lang="scss" scoped>
  .check-in-wrapper {
    box-sizing: border-box;
    padding: 0 20px;
  }
  .field {
    display: flex;
    height: 31px;
    margin: 16px 0;
    line-height: 31px;
    font-size: 15px;
    .label {
      position: relative;
      width: 77px;
      text-align: right;
      color: rgba(102, 102, 102, 1);
      span {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        color: #FA5151;
      }
    }
    .content {
      margin: 0 0 0 12px;
      .input {
        box-sizing: border-box;
        width: 257px;
        height: 31px;
        line-height: 31px;
        padding: 0 12px;
        border: none;
        border-radius: 4px;
        color: rgba(51, 51, 51, 1);
        background: rgba(245, 245, 245, 0.5);
      }
    }
  }

  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 80px;
    padding: 0 38px;

    .btn {
      display: block;
      width: 141px;
      height: 40px;
      line-height: 40px;
      border: none;
      border-radius: 20px;

      &.cancel {
        color: rgba(225, 170, 108, 1);
        border: 1px solid rgba(225, 170, 108, 1);
        background: #fff;
      }
      &.confirm {
        color: #fff;
        background: linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%);
      }
    }
  }
</style>
