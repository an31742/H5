<template>
  <div>
    <van-field
      v-model="selRole"
      clickable
      name="selRole"
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
          v-model="roleName"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectRelatedRole"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择身份弹层-->
    <van-popup v-model="popupRoleShow" class="form-component" :get-container="getBodyContainer" position="bottom">
      <van-picker
        show-toolbar
        :columns="objArray2StringArray(roleList, 'label')"
        @cancel="popupRoleShow=false"
        @confirm="(value, index) => { selectRole(value, index) }"
      >
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import { mapGetters } from 'vuex'
import { objArray2StringArray } from 'utils/index'

export default {
  name: 'FwUserRole',
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      selRole: null,
      roleName: '',
      popupRoleShow: false,
      objArray2StringArray
    }
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ]),
    // 角色列表
    roleList () {
      return this.appConfig ? this.appConfig['USER_V2_CHECKIN_ROLE_LIST'] : []
    }
  },
  methods: {
    // 选择身份弹框
    selectRelatedRole () {
      this.popupRoleShow = true
    },
    // 选择身份
    selectRole (value, index) {
      this.popupRoleShow = false

      this.roleName = value || ''
      const role = this.roleList[index]
      this.selRole = role.value

      this.$set(this.model, this.opt.code, +role.value)
      this.$set(this.model, this.opt.code + '_desc', this.roleName)
    }
  }
}
</script>
