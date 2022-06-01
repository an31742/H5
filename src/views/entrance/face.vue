<template>
  <div class="fw-container  --weui-BG-2">

    <div v-if="isShow" class="camera-layer">
      <div v-if="base64Img" class="img-box">
        <img :src="base64Img" />
      </div>
      <div v-else style="text-align:center">
        <img style="width:320px;margin:50px auto 15px" :src="require('@/assets/image/face_default1.png')" />
        <p>
          请录入人脸
        </p>
      </div>
      <div
        class="camera-bottom"
        style="flex-direction: column;"
      >
        <button
          type="button"
          style="width: 308px"
          class="button  button-yellow"
          @click="next()"
        >
          {{ base64Img?'重新录入':'开始录入' }}
        </button>
        <a
          v-if="userData.is_admin"
          class="linkbtn"
          href="javascript:;"
          @click="selectUser"
        > 为员工录入></a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import { miniSecretInfo, miniSecretOperateStatistics } from '@/api/entrance'
import { Dialog } from 'vant'
export default {
  name: 'Face',
  props: {
    isInGroup: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dayjs,
      isShow: false,
      base64Img: '',
      file: ''
    }
  },
  computed: {
    ...mapGetters([ 'userData' ])
  },
  async mounted () {
    this.$emit('loading', true)
    const res = await miniSecretInfo({
      'staff_id': this.userData.id,
      'code_type': 4
    })
    this.isShow = true
    if (res.code === 200) {
      if (res.data.secret_data) {
        this.base64Img = res.data.secret_data.face_image_url
      }
    } else {

    }
    this.$emit('loading', false)
  },
  methods: {
    async next () {
      const maxCount = 3

      if (!this.isInGroup) {
        Dialog.alert({
          title: '人脸录入权限',
          message: '您不是该项目员工无法录入人脸',
          confirmButtonText: '知道了',
          theme: 'round-button',
          confirmButtonColor: '#E1AA6C'
        }).then(() => {
          // on close
          this.$router.push({
            name: 'WorkBench'
          })
        })

        return
      }

      // 最近三个月的次数
      const res = await miniSecretOperateStatistics({})
      console.log(res)

      if (res.code !== 200) {
        this.$toast(res.msg)
        return
      }

      if (res.data.count >= maxCount) {
        this.$toast('您暂无录入人脸次数')
        return
      }

      try {
        const count = maxCount - res.data.count
        await this.$confirm({ title: '提示',
          message: `您还有${count}次录入,请谨慎使用`,
          closeOnPopstate: true })

        const item = {
          id: this.userData.id,
          name: this.userData.name
        }
        this.$router.push({
          name: 'entranceFaceEdit',
          query: {
            id: item.id,
            name: encodeURIComponent(item.name)
          }
        })
      } catch (error) {

      }
    },
    selectUser () {
      this.$router.push({
        name: 'entranceFaceSelectUser'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fw-container{
  background-color: #fff;
  height: calc(100% - 40px);
}
::v-deep .camera-layer {
    display: flex;
    flex-direction: column;

    justify-content: space-between;
    width: 100vw;
    height: calc(100vh - 40px);

    .img-box {
      max-width: 100%;
      height: calc(100vh - 40px);
      flex: 1;
      overflow-y: scroll;
      img {
        display: block;
        width: 100%;

        margin: 0 auto;
      }
    }
    .camera-bottom {
      // position: fixed;
      // bottom: 0;
      // left: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: 25px 37px;
      background: #fff;
      color: #fff;

      .linkbtn{
        font-size: 17px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #BC8D58;
        line-height: 24px;
        margin-top:25px;
      }

      .button {
        display: block;
        width: 141px;
        height: 40px;
        border-radius: 20px;
        border: 1px solid #E1AA6C;;
         color: #E1AA6C;
        background: #fff;
        &.button-yellow {
          border: none;
          color: #fff;
          background: linear-gradient(175deg, #F2D5A5 0%, #E1AA6C 100%);
        }
      }
    }
}

.entry-face-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  box-sizing: border-box;
  padding: 28px 29px 0;
  background: #fff;
  .face-box {
    flex: 1;
  }
  .info {
    font-size: 14px;
    .text {
      height: 20px;
      font-size: 14px;
      color: #999;
      line-height: 20px;
      margin: 16px 0 0;
    }
    .content {
      color: #333;
      height: auto;
      overflow: auto;
      margin: 7px 0 0;
      p {
        margin: 8px 0 0;
      }
    }
  }
}
.box {
  display: flex;
  height: 70px;
  padding: 25px 20px;
  line-height: 70px;
  font-size: 15px;
  color: rgba(102, 102, 102, 1);
  border-bottom: 1px solid rgba(29, 29, 31, 0.2);
  .icon {
    width: 70px;
    height: 70px;
  }
}
.launch-camera {
  position: fixed;
  left: 0;
  bottom: 0;
  display: block;
  width: 300px;
  height: 40px;
  margin: 20px 38px;
}
.start {
  display: block;
  width: 300px;
  height: 40px;
  background: linear-gradient(86deg, #F2D5A5 0%, #E1AA6C 100%);
  border-radius: 20px;
  border: none;
  color: #fff;
}
</style>
