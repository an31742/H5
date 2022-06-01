<template>
  <div class="file-container">
    <a v-for="url in files" :key="url" :href="url" target="_blank"> {{ getFileName(url) }}</a>
  </div>
</template>

<script>
export default {
  name: 'FileList',
  props: {
    files: {
      type: Array,
      default () { return [] }
    }
  },
  data () {
    return {}
  },
  methods: {
    getFileName (url) {
      let name = url
      try {
        const urlObj = new URL(url)
        name = urlObj.searchParams.get('filename') || url
      } catch (e) {}
      return name
    }
  }
}
</script>
<style type="text/css" lang="scss" scoped>
.file-container {
  padding: 0 15px;
  a {
    font-size: 14px;
    display: block;
    overflow: auto;
    white-space: nowrap;
    line-height: 32px;
  }
}
</style>
