<template>
  <div class="monthlt-report-video">
    <video-player
      class="video-player vjs-custom-skin"
      ref="adVideoPlayer"
      :playsinline="playsinline"
      :options="options"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @ended="onPlayerEnded($event)"
      @waiting="onPlayerWaiting($event)"
      @playing="onPlayerPlaying($event)"
      @loadeddata="onPlayerLoadeddata($event)"
      @timeupdate="onPlayerTimeupdate($event)"
      @canplay="onPlayerCanplay($event)"
      @canplaythrough="onPlayerCanplaythrough($event)"
      @statechanged="playerStateChanged($event)"
      @ready="playerReadied"
    >
    </video-player>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    poster: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      options: {
        playbackRates: [0.5, 1.0, 1.5, 2.0, 3.0], // 可选的播放速度
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        loop: true, // 是否开启循环播放
        // techOrder: ['flash', 'html5'], // 兼容顺序
        // flash: { hls: { withCredentials: false } },
        // html5: { hls: { withCredentials: false } },
        // sourceOrder: true,
        controls: true, // 是否显示控制栏
        preload: 'auto', // 自动预加载
        language: 'zh-CN', // 语言，'en', 'zh-cn', 'zh-tw'
        aspectRatio: '16:9', // 播放器高宽占比（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4', // 类型
            src: ''
          }
        ],
        poster: '',
        // 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1606462956126&di=2d87964d4faf656af55d09d938640d97&imgtype=0&src=http%3A%2F%2Fattachments.gfan.com%2Fforum%2Fattachments2%2F201310%2F10%2F150326y7dzdd8d4kpjjdsd.jpg', // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 是否显示当前时间和持续时间的分隔符，"/"
          durationDisplay: true, // 是否显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间
          fullscreenToggle: true // 是否显示全屏按钮
        }
      }
    }
  },
  created () {
    this.options.sources[0].src = this.url
    this.options.poster = this.poster
  },
  computed: {
    player () {
      return this.$refs.adVideoPlayer.player
    },
    playsinline () {
      const ua = navigator.userAgent.toLocaleLowerCase()
      if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
        return false
      } else {
        return true
      }
    }

  },
  mounted () {
    this.$nextTick(() => {
      if (this.$refs.adVideoPlayer && this.$refs.adVideoPlayer.$el) {
        const videoDom = this.$refs.adVideoPlayer.$el.children[0].children[0]
        videoDom.setAttribute('x-webkit-airplay', 'allow')
        videoDom.setAttribute('x5-video-player-type', 'h5')
      }
      // videoDom.setAttribute('x5-video-player-fullscreen', true)
    })
  },
  methods: {
    setCurrentTime (val) {
      this.player.currentTime(val)
    },
    play () {
      return this.player.play()
    },
    pause () {
      this.player.pause()
    },
    onplayerError () {
      this.$emit('error')
    },

    // 播放回调
    onPlayerPlay ($event) {
      console.log('player play!', $event)
    },
    // 暂停回调
    onPlayerPause ($event) {
      console.log('player pause!', $event)
    },
    // 视频播完回调
    onPlayerEnded ($event) {
      console.log($event)
      this.player.initChildren()
      this.player.currentTime(0)
    },
    // DOM元素上的readyState更改导致播放停止
    onPlayerWaiting ($event) {
      // console.log($event)
    },
    // 已开始播放回调
    onPlayerPlaying ($event) {
      // console.log($event)
    },
    // 当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata ($event) {
      console.log($event)
    },
    // 当前播放位置发生变化时触发。
    onPlayerTimeupdate ($event) {
      // console.log($event)
    },
    // 媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay ($event) {
      // console.log('player Canplay!', player)
      this.$emit('canplay')
    },
    // 媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    onPlayerCanplaythrough ($event) {
      // console.log('player Canplaythrough!', player)
      this.$emit('canplay')
    },
    // 播放状态改变回调
    playerStateChanged ($event) {
      // console.log('player current update state', $event)
    },
    // 将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied () {
      console.log('example player 1 readied')
    }
  },
  components: {
    videoPlayer
  }
}
</script>

<style lang="less" scoped>

.border-1px-bottom {
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 10px;
    transform: scaleY(0.1);
    background: #EDEDED;
  }
}

.border-1px-top {
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    transform: scaleY(0.1);
    background: #EDEDED;
  }
}
@deep: ~'>>>';
.monthlt-report-video {
  position: relative;
  overflow: hidden;
  width: 100%;
  z-index: 0;
  @{deep} .vjs_video_3-dimensions {
    width: 100%;
  }
  @{deep} .video-js {
    width: 100%;
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }
  @{deep} .vjs-fluid {
    // background-color: #ffffff !important;
  }
  @{deep} .vjs-tech {
    position: absolute;
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }
  @{deep} .video-js .vjs-big-play-button {
    display: none;
  }
}
@{deep} .vjs-control-bar {
  display: none;
}

// @{deep} .vjs-error-display {
//   display: none;
// }
</style>
<style lang="less" scoped>
.video-js .vjs-volume-panel .vjs-icon-placeholder::before  {
  display: none;
}
.video-js .vjs-slider .vjs-slider-bar::before {
  content: '';
}
.vjs-play-control .vjs-icon-placeholder::before {
  display: none;
}
.vjs-fullscreen-control .vjs-icon-placeholder::before {
  display: none;
}
.video-js .vjs-control-bar .vjs-progress-control {
  display: none;
}
.video-js .vjs-progress-holder{
  display: none;
}
// .vjs-poster {
//   background-color: #fff;
//   border: 2px solid #fff;
// }
</style>
