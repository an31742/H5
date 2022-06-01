<template>
  <div class="main-wrap">
    <keep-alive>
      <router-view ref="content" class="kar-detail" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'DetailLayouts',
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
  }
}
</script>
