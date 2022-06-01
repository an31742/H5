function Draw (canvas, degree, config = {}) {
  if (!canvas) { return }

  if (!(this instanceof Draw)) {
    return new Draw(canvas, config)
  }

  let { width, height } = window.getComputedStyle(config.parent || canvas, null)
  width = width.replace('px', '')
  height = height.replace('px', '')

  this.context = canvas.getContext('2d')
  this.isCrop = config.isCrop || false // 是否裁剪
  this.canvasHistory = []
  this.canvas = canvas
  this.config = config
  this.width = width
  this.height = height
  this.hasDrew = false // 判断画布上是否有画线
  const context = this.context

  // 根据设备像素比优化canvas绘图
  const devicePixelRatio = window.devicePixelRatio
  if (devicePixelRatio) {
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.height = height * devicePixelRatio
    canvas.width = width * devicePixelRatio
    context.scale(devicePixelRatio, devicePixelRatio)
  } else {
    canvas.width = width
    canvas.height = height
  }

  context.lineWidth = config.lineWidth || 2
  context.strokeStyle = config.strokeStyle || 'black'
  context.lineCap = config.lineCap || 'round'
  context.lineJoin = config.lineJoin || 'round'
  Object.assign(context, config)

  const point = {}
  const { left, top } = canvas.getBoundingClientRect()
  const isMobile = /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent)
  // 移动端性能太弱, 去掉模糊以提高手写渲染速度
  if (!isMobile) {
    context.shadowBlur = 1
    context.shadowColor = 'black'
  }

  let pressed = false

  const paint = (signal) => {
    switch (signal) {
      case 1:
        context.beginPath()
        context.moveTo(point.x, point.y)
        this.canvasHistory.push(canvas.toDataURL())
        break
      case 2:
        context.lineTo(point.x, point.y)
        context.stroke()
        break
      default:
    }
  }
  const create = signal => (e) => {
    e.preventDefault()
    if (signal === 1) {
      pressed = true
      this.hasDrew = true
    }
    if (signal === 1 || pressed) {
      e = isMobile ? e.touches[0] : e
      point.x = e.clientX - left
      point.y = e.clientY - top
      paint(signal)
    }
  }

  const start = create(1)
  const move = create(2)
  const requestAnimationFrame = window.requestAnimationFrame
  const optimizedMove = requestAnimationFrame ? (e) => {
    requestAnimationFrame(() => {
      move(e)
    })
  } : move

  // 添加对应事件
  if (isMobile) {
    canvas.addEventListener('touchstart', start)
    canvas.addEventListener('touchmove', optimizedMove)
  } else {
    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mousemove', optimizedMove);
    ['mouseup', 'mouseleave'].forEach((event) => {
      canvas.addEventListener(event, () => {
        pressed = false
      })
    })
  }

  // 重置画布坐标系
  if (typeof degree === 'number') {
    this.degree = degree
    context.rotate((degree * Math.PI) / 180)
    switch (degree) {
      case -90:
        context.translate(-height, 0)
        break
      case 90:
        context.translate(0, -width)
        break
      case -180:
      case 180:
        context.translate(-width, -height)
        break
      default:
    }
  }
}

Draw.prototype = {
  // 回退
  unDo () {
    const forward = this.canvasHistory.pop()

    if (forward) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const ratio = window.devicePixelRatio || 1
      const canvasPic = new Image()
      canvasPic.src = forward

      canvasPic.addEventListener('load', () => {
        this.context.drawImage(canvasPic, 0, 0, this.canvas.width / ratio, this.canvas.height / ratio)
      })
    }
  },

  // 缩放
  scale (width, height, canvas = this.canvas) {
    const w = canvas.width
    const h = canvas.height
    width = width || w
    height = height || h
    if (width !== w || height !== h) {
      const tmpCanvas = document.createElement('canvas')
      const tmpContext = tmpCanvas.getContext('2d')
      tmpCanvas.width = width
      tmpCanvas.height = height
      tmpContext.drawImage(canvas, 0, 0, w, h, 0, 0, width, height)
      canvas = tmpCanvas
    }

    return canvas
  },

  // 旋转
  rotate (degree, image = this.canvas) {
    degree = ~~degree
    if (degree !== 0) {
      const maxDegree = 180
      const minDegree = -90
      if (degree > maxDegree) {
        degree = maxDegree
      } else if (degree < minDegree) {
        degree = minDegree
      }

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const height = image.height
      const width = image.width
      const degreePI = (degree * Math.PI) / 180

      switch (degree) {
        // 逆时针旋转90°
        case -90:
          canvas.width = height
          canvas.height = width
          context.rotate(degreePI)
          context.drawImage(image, -width, 0)
          break
        // 顺时针旋转90°
        case 90:
          canvas.width = height
          canvas.height = width
          context.rotate(degreePI)
          context.drawImage(image, 0, -height)
          break
        // 顺时针旋转180°
        case 180:
          canvas.width = width
          canvas.height = height
          context.rotate(degreePI)
          context.drawImage(image, -width, -height)
          break
        default:
      }
      image = canvas
    }
    return image
  },

  // 判断画布是否为空白
  isBlank () {
    return !this.hasDrew
  },

  // 保存成png图片
  getPNGImage (canvas = this.canvas) {
    return this.saveImage(canvas, { format: 'image/png' })
  },

  // 保存成jpg图片
  getJPGImage (canvas = this.canvas) {
    return this.saveImage(canvas, { format: 'image/jpeg', quality: 0.5 })
  },

  // 保存图片
  saveImage (canvas, opt) {
    if (!this.hasDrew) { return '' }

    const resImgData = this.context.getImageData(0, 0, canvas.width, canvas.height)
    this.context.globalCompositeOperation = 'destination-over'
    this.context.fillStyle = '#fff'
    this.context.fillRect(0, 0, canvas.width, canvas.height)
    let resultImg = canvas.toDataURL(opt.format, opt.quality)

    this.context.clearRect(0, 0, canvas.width, canvas.height)
    this.context.putImageData(resImgData, 0, 0)
    this.context.globalCompositeOperation = 'source-over'

    // 如果需要裁剪图形
    if (this.isCrop) {
      const cropArea = this.getCropArea(resImgData.data)
      let cropCanvas = document.createElement('canvas')
      const cropCtx = cropCanvas.getContext('2d')

      cropCanvas.width = cropArea[2] - cropArea[0]
      cropCanvas.height = cropArea[3] - cropArea[1]

      const cropImgData = this.context.getImageData(...cropArea)

      cropCtx.globalCompositeOperation = 'destination-over'
      cropCtx.putImageData(cropImgData, 0, 0)
      cropCtx.fillStyle = '#fff'
      cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height)

      resultImg = cropCanvas.toDataURL(opt.format, opt.quality)
      cropCanvas = null
    }

    return resultImg
  },

  // 下载png图片
  downloadPNGImage (image) {
    const url = image.replace('image/png', 'image/octet-stream;Content-Disposition:attachment;filename=test.png')
    window.location.href = url
  },

  // 转成二进制
  dataURLtoBlob (dataURL) {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bStr = atob(arr[1])
    let n = bStr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bStr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  },

  // 清空
  clear () {
    let width
    let height
    switch (this.degree) {
      case -90:
      case 90:
        width = this.height
        height = this.width
        break
      default:
        width = this.width
        height = this.height
    }
    this.context.clearRect(0, 0, width, height)

    this.hasDrew = false // 重置标识
    this.canvasHistory = [] // 重置历史
  },

  // 获取操作的区域
  getCropArea (imgData) {
    let topX = this.canvas.width
    let topY = this.canvas.height
    let btmX = 0
    let btnY = 0

    for (let i = 0; i < this.canvas.width; i++) {
      for (let j = 0; j < this.canvas.height; j++) {
        const pos = (i + this.canvas.width * j) * 4
        if (imgData[pos] > 0 || imgData[pos + 1] > 0 || imgData[pos + 2] || imgData[pos + 3] > 0) {
          btnY = Math.max(j, btnY)
          btmX = Math.max(i, btmX)
          topY = Math.min(j, topY)
          topX = Math.min(i, topX)
        }
      }
    }

    return [++topX, ++topY, ++btmX, ++btnY]
  }
}

export default Draw
