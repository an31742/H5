<template>
  <div class="approve entry">
    <div class="approve-main">
      <p class="approve-title">基本信息</p>
      <div class="approve-item" v-if="type === 'consumables'">
        <p class="approve-title-basic">
          {{ detail.assets_name }}
        </p>
        <div class="approve-text">
          <p>物资分类：{{ detail.assets_level_name }}</p>
          <p>品牌：{{ detail.brand }}</p>
        </div>
        <div class="approve-text">
          <p>规格型号：{{ detail.model_specification }}</p>
          <p>单位：{{ detail.unit }}</p>
        </div>
        <div class="approve-text">
          <p>库存数量：{{ detail.total }}</p>
        </div>
      </div>
      <div class="approve-item" v-if="type === 'fixedCapital'">
        <p class="approve-title-basic">
          {{ detail.name }}
        </p>
        <div class="approve-text">
          <p>物资分类：{{ detail.assets_level_name }}</p>
          <p>资产编号：{{ detail.series }}</p>
        </div>
        <div class="approve-text">
          <p>品牌：{{ detail.brand }}</p>
          <p>规格型号：{{ detail.model_specification }}</p>
        </div>
        <div class="approve-text">
          <p>设备序列号：{{ detail.serial }}</p>
          <p>单位：{{ detail.unit }}</p>
        </div>
      </div>
      <p class="approve-title">盘点录入</p>
      <!--    低值易耗品-->
      <div v-if="type === 'consumables'" class="form-content">
        <van-form @submit="submit" scroll-to-error>
          <div>
            <van-field name="stepper" label="盘点数量" class="icon-item">
              <template #input>
                <!-- <van-stepper v-model="form.check_total" /> -->
                <button class="step-reduc" @click.prevent="handleReducConsumables">
                  <van-icon name="minus" />
                </button>
                <input
                  class="step-input"
                  type="text"
                  v-model="form.check_total"
                  @blur="onBlurConsumables"
                />
                <button class="step-add" @click.prevent="handleAddConsumables">
                  <van-icon name="plus" />
                </button>
              </template>
            </van-field>
            <van-field
              autosize
              show-word-limit
              type="text"
              label="盘点差异"
              :value="Number(form.check_total) - Number(detail.total)"
            ></van-field>

            <van-field
              v-if="Number(this.form.check_total) - Number(this.detail.total) === 0"
              value="盘实"
              autosize
              show-word-limit
              type="text"
              label="盘点结果"
            ></van-field>
            <van-field
              v-if="Number(this.form.check_total) - Number(this.detail.total) >0"
              value="盘盈"
              autosize
              show-word-limit
              type="text"
              label="盘点结果"
            ></van-field>
            <van-field
              v-if="Number(this.form.check_total) - Number(this.detail.total)< 0"
              value="盘亏"
              autosize
              show-word-limit
              type="text"
              label="盘点结果"
            >
            </van-field>
            <van-field
              v-model="form.content"
              rows="2"
              autosize
              show-word-limit
              type="textarea"
              label="盘亏盘盈情况说明"
              maxlength="100"
              placeholder="请输入, 100字以内"
              :class="[Number(this.form.check_total) - Number(this.detail.total) !== 0?'icon-item':'']"
              :rules="[{ required: Number(this.form.check_total) - Number(this.detail.total) !== 0, message: '' }]"
            />
          </div>

          <!--        <div class="button-box">-->
          <!--          <van-button-->
          <!--            color="#E1AA6C"-->
          <!--            native-type="submit"-->
          <!--            size="small"-->
          <!--          >保存，返回上一页</van-button>-->
          <!--        </div>-->
        </van-form>
      </div>
      <!--    固资-->
      <div v-if="type === 'fixedCapital'" class="form-content others">
        <van-form @submit="submit1" ref="vanform">
          <div>
            <van-field
              readonly
              clickable
              name="picker"
              :value="form1.status"
              label="使用状态"
              placeholder="请选择使用状态"
              class="icon-item"
              :rules="[{ required: true, message: '' }]"
              @click="showPicker = true"
            />
            <van-popup v-model="showPicker" position="bottom">
              <van-picker
                :default-index="2"
                show-toolbar
                :columns="columnsStatus"
                @confirm="onConfirm"
                @cancel="showPicker = false"
              />
            </van-popup>
            <van-field
              readonly
              clickable
              name="picker"
              :value="form1.department"
              label="使用部门"
              placeholder="请选择使用部门"
              @click="showPicker1 = true"
            />
            <van-popup v-model="showPicker1" position="bottom">
              <van-cascader
                v-model="cascaderValue"
                title="请选择使用部门"
                :field-names="fieldNames"
                :options="columnsStatus1"
                @close="showPicker1 = false"
                @finish="onConfirm1"
              />
            </van-popup>
            <van-field
              readonly
              clickable
              name="picker"
              :value="form1.user_name"
              label="使用人"
              placeholder="请选择使用人"
              @click="selectRelatedStaff"
            />
            <!--选择员工弹层-->
            <van-popup
              v-model="showPicker2"
              position="bottom"
              class="fake-popup form-component"
            >
              <search-list
                ref="sl"
                emptyText="没有搜索到员工"
                placeholder="输入姓名查找员工"
                :api="getStaffList"
                :apiParams="apiParams"
                @confirm="selectStaff"
                @cancel="showPicker2=false"
              >
                <template #item="{ item }">
                  <div class="user-name">
                    {{ item.name }}
                  </div>
                </template>
              </search-list>
            </van-popup>
            <!-- <van-popup v-model="showPicker2" position="bottom">
              <van-picker
                show-toolbar
                value-key="name"
                :columns="columnsStatus2"
                @confirm="onConfirm2"
                @cancel="showPicker2 = false"
              />
            </van-popup> -->
            <van-field name="stepper" label="盘点数量" class="icon-item">
              <template #input>
                <!-- <van-stepper v-model="form1.total" /> -->

                <button class="step-reduc" @click.prevent="handleReduc" >
                  <van-icon name="minus" />
                </button>
                <input
                  class="step-input"
                  type="text"
                  v-model="form1.total"
                  @blur="onBlur"
                />
                <button class="step-add" @click.prevent="handleAdd" >
                  <van-icon name="plus" />
                </button>
              </template>
            </van-field>
            <van-field
              v-model="form1.locale"
              label="存放地点"
              placeholder="请输入"
              class="icon-item"

              :rules="[{ required: true, message: '请输入存放地点' }]"
            />
            <van-field
              v-model="form1.content"
              rows="2"
              :key="this.form1.total"
              :class="[this.form1.total!==0?'icon-item':'']"
              autosize
              label="盘亏盘盈情况说明"
              type="textarea"
              maxlength="100"
              placeholder="请输入, 100字以内"
              :rules="[{ required: this.form1.total!==0, message: '' }]"
              show-word-limit
            />
            <van-field name="uploader" label="照片上传" class="icon-items">
              <template #input>
                <upload
                  ref="upload"
                  :max="1"
                  :hideTips="true"
                  :fileList="commentUploadImg"
                  uploadStyle="padding: 0;"
                  @change="list => (commentUploadImg = list)"
                >
                  <slot>
                    <div class="van-uploader__upload">
                      <i
                        class="van-icon van-icon-plus van-uploader__upload-icon"
                      ></i>
                      <span class="van-uploader__upload-text">上传图片</span>
                    </div>
                  </slot>

                  <template #preview-cover="{ item }">
                    <slot name="preview-cover" :item="item"></slot>
                  </template>
                </upload>
              </template>
            </van-field>
          </div>

        </van-form>
      </div>
    </div>

    <div class="button-box">
      <van-button
        @click="type === 'consumables' ? submit() : submit1()"
        color="#E1AA6C"
        native-type="submit"
        size="small"
      >保存，返回上一页</van-button>
    </div>
  </div>
</template>

<script>

import upload from '@/views/components/upload_form'
import SearchList from './components/SearchList'
import { getDepartmentTree, getDepartmentUse, submitTaskFixed, submitTask, getStaffList } from 'api/materials'

export default {
  name: 'Entry',
  components: {
    upload,
    SearchList
  },
  data () {
    return {
      type: this.$route.query.type,
      form: {
        check_total: 1,
        // diff: Number(this.form.check_total) - Number(this.detail.total),
        diff: null,
        results: null,
        content: ''
      },
      form1: {
        status_int: '',
        user_id: '',
        locale: '',
        total: 1,
        content: '',
        department_id: '',
        name: '',
        status: '',
        department: ''
      },
      cascaderValue: '',
      showPicker: false,
      showPicker1: false,
      showPicker2: false,
      taskStatus: [{ label: '正常', value: 1 }, { label: '故障', value: 2 }, { label: '维修中', value: 3 }],
      columnsStatus: [
        {
          text: '正常',
          id: 1
        },
        {
          text: '故障',
          id: 2
        },
        {
          text: '维修中',
          id: 3
        }
      ],
      commentUploadImg: [],
      columnsStatus1: [],
      id: Number(this.$route.query.id),
      assetType: Number(this.$route.query.assetType),
      detail: JSON.parse(this.$route.query.detail),
      columnsStatus2: [],
      fieldNames: {
        text: 'name',
        value: 'id',
        children: 'children'
      },
      getStaffList,
      apiParams: {}
    }
  },

  created () {
    this.getData()
    this.getUseName()
    this.getChecked()
  },
  mounted () {
    this.form1 = this.detail
    this.commentUploadImg[0] = this.detail.pic_path
    this.form1.status = this.getItemByValue(this.columnsStatus, this.detail.status)
    this.form.check_total = this.detail.check_total
    this.form.content = this.detail.content

    window.addEventListener('resize', () => {
      console.log(123)
      console.log(document.activeElement.tagName)
      if (document.activeElement.tagName === 'INPUT') {
        console.log(123)
        window.setTimeout(() => {
          document.activeElement.scrollIntoViewIfNeeded()
        }, 100)
      }
    })

    // const sel = this.$route.meta.scrollContainerSelecter || '.scroll-position'
    //
    // this.scrollContainer = document.querySelector(sel)
    //
    // if (this.scrollContainer) {
    //   this.scrollContainer.addEventListener('scroll', debounce(this.onScroll, 30), false)
    // }
  },
  methods: {
    // 选择员工弹框
    selectRelatedStaff () {
      this.showPicker2 = true
      this.$nextTick(() => {
        this.$refs.sl.show()
      })
    },

    getItemByPeople (options = [], value) {
      const item = options.find(item => item.id === value)
      return item ? item.name : ''
    },
    getItemByValue (options = [], value) {
      const item = options.find(item => item.id === value)
      return item ? item.text : ''
    },
    // 固定物资因为vant进步器不支持为0所以写的原生
    onBlurConsumables () {
      if (this.form.check_total === '' || this.form.check_total === null || this.form.check_total === undefined) {
        this.form.check_total = 0
      } else if (this.form.check_total <= 0 && this.form.check_total) {
        this.form.check_total = 0
      } else if (!(/(^[1-9]\d*$)/.test(this.form.check_total))) {
        this.form.check_total = Math.round(this.form.check_total)
      }
    },
    handleReducConsumables () {
      if (this.form.check_total > 0 && this.form.check_total) {
        this.form.check_total--
      } else if (this.form.check_total === 0 && this.form.check_total) {
        this.form.check_total = 0
      } else if (this.form.check_total === '' || this.form.check_total === null || this.form.check_total === undefined) {
        this.form.check_total = 0
      }
    },
    handleAddConsumables () {
      this.form.check_total++
    },
    // 固定物资因为vant进步器不支持为0所以写的原生
    onBlur () {
      if (this.form1.total === '' || this.form1.total === null || this.form1.total === undefined) {
        this.form1.total = 1
      } else if (this.form1.total > 0 && this.form1.total) {
        this.form1.total = 1
      } else if (this.form1.total === 0 && this.form1.total) {
        this.form1.total = 0
      }
    },
    handleReduc () {
      if (this.form1.total > 0 && this.form1.total) {
        this.form1.total--
      } else if (this.form1.total === 0 && this.form1.total) {
        this.form1.total = 0
      } else if (this.form1.total === '' || this.form1.total === null || this.form1.total === undefined) {
        this.form1.total = 0
      }
    },
    handleAdd () {
      if (this.form1.total === 0) {
        this.form1.total++
      } else if (this.form1.total >= 1 && this.form1.total) {
        this.form1.total = 1
      } else if (this.form1.total === '' || this.form1.total === null || this.form1.total === undefined) {
        this.form1.total = 1
      }
    },
    getChecked () {
      const map = this.jsonToMap(localStorage.getItem('entryMap'))
      for (const key of map.keys()) {
        if (key === Number(this.$route.query.itemId)) {
          this.form1 = map.get(key)
          this.commentUploadImg[0] = map.get(key).pic_path
        }
      }
      const map1 = this.jsonToMap(localStorage.getItem('entryMap1'))
      for (const key1 of map1.keys()) {
        if (key1 === Number(this.$route.query.itemId)) {
          this.form = map1.get(key1)
        }
      }
    },
    submit (values) {
      const data = {
        id: this.id,
        status: 1, // 1保存；2提交
        assets: [{
          id: Number(this.$route.query.itemId),
          check_total: Number(this.form.check_total),
          content: this.form.content,
          is_check: 1
        }]
      }
      console.log(data)

      submitTask(data).then(res => {
        if (res.code === 200) {
          // localStorage.removeItem('entryMap1')
          this.$toast('保存成功')
          this.$router.back()
        } else {
          this.$toast(res.msg)
        }
      })
      // const flagsMap = this.jsonToMap(localStorage.getItem('entryMap1'))
      // if (flagsMap.size > 0) {
      //   flagsMap.set(Number(this.$route.query.itemId), assets)
      //   localStorage.setItem('entryMap1', this.mapToJson(flagsMap))
      // } else {
      //   const entryMap1 = new Map()
      //   entryMap1.set(Number(this.$route.query.itemId), assets)
      //   localStorage.setItem('entryMap1', this.mapToJson(entryMap1))
      // }
      // this.$router.replace({
      //   name: 'MaterialsCountedDetail',
      //   query: {
      //     id: this.id,
      //     assetType: this.assetType
      //   }
      // })
    },
    mapToJson (map) {
      return JSON.stringify([...map])
    },
    jsonToMap (jsonStr) {
      return new Map(JSON.parse(jsonStr))
    },
    submit1 (values) {
      console.log(2222)
      console.log(this.form1)
      console.log(this.commentUploadImg)
      const data = {
        id: this.id,
        status: 1, // 1保存；2提交
        assets: [{
          id: Number(this.$route.query.itemId),
          status_int: this.form1.status_int, // 使用状态；
          department_id: this.form1.department_id,
          locale: this.form1.locale,
          content: this.form1.content,
          total: this.form1.total,
          user_id: this.form1.user_id,
          is_check: 1
        }]
      }

      if (this.form1.status_int === undefined) {
        const item = this.columnsStatus.find(item => item.text === this.form1.status)
        data.assets[0].status_int = item.id
      }
      // if (values.uploader.length === 1) {
      //   data.assets[0].pic_path = values.uploader[0].url
      // }
      if (this.commentUploadImg.length === 1) {
        data.assets[0].pic_path = this.commentUploadImg[0].url
      }
      console.log(data)
      // 设置了盘点人为什么还是返回不是当前指定盘点人
      submitTaskFixed(data).then(res => {
        if (res.code === 200) {
          localStorage.removeItem('entryMap')
          this.$toast('保存成功')
          this.$router.back()
        } else {
          this.$toast(res.msg)
        }
      })

      // this.$router.replace({
      //   name: 'MaterialsCountedDetail',
      //   query: {
      //     id: this.id,
      //     assetType: this.assetType
      //   }
      // })
    },
    onConfirm (values) {
      this.showPicker = false
      this.form1.status_int = values.id
      this.form1.status = values.text
    },
    onConfirm1 ({ selectedOptions }) {
      this.showPicker1 = false
      this.form1.department_id = selectedOptions[selectedOptions.length - 1].id
      this.form1.department = selectedOptions.map((option) => option.name).join('/')
    },
    onConfirm2 (values) {
      this.showPicker2 = false
      this.form1.user_id = values.id
      this.form1.name = values.name
    },
    // 获取部门数据接口
    getData () {
      getDepartmentTree().then(res => {
        if (res.code === 200) {
          this.columnsStatus1 = res.data
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 获取使用人接口   接口不对要求后端重新提供一个接口
    getUseName () {
      getDepartmentUse().then(res => {
        if (res.code === 200) {
          const peopleData = res.data.list
          this.columnsStatus2 = JSON.parse(JSON.stringify(peopleData))
          this.form1.name = this.getItemByPeople(this.columnsStatus2, this.detail.user_id)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 选择使用人
    selectStaff (values) {
      console.log(1111)
      console.log(values)
      this.showPicker2 = false
      this.form1.user_id = values.id
      this.form1.user_name = values.name
    }
  }
}
</script>

<style lang="scss">
.entry {
  .van-field__label {
    width: 112px;
  }
}
</style>
<style scoped lang="scss">
.approve {
  height: 100vh;
  background: #f6f8fa;
  .approve-main {
    height: calc(100vh - 60px);
    overflow: auto;
  }
  .button-box {
    height: 60px;
    line-height: 60px;
    //margin-top: 10px;
    background: #fff;
    //padding: 8px 0;
    //position: absolute;
    //bottom: 0;
    width: 100%;
    text-align: center;
    .van-button {
      width: 200px;
      border-radius: 5px;
    }
  }
  &-title {
    padding: 12px 16px 4px;
    box-sizing: border-box;
    font-size: 12px;
    color: #999;
    font-weight: 400;
    line-height: 16px;
  }

  &-title-basic {
    font-size: 16px;
    color: #333;
    font-weight: 400;
    line-height: 22px;
    margin-bottom: 12px;
  }

  &-item {
    padding: 12px 16px;
    box-sizing: border-box;
    background: #fff;
    margin-top: 4px;
  }

  &-text {
    font-size: 14px;
    color: #888;
    font-weight: 400;
    line-height: 20px;
    margin-top: 8px;
    p {
      display: inline-block;
      &:first-child {
        width: 55%;
      }
      span {
        color: #1a7aff;
      }
    }
  }

  &-item {
    font-size: 14px;
    color: #888;
    font-weight: 400;
    line-height: 20px;
    margin-top: 8px;
  }
  .form-content {
    background: #fff;
    .list-form {
      display: flex;
      padding-left: 5px;
      box-sizing: border-box;
    }
    .icon-item:before {
      display: inline-block;
      content: "*";
      color: red;
      position: relative;
      right: 5px;
    }
    .icon-items:before {
      display: inline-block;
      content: "*";
      color: transparent;
      position: relative;
      right: 5px;
    }
  }
  .others {
    padding-bottom: 60px;
    box-sizing: border-box;
  }

}
.fake-popup {
  height: 90%;width: 100%;font-family: PingFangSC-Regular, PingFang SC;
  position: fixed;
  left: 0;
  overflow: hidden;
  bottom: 0;
  border-radius: 0 !important;
}
.step-add {
  position: relative;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  margin: 0;
  padding: 0;
  color: #323233;
  vertical-align: middle;
  background-color: #f2f3f5;
  border: 0;
  cursor: pointer;
}
.step-reduc {
  position: relative;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  margin: 0;
  padding: 0;
  color: #323233;
  vertical-align: middle;
  background-color: #f2f3f5;
  border: 0;
  cursor: pointer;
}
.step-input {
  box-sizing: border-box;
  width: 34px;
  height: 28px;
  margin: 0 2px;
  padding: 0;
  color: #323233;
  font-size: 0.37333rem;
  line-height: normal;
  text-align: center;
  vertical-align: middle;
  background-color: #f2f3f5;
  border: 0;
  border-width: 0.02667rem 0;
  border-radius: 0;
  -webkit-appearance: none;
}
</style>
