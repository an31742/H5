<template>
  <div class="replenish">
    <div class="replenish-cont">
      <div class="replenish-info">
        <p>{{ detail.room_name }}</p>
        <p>申请编号：{{ detail.no }}</p>
      </div>
      <div v-for="(item, index) in detail.cert_list" :key="index">
        <p class="title">{{ item.name }}</p>
        <div class="upload-box">
          <UploadImage
            v-if="item.type === 1"
            ref="upload"
            :max="30"
            :uploadText="item.type === 1 ? '上传图片' : '上传附件'"
            :fileList="item.type === 1 ? item.url : item.path"
            :uploadStyle="'padding: 15px 10px 5px 5px;'"
            @change="(list) => changePictures(list, item)"
          ></UploadImage>
          <UploadFile
            ref="upload"
            v-else
            :accept="'*'"
            :max="30"
            :uploadText="item.type === 1 ? '上传图片' : '上传附件'"
            :fileList="item.type === 1 ? item.url : item.path"
            :uploadStyle="'padding: 15px 10px 5px 5px;'"
            @change="(list) => changePictures(list, item)"
          ></UploadFile>
        </div>
      </div>
    </div>
    <div class="button-box">
      <van-button
        color="#E1AA6C"
        plain
        @click="$router.back()"
      >取消</van-button>
      <van-button color="#E1AA6C" @click="submit">确认</van-button>
    </div>
  </div>
</template>

<script>
import Upload from 'views/components/upload'
import UploadImage from 'views/components/uploadImage'
import UploadFile from 'views/components/uploadFile'
import { applyGet, cfgList, cfgUpdate } from '@/api/decoration'
export default {
  name: 'Replenish',
  components: {
    Upload,
    UploadImage,
    UploadFile
  },
  data () {
    return {
      id: Number(this.$route.query.id),
      detail: {},
      loading: false
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    submit () {
      const data = {
        apply_id: this.id,
        cert_list: {}
      }
      this.detail.cert_list.forEach(e => {
        if (e.type === 1) {
          data.cert_list[e.cert_id] = e.url.map(e => e.url)
        } else {
          data.cert_list[e.cert_id] = e.path.map(e => e.url)
        }
      })
      this.loading = true
      cfgUpdate(data).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.$toast('修改成功')
          this.$router.back()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    getCfgList (data, detail) {
      cfgList(data).then((res) => {
        if (res.code === 200) {
          detail.cert_list.forEach((e) => {
            e.path = (JSON.parse(e.path) || []).map(e => { return { url: e } })
            e.url = (JSON.parse(e.url) || []).map(e => { return { url: e } })
            const tempObj = res.data.List.find((item) => item.id === e.cert_id) || null
            if (tempObj) {
              e.type = tempObj.type
              e.sort = tempObj.sort
              e.required = tempObj.required
            }
          })
          this.detail = detail
        } else {
          this.$toast(res.msg)
        }
      })
    },
    getDetail () {
      applyGet({ id: this.id }).then((res) => {
        if (res.code === 200) {
          const data = {
            apply_type: this.detail.apply_type,
            decoration_identity: this.detail.decoration_identity,
            type: 2,
            apply_id: this.id
          }
          this.getCfgList(data, res.data)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    changePictures (list = [], item) {
      const files = list.map((e) => { return { url: e.url } })
      item.url = files
      item.path = files
    }
  }
}
</script>

<style scoped lang="scss">
.replenish {
  .replenish-cont {
    height: calc(100vh - 64px);
    overflow: scroll;
    .replenish-info {
      padding: 17px 16px;
      box-sizing: border-box;
      background: #fff;
      p {
        &:first-child {
          font-size: 15px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
        &:last-child {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          margin-top: 7px;
        }
      }
    }
    .title {
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      padding: 12px 16px;
      box-sizing: border-box;
    }
  }
  .upload-box {
    padding: 16px;
    box-sizing: border-box;
    background: #fff;
    p {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #cdcdcd;
    }
  }
  .button-box {
    background: #fff;
    position: fixed;
    text-align: center;
    width: 100vw;
    padding: 10px;
    box-sizing: border-box;
    bottom: 0;
    .van-button {
      width: 115px;
      height: 44px;
      border-radius: 6px;
      margin-right: 13px;
    }
  }
}
</style>
