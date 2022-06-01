<template>
  <input type="text" />
</template>

<script>
export default {
  name: 'Input',
  created () {
    console.log('input time', new Date().getMilliseconds())
  }
}
</script>

<style scoped>

</style>
