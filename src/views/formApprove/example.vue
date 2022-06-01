<template>
  <div>
    <van-form ref="form" validate-first scroll-to-error @submit="handleSubmit">
      <fc ref="fc" :model="formModel" :options="options" />
    </van-form>

    <div class="fw-btm-wrap btn">
      <van-button size="large round" type="primary" @click="$refs.form.submit()">确定</van-button>
    </div>
  </div>
</template>

<script>
import fc from './index'

// 注意：不能在van-from上加上 :show-error-message="false" ，因为有些校验需要提示具体的错误信息，比如'请输入正确的手机号'
export default {
  name: 'FromComponentsExample',
  components: { fc },
  data () {
    return {
      formModel: {},
      // formModel: {
      //   'INPUT_ANY': '2020-01-11',
      //   'DATE': '2020-01-11',
      //   'DATE_desc': '2020-01-11',
      //   'DATETIME': '2021-01-11 16:31:00',
      //   'DATETIME_desc': '2021-01-11 16:31:00',
      //   'RANGEPICKER_start_time': '2020-01-11 11:12:00',
      //   'RANGEPICKER_start_time_desc': '2020-01-11 11:12:00',
      //   'RANGEPICKER_desc': '2020-01-11 11:12:00 ~ 2020-03-11 16:13:00',
      //   'RANGEPICKER_end_time': '2020-03-11 16:13:00',
      //   'RANGEPICKER_end_time_desc': '2020-03-11 16:13:00',
      //   'RANGEPICKER': [
      //     '2020-01-11 11:12:00',
      //     '2020-03-11 16:13:00'
      //   ],
      //   'LINKTEMPLATE': [
      //     70,
      //     73
      //   ],
      //   'LINKTEMPLATE_desc': '70,73',
      //   'LINKSTAFF': [
      //     229,
      //     1484
      //   ],
      //   'LINKSTAFF_desc': 'wangwu,jiajia',
      //   'LINKORGANIZE': [
      //     1,
      //     2
      //   ],
      //   'LINKORGANIZE_desc': '华东事业部,华北事业部',
      //   'INPUT_ANY_desc': '2020-01-11',
      //   'RADIO': 2,
      //   'RADIO_desc': '选项2',
      //   'CHECKBOX': [
      //     1,
      //     2
      //   ],
      //   'CHECKBOX_desc': '选项1，选项2',
      //   'SELECT': 2,
      //   'SELECT_desc': '下拉选项2',
      //   'MONEY': 310,
      //   'MONEY_desc': '叁元壹角',
      //   'UPLOADIMAGE': [
      //     'https://pms-static.gmtech.top/pubsrv/2020122/ba62b535-3478-11eb-a389-5254000429c2.jpg?imageMogr2/thumbnail/!50p&filename=222.jpg',
      //     'https://pms-static.gmtech.top/pubsrv/2021118/6805728c-598f-11eb-bfc8-5254000429c2.jpg?imageMogr2/thumbnail/!50p&filename=555.jpg'
      //   ],
      //   'UPLOADIMAGE_imgs': [
      //     {
      //       'url': 'https://pms-static.gmtech.top/pubsrv/2020122/ba62b535-3478-11eb-a389-5254000429c2.jpg?imageMogr2/thumbnail/!50p&filename=222.jpg',
      //       'name': '222.jpg',
      //       'status': 'done',
      //       'orgUrl': 'https://pms-static.gmtech.top/pubsrv/2020122/ba62b535-3478-11eb-a389-5254000429c2.jpg?imageMogr2/thumbnail/!50p&filename=222.jpg'
      //     },
      //     {
      //       'status': 'done',
      //       'name': '555.jpg',
      //       'orgUrl': 'https://pms-static.gmtech.top/pubsrv/2021118/6805728c-598f-11eb-bfc8-5254000429c2.jpg?filename=555.jpg',
      //       'url': 'https://pms-static.gmtech.top/pubsrv/2021118/6805728c-598f-11eb-bfc8-5254000429c2.jpg?imageMogr2/thumbnail/!50p&filename=555.jpg'
      //     }
      //   ],
      //   'UPLOADFILE': [
      //     'https://pms-static.gmtech.top/pubsrv/2020122/ba62b535-3478-11eb-a389-5254000429c2.jpg?imageMogr2/thumbnail/!50p&filename=222.jpg',
      //     'https://pms-static.gmtech.top/pubsrv/2021118/7127be9f-598f-11eb-bfc8-5254000429c2.txt?filename=db.txt'
      //   ],
      //   'UPLOADFILE_files': [
      //     {
      //       'url': 'https://pms-static.gmtech.top/pubsrv/2020122/ba62b535-3478-11eb-a389-5254000429c2.jpg?imageMogr2/thumbnail/!50p&filename=222.jpg',
      //       'name': '222.jpg',
      //       'status': 'done',
      //       'orgUrl': 'https://pms-static.gmtech.top/pubsrv/2020122/ba62b535-3478-11eb-a389-5254000429c2.jpg?imageMogr2/thumbnail/!50p&filename=222.jpg'
      //     },
      //     {
      //       'url': 'https://pms-static.gmtech.top/pubsrv/2021118/7127be9f-598f-11eb-bfc8-5254000429c2.txt?filename=db.txt',
      //       'name': 'db.txt',
      //       'status': 'done',
      //       'orgUrl': 'https://pms-static.gmtech.top/pubsrv/2021118/7127be9f-598f-11eb-bfc8-5254000429c2.txt?filename=db.txt'
      //     }
      //   ],
      //   'LOCATION': [
      //     110000,
      //     110100,
      //     110106
      //   ],
      //   'LOCATION_desc': '北京市北京市丰台区',
      //   'TEXT_AREA_ANY': '金沙岛卡萨离开家打卡时间',
      //   'TEXT_AREA_ANY_desc': '金沙岛卡萨离开家打卡时间',
      //   'POSITION_SELECT': {
      //     'lonlat': [
      //       '116.406994',
      //       '39.904595'
      //     ],
      //     'city': '北京市',
      //     'address': '北京市东城区东华门街道正义路北京市人民政府(旧址)'
      //   },
      //   'POSITION_SELECT_desc': '北京市东城区东华门街道正义路北京市人民政府(旧址)'
      // },
      options: []
    }
  },
  created () {
    this.getOptions()
  },
  methods: {
    // 表单提交
    async handleSubmit (res) {
      console.log('--------------------------------')
      console.log(this.formModel)
      console.log('--------------------------------')
    },
    // 获取配置项
    getOptions () {
      // 这里需要从接口获取 && 处理数据的时候需要加 user_id
      this.options = [
        // 单行文本
        { code: 'INPUT_ANY', type: 'FormInput', name: '单行文本-任意字符', required: true, readonly: 0, props: { validate: '' } },
        // { code: 'INPUT_NUMBER', type: 'FormInput', name: '单行文本-数字', required: true, readonly: 0, value: '123', props: { validate: 'number', max: 10, min: 2, extra: '数字' } },
        // { code: 'INPUT_WORD', type: 'FormInput', name: '单行文本-字母', required: true, readonly: 0, value: 'abc', props: { validate: 'letter', max: 10, min: 2, extra: '字母' } },
        // { code: 'INPUT_HAN', type: 'FormInput', name: '单行文本-汉字', required: true, readonly: 0, value: '汉字', props: { validate: 'chinese', max: 10, min: 0, extra: '汉字' } },
        // { code: 'INPUT_TEL', type: 'FormInput', name: '单行文本-手机号', required: true, readonly: 0, value: '13899998888', props: { validate: 'phone', max: 11, min: 11, extra: '手机号' } },
        // { code: 'INPUT_ID', type: 'FormInput', name: '单行文本-身份证', required: true, readonly: 0, value: '123456789012345678', props: { validate: 'nationalId', max: 18, min: 15, extra: '身份证' } },
        // 多行文本
        { code: 'TEXT_AREA_ANY', type: 'FormTextArea', name: '多行文本-任意字符', required: true, readonly: 0, props: { validate: '' } },
        // { code: 'TEXT_AREA_NUMBER', type: 'FormTextArea', name: '多行文本-数字', required: true, readonly: 0, value: '123', props: { validate: 'number', max: 10, min: 2, extra: '数字' } },
        // { code: 'TEXT_AREA_WORD', type: 'FormTextArea', name: '多行文本-字母', required: true, readonly: 0, value: 'abc', props: { validate: 'letter', max: 10, min: 2, extra: '字母' } },
        // { code: 'TEXT_AREA_HAN', type: 'FormTextArea', name: '多行文本-汉字', required: true, readonly: 0, value: '汉字', props: { validate: 'chinese', max: 10, min: 0, extra: '汉字' } },
        // { code: 'TEXT_AREA_TEL', type: 'FormTextArea', name: '多行文本-手机号', required: true, readonly: 0, value: '13899998888', props: { validate: 'phone', max: 11, min: 11, extra: '手机号' } },
        // { code: 'TEXT_AREA_ID', type: 'FormTextArea', name: '多行文本-身份证', required: true, readonly: 0, value: '123456789012345678', props: { validate: 'nationalId', max: 18, min: 15, extra: '身份证' } },
        // 单选
        { code: 'RADIO', type: 'FormRadioBox', name: '单选', required: true, readonly: 0, value: 1, props: { extra: '这是单选的说明', options: [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }, { label: '选项3', value: 3 }] } },
        // 多选
        { code: 'CHECKBOX', type: 'FormCheckbox', name: '多选', required: true, readonly: 0, value: [1], props: { max: 3, min: 2, extra: '这是多选的说明', options: [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }, { label: '选项3', value: 3 }, { label: '选项4', value: 4 }] } },
        // 下拉
        { code: 'SELECT', type: 'FormSelect', name: '下拉', required: true, readonly: 0, value: 1, props: { extra: '这是下拉的说明', options: [{ label: '下拉选项1', value: 1 }, { label: '下拉选项2', value: 2 }, { label: '下拉选项3', value: 3 }, { label: '下拉选项4', value: 4 }] } },
        // 金额（元）
        { code: 'MONEY', type: 'FormMoney', name: '金额（元）', required: true, readonly: 0, value: 1, props: { extra: '这是金额的说明', min: 0.1, max: 9999.9, unit: '元', showRMB: true } },
        // 金额（万元）
        // { code: 'MONEYWAN', type: 'FormMoney', name: '金额（万元）', required: true, readonly: 0, value: 3, props: { extra: '这是金额的说明', min: 3, max: 19999.9, unit: '万元', showRMB: true } },
        // 省市区
        { code: 'LOCATION', type: 'FormLocation', name: '省市区', required: true, readonly: 0, value: [110000, 110100, 110106], props: { extra: '这是省市区的说明', current: true } },
        // 地理位置（获取当前）
        // { code: 'POSITION_CURRENT', type: 'FormPosition', name: '地理位置（获取当前）', required: true, readonly: 0, value: [110000, 110100, 110106], props: { extra: '这是地理位置（获取当前）的说明', dataSource: 1 } },
        // 地理位置（手动选点）
        { code: 'POSITION_SELECT', type: 'FormPosition', name: '地理位置（手动选点）', required: true, readonly: 0, value: [110000, 110100, 110106], props: { extra: '这是地理位置（手动选点）的说明', dataSource: 0 } },
        // 日期
        { code: 'DATE', type: 'FormDatetime', name: '日期', required: true, readonly: 0, value: '2020-02-04 11:12:13', props: { extra: '这是日期的说明', showTime: false, current: false } },
        // 日期时间
        { code: 'DATETIME', type: 'FormDatetime', name: '日期时间', required: true, readonly: 0, value: '2020-01-03 11:12:13', props: { extra: '这是日期时间的说明', showTime: true, current: true } },
        // 日期时间区间
        { code: 'RANGEPICKER', type: 'FormRangePicker', name: '日期区间', required: true, readonly: 0, value: ['2020-01-03 11:12:13', '2020-03-05 16:13:13'], props: { extra: '这是日期区间的说明', showTime: true } },
        // 图片
        { code: 'UPLOADIMAGE', type: 'FormUploadImage', name: '图片', required: true, readonly: 0, value: ['https://pms-static.gmtech.top/pubsrv/2020122/ba62b535-3478-11eb-a389-5254000429c2.jpg?imageMogr2/thumbnail/!50p&filename=222.jpg'], props: { extra: '这是图片的说明', min: 2, max: 6 } },
        // 附件
        { code: 'UPLOADFILE', type: 'FormUploadFile', name: '附件', required: true, readonly: 0, value: ['https://pms-static.gmtech.top/pubsrv/2020122/ba62b535-3478-11eb-a389-5254000429c2.jpg?imageMogr2/thumbnail/!50p&filename=222.jpg'], props: { extra: '这是附件的说明', min: 2, max: 6 } },
        // 关联审批单
        { code: 'LINKTEMPLATE', type: 'FormProceduleSelect', name: '选择审批单', required: true, readonly: 0, value: [70, 73], props: { extra: '这是选择审批单的说明', permission: 1, linkTemplate: 1 } },
        // 关联组织架构
        { code: 'LINKORGANIZE', type: 'FormLinkOrganize', name: '关联组织架构', required: true, readonly: 0, value: 40, props: { extra: '这是关联组织架构的说明', permission: 1, current: true } },
        // 关联员工
        { code: 'LINKSTAFF', type: 'FormLinkStaff', name: '关联员工', required: true, readonly: 0, value: [106, 71], props: { extra: '这是关联员工的说明', permission: '', current: true } }
      ]
    }
  }
}
</script>
