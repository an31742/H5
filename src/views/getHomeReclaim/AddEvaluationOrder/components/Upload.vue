<template>
  <div>
    <van-field
      :value="JSON.stringify(fileList)"
      :rules="[{ validator, message: '请上传照片' }]"
      :error="false"
      name="files"
      input-align="right"
      class="fw-field bdn"
      label="上传照片"
      readonly
      required
    >
      <template #input>
        <div></div>
      </template>
    </van-field>
    <upload
      :disabled="false"
      :max="8"
      uploadStyle="padding: 0px;"
      @change="changeFiles"
    ></upload>
  </div>
</template>

<script>
import upload from '@/views/components/upload_form'
export default {
  components: {
    upload
  },
  data () {
    return {
      fileList: []
    }
  },
  methods: {
    changeFiles (files) {
      this.fileList = files.map(i => i.url)
    },
    validator () {
      return this.fileList.length > 0
    }
  }
}
</script>
