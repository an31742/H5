<template>
  <DescArea>
    <div class="linkUsers">
      <personItem :person="fromUser"></personItem>
      <span>添加评论</span>
      <OptInfo :item="item"></OptInfo>
    </div>
    <div class="linkUsers">
      <span>通知</span>
      <personItem v-for="noticePerson in noticeTo" :key="noticePerson.id" :person="noticePerson" placement="top"></personItem>
    </div>
    <div v-if="item.extra.content" class="detail">
      评论内容：{{ item.extra.content }}
    </div>
    <div v-if="attach&&attach.length>0" class="fileList">
      <span direction="vertical">
        <a
          v-for="file in attach"
          :key="file"
          style="word-break: break-all;"
          href="javascript:;"
          @click="previewAttach(file)"
        >
          {{ getFileName(file) }}
        </a>
      </span>
    </div>

    <!--图片预览-->
    <van-image-preview
      v-model="showPreview"
      :images="previewImages"
      :closeable="true"
    >
    </van-image-preview>
  </DescArea>
</template>

<script>
import PersonItem from './PersonItem'
import DescArea from './DescArea'
import OptInfo from './OptInfo'

export default {
  name: 'NodeComment',
  components: {
    PersonItem,
    DescArea,
    OptInfo
  },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showPreview: false,
      previewImages: []
    }
  },
  computed: {
    fromUser () {
      return this.item.extra.from_user
    },
    noticeTo () {
      return this.item.extra.notice_to
    },
    attach () {
      return this.item.extra.attach
    }
  },
  methods: {
    getFileName (fileUrl) {
      return new URL(fileUrl).searchParams.get('filename') || fileUrl
    },
    previewAttach (file) {
      const imgs = ['jpg', 'jpeg', 'png', 'gif']
      const ext = file.substr(file.lastIndexOf('.') + 1)
      if (imgs.indexOf(ext) > -1) {
        this.previewImages = [file]
        this.showPreview = true
      } else {
        this.$toast('请前往PC端查看')
      }
    }
  }
}
</script>
