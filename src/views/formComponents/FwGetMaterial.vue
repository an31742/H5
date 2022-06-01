<template>
  <van-cell-group>
    <van-cell @click="handleGo" is-link :title="opt.name" :value="opt.name" size="large" />
  </van-cell-group>
</template>

<script>
import mixin from './mixin'
export default {
  name: 'FwGetMaterial',
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
    setModel: {
      type: Boolean,
      default: () => true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleGo () {
      this.$store.commit('workorder/SET_FORM_MODEL', this.model)
      localStorage.setItem('formModel', JSON.stringify(this.model))
      this.$router.push({ name: 'ReceiveAdd' })
    }
  }

}
</script>
