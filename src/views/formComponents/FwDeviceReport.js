import { getDeviceTaskCheckListCommit } from './api'
import Vue from 'vue'
import { minipDeviceRecordGet } from '../../api/task'
const vue = new Vue()

class FwDeviceReport {
  constructor (item, formModel, commitId, deviceId, type) {
    this.item = item
    this.formModel = formModel
    this.commitId = commitId
    this.deviceId = deviceId
    this.type = type
  }

  getOpts () {
    const options = [
      { code: `${this.item.code}_code`, type: 'FwInpuQrcode', name: '故障设备编号', required: false, readonly: 0, originalCode: this.item.code },
      { code: `${this.item.code}_name`, type: 'FwInput', name: '故障设备名称', required: false, readonly: 0 },
      { code: `${this.item.code}_location_name`, type: 'FwInput', name: '故障设备位置', required: false, readonly: 0 },
      { code: `${this.item.code}_detail`, type: 'FwTextArea', name: '详情描述', required: false, readonly: 0 },
      { code: `${this.item.code}_pictures`, type: 'FwUploadPhoto', name: '上传图片', required: false, readonly: 0 }
    ]
    this.setFormModal()
    return options
  }

  setFormValue (deviceInfo, pictures = [], pics = [], description = '') {
    vue.$set(this.formModel, `${this.item.code}_code`, deviceInfo.code)
    vue.$set(this.formModel, `${this.item.code}_code_desc`, deviceInfo.code)
    vue.$set(this.formModel, `${this.item.code}_name`, deviceInfo.name)
    vue.$set(this.formModel, `${this.item.code}_name_desc`, deviceInfo.name)
    vue.$set(this.formModel, `${this.item.code}_location_name`, deviceInfo.location_name)
    vue.$set(this.formModel, `${this.item.code}_location_name_desc`, deviceInfo.location_name)
    vue.$set(this.formModel, `${this.item.code}_pictures`, pictures)
    vue.$set(this.formModel, `${this.item.code}_pictures_imgs`, pics)
    vue.$set(this.formModel, `${this.item.code}_detail`, description)
    vue.$set(this.formModel, `${this.item.code}_detail_desc`, description)
  }

  setFormModal () {
    if (this.commitId) {
      getDeviceTaskCheckListCommit({ id: this.commitId }).then(res => {
        if (res.code === 200) {
          const deviceInfo = res.data && res.data.device || {}
          const answers = res.data.answers || []
          const descArr = []
          const task = res.data.task
          let pictures = []
          let pics = []
          answers.map(answer => {
            // 图片形式
            if (answer.type === 6) {
              try {
                pictures = JSON.parse(answer.answer)
                pics = pictures.map(item => {
                  return {
                    url: item,
                    name: item,
                    status: 'done'
                  }
                })
              } catch (e) {}
            } else {
              // 数组形式
              if (answer.type === 5) {
                try { answer.answer = JSON.parse(answer.answer).join('、') } catch (e) {}
              }
              if (answer.is_right === 0) {
                descArr.push(`${task.type === 1 ? '巡检项' : '保养项'}${descArr.length + 1}:${answer.name}；${answer.answer}；`)
              }
            }
          })
          const description = descArr.join('\n')
          this.setFormValue(deviceInfo, pictures, pics, description)
        }
      })
    } else if (this.deviceId) {
      minipDeviceRecordGet({ id: this.deviceId }).then(res => {
        if (res.code === 200) {
          const deviceInfo = res.data || {}
          let description = ''
          // type为4的时候是二维码
          if (this.type === 4) {
            description = '设备二维码损坏'
          }
          this.setFormValue(deviceInfo, undefined, undefined, description)
        }
      })
    }
  }
}

export default FwDeviceReport
