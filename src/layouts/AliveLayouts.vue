<template>
  <div class="main-wrap" :key="$attrs.key || 'alive-router-wrap'">
    <keep-alive>
      <router-view v-if="!$route.meta.hideKeepAliveLayout" ref="content" class="kar-manage" />
    </keep-alive>
    <router-view v-if="$route.meta.hideKeepAliveLayout" ref="content" class="kar-manage" />
  </div>
</template>

<script>
/**
 * 需要包裹到同一个keep-alive的路由组layout，不受最外层app.vue里面的keep-alive干扰
 */
export default {
  name: 'AliveLayouts',
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
  }
}
</script>
