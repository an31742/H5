<!--
  功能：物品清单
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2022年03月29日 14:39:28
-->
<template>
  <div class="goods-list">
    <van-field
      :value="value"
      name="goods"
      input-align="right"
      class="fw-field bdn"
      label="物品清单"
      readonly
    >
      <template #input>
        <van-button
          v-show="!disabled"
          icon="plus"
          size="small"
          type="primary"
          color="#E1AA6C"
          @click="addItem"
        />
      </template>
    </van-field>
    <div>
      <div class="card">
        <div class="card-item" v-for="(i, k) in goods" :key="i.key">
          <van-field
            v-model="i.name"
            :readonly="disabled"
            label="物品名称"
            placeholder="请输入物品名称"
            input-align="right"
            maxlength="10"
          />
          <van-field
            v-model="i.num"
            :readonly="disabled"
            type="number"
            label="数量"
            placeholder="请输入物品数量"
            input-align="right"
            class="custom-border"
            maxlength="2"
          />
          <upload
            :disabled="disabled"
            :show-upload="!disabled"
            :deletable="!disabled"
            :fileList="i.pictures"
            class="card-item_upload"
            :max="i.pictures.length"
            uploadStyle="padding: 0px"
            @change="(urls) => changeFiles(urls, k)"
          ></upload>
          <van-button
            v-if="!disabled && k !== 0"
            round
            class="card-item_delete"
            icon="cross"
            size="mini"
            type="primary"
            color="rgba(0, 0, 0, .5)"
            @click="deleteItem(k)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import upload from '@/views/components/upload_form'
const item = {
  name: '',
  num: '',
  pictures: []
}
const getUnionId = function () {
  return new Date().getTime()
}
export default {
  // 组件名称
  name: 'GoodsList',
  // 组件参数 接收来自父组件的数据
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    propertys: {
      type: Array,
      default: () => []
    }
  },
  // 局部注册的组件
  components: {
    upload
  },
  // 组件状态值
  data () {
    return {
      goods: [
        {
          key: getUnionId(),
          name: '',
          num: '',
          pictures: []
        }
      ]
    }
  },
  // 计算属性
  computed: {
    value () {
      return JSON.stringify(this.goods)
    }
  },
  // 侦听器
  watch: {
    propertys: {
      handler (val) {
        if (val.length > 0) {
          this.goods = val.map(i => (
            {
              name: i.property_name,
              num: i.num,
              pictures: JSON.parse(i.pictures)
            }
          ))
        }
      },
      immediate: true
    }
  },
  // 组件方法
  methods: {
    validator () {
      let status = true
      for (let i = 0; i < this.goods.length; i++) {
        const item = this.goods[i]
        if (!item.name || !Number(item.num) || !item.pictures.length) {
          status = false
          break
        }
      }
      return status
    },
    addItem () {
      const itemCopy = JSON.parse(JSON.stringify(item))
      itemCopy.key = getUnionId()
      this.goods.push(itemCopy)
    },
    changeFiles (files, k) {
      this.goods[k].pictures = files.map(i => i.url)
    },
    deleteItem (k) {
      this.goods.splice(k, 1)
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 在实例初始化之后，组件属性计算之前，如data属性等
  */
  beforeCreate () {
  },
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  */
  created () {
  },
  /**
  * 在挂载开始之前被调用：相关的 render 函数首次被调用。
  */
  beforeMount () {
  },
  /**
  * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
  */
  mounted () {
  },
  /**
  * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
  * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
  */
  beforeUpdate () {
  },
  /**
  * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
  * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
  */
  updated () {
  },
  /**
  * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
  */
  activated () {
  },
  /**
  * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
  */
  deactivated () {
  },
  /**
  * 实例销毁之前调用。在这一步，实例仍然完全可用。
  */
  beforeDestroy () {
  },
  /**
  * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
  * 所有的事件监听器会被移除，所有的子实例也会被销毁。
  */
  destroyed () {
  }
}
</script>

<style lang="scss" scoped>
  .goods-list {
    box-sizing: border-box;
    div, span {
      box-sizing: border-box;
    }
    .card {
      width: 375px;
      position: relative;
      right: -16px;
      left: -16px;
      background-color: #eeeeee;
      padding: 16px;
      &-item {
        position: relative;
        background-color: #fff;
        padding: 10px;
        border-radius: 8px;
        .custom-border {
          border-bottom: 1px solid #eeeeee;
        }
        &_upload {
          padding-top: 16px;
        }
        &_delete {
          width: 24px;
          height: 24px;
          position: absolute;
          top: -12px;
          right: -12px;
          border: none;
        }
      }
      &-item:not(:first-child) {
        margin-top: 16px;
      }
    }
  }
</style>
