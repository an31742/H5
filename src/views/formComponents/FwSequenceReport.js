import { getSequenceTaskCheckListCommit } from './api'
import Vue from 'vue'
const vue = new Vue()

class FwSequenceReport {
  constructor (item, formModel, commitId) {
    this.item = item
    this.formModel = formModel
    this.commitId = commitId
  }

  getOpts () {
    const options = [
      { code: `${this.item.code}_name`, type: 'FwInput', name: '秩序点名称', required: false, readonly: 1 },
      { code: `${this.item.code}_location_name`, type: 'FwInput', name: '问题点位位置', required: false, readonly: 1 },
      { code: `${this.item.code}_detail`, type: 'FwTextArea', name: '详情描述', required: false, readonly: 0 },
      { code: `${this.item.code}_pictures`, type: 'FwUploadPhoto', name: '上传图片', required: false, readonly: 0 }
    ]
    this.setFormModal()
    return options
  }

  setFormValue (taskInfo, pictures = [], pics = [], description = '') {
    vue.$set(this.formModel, `${this.item.code}_name`, taskInfo.point.name)
    vue.$set(this.formModel, `${this.item.code}_name_desc`, taskInfo.point.name)
    vue.$set(this.formModel, `${this.item.code}_location_name`, taskInfo.location.name)
    vue.$set(this.formModel, `${this.item.code}_location_name_desc`, taskInfo.location.name)
    vue.$set(this.formModel, `${this.item.code}_pictures`, pictures)
    vue.$set(this.formModel, `${this.item.code}_pictures_imgs`, pics)
    vue.$set(this.formModel, `${this.item.code}_detail`, description)
    vue.$set(this.formModel, `${this.item.code}_detail_desc`, description)
  }

  setFormModal () {
    getSequenceTaskCheckListCommit({ id: this.commitId }).then(res => {
      if (res.code === 200) {
        const taskInfo = res.data && res.data.location_point || {}
        const answers = res.data && res.data.answers || []
        const descArr = []
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
              descArr.push(`作业项${descArr.length + 1}:${answer.name}；${answer.answer}；`)
            }
          }
        })
        const description = descArr.join('\n')
        this.setFormValue(taskInfo, pictures, pics, description)
      }
    })
  }
}

export default FwSequenceReport
