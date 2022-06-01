<template>
  <div v-if="imageArray && imageArray.length" class="fw-image">
    <div class="title">{{ formLabel(opt) }}:</div>

    <div class="images">
      <van-image
        v-for="(img, index) in imageArray"
        :key="index"
        :src="img.url || img.orgUrl || img"
        lazy-load
        fit="cover"
        @click="previewImage(index)"
      ></van-image>
    </div>

    <van-image-preview
      v-model="showPreview"
      :images="previewImages"
      :startPosition="previewIndex"
      :get-container="getBodyContainer"
      @change="(num) => previewIndex = num"
    ></van-image-preview>
  </div>
</template>

<script>
import mixin from '../mixin'

export default {
  name: 'FwImagesView',
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
      previewIndex: 0,
      showPreview: false
    }
  },
  computed: {
    imageArray () {
      if (this.model[this.opt.code + '_imgs']) {
        return this.model[this.opt.code + '_imgs'] || []
      }

      if (this.model[this.opt.code + '_img']) {
        return [{ url: this.model[this.opt.code + '_img'] }]
      }

      return []
    },
    previewImages () {
      return this.imageArray.map(img => img.url || img.orgUrl || img)
    }
  },
  methods: {
    // 图片预览
    previewImage (index) {
      this.previewIndex = index
      this.showPreview = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .fw-image {
    ::v-deep .images {
      margin-right: -9px;
      .van-image {
        width: 80px;
        height: 80px;
        padding-right: 8px;
        padding-top: 8px;
        img {
          border-radius: 2px;
          border: 1px solid #FAFAFA;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
