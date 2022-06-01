<template>
  <div>
    <p class="title" :class="{'required': formRequired(opt)}" @click="modelHandle">
      {{ formLabel(opt) }}
    </p>
    <FormLinkStaff
      :max="1"
      :model="authModel"
      :opt="approveOptions"
      :marginBottom="0"
      :dataAuthority="opt.permissionApproval"
    ></FormLinkStaff>
    <FormTemplateSelect
      ref="formTemplateSelect"
      :model="authModel"
      :opt="templateOptions"
      :rules="rules"
    ></FormTemplateSelect>
    <FormLinkStaff
      :max="1"
      :model="authModel"
      :opt="dispatchOptions"
      :dataAuthority="opt.permissionWfe"
    ></FormLinkStaff>
    <p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>
  </div>
</template>

<script>
import mixin from '../mixin'
import FormLinkStaff from '../FormLinkStaff4TodoAuth.vue'
import FormTemplateSelect from '../FormTemplateSelect.vue'

export default {
  name: 'FormTodoAuth',
  components: {
    FormLinkStaff,
    FormTemplateSelect
  },
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
      approveOptions: {},
      templateOptions: {},
      dispatchOptions: {},
      authModel: {},
      rules: [{
        validator: this.validator,
        message: '代审批人与授权模板 必须同时设置'
      }]
    }
  },
  watch: {
    authModel: {
      handler (val, old) {
        if (val) {
          this.modelHandle(val)
        }
      },
      deep: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.approveOptions = {
        ...this.opt,
        code: 'approval_auth',
        name: '代审批人员',
        value: null,
        props: {
          extra: '',
          permission: this.opt.props.permissionWfe
        }
      }

      this.dispatchOptions = {
        ...this.opt,
        code: 'wfe_auth',
        name: '工单代派人员',
        value: null,
        props: {
          extra: '',
          permission: this.opt.props.permissionApproval
        }
      }

      this.templateOptions = {
        ...this.opt,
        value: null,
        code: 'approval_template',
        name: '授权模板'
      }
      const auth = this.model.auth
      if (auth) {
        this.authModel = {
          ...auth
        }
      }
    },
    modelHandle (auth) {
      let desc = ''
      if (auth.approval_auth_desc) {
        desc = desc + `代审批人员:${auth.approval_auth_desc};`
      }
      if (auth.approval_template) {
        desc = desc + `授权审批模板:${auth.approval_template_desc};`
      }
      if (auth.wfe_auth_desc) {
        desc = desc + `工单代派人员:${auth.wfe_auth_desc};`
      }
      this.$set(this.model, 'auth_desc', desc)
      // console.log('modelHandle auth', JSON.stringify(auth))
      this.$set(this.model, 'auth', auth)
      // 触发校验
      if (this.$refs.formTemplateSelect) {
        this.$refs.formTemplateSelect.validateField()
      }
    },
    validator () {
      if (!this.model.auth) {
        return true
      }
      // 待审批人 与审批模板 必须同时设置
      return !!this.model.auth.approval_auth_desc === !!this.model.auth.approval_template_desc
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  padding: 0 15px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 24px;
  position: relative;
  color: #333;
  margin-bottom: 2px;
}

.required {
  &::before {
    content: '*';
    display: block;
    font-size: 14px;
    line-height: 22px;
    color: #ee0a24;
    position: absolute;
    left: 8px;
    top: 0;
  }
}
::v-deep .van-field__label {
  padding-bottom: 0;
  padding-top: 0;
  background: none;
}
</style>
