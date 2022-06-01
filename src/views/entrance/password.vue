<template>
  <div class="fw-container">
    <div class="content">
      <div class="info-card">
        <div>姓名：{{ info.name }}</div>
        <div>所属项目：{{ info.group_name }}</div>
      </div>
      <div v-if="isInGroup" class="info-card">
        <div class="title-1">
          {{ text }}
        </div>
        <div class="number">
          {{ passwordCode }}
        </div>
        <a
          v-if="!is4Edit"
          class="btn"
          href="Javascript:;"
          @click="goEdit()"
        >修改</a>
      </div>
      <div v-else class="info-card">
        <div style="font-size:18px;line-height:58px;text-align:center">
          您不属于此项目，不能获取门禁密码
        </div>
      </div>
    </div>

    <div v-if="is4Edit" class="btn-c btn-c-2">
      <button
        type="button"
        class="button"
        @click="createPassword()"
      >
        更换密码
      </button>
      <button
        type="button"
        class="button  button-yellow"
        @click="save()"
      >
        完成
      </button>
    </div>
    <div
      v-else
      class="btn-c"
    >
      <button
        type="button"
        style="width: 308px"
        class="button  button-yellow"
        @click="selectUser()"
      >
        修改员工密码
      </button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { miniSecretInfo, miniSecretAdd } from '@/api/entrance'
import { mapGetters } from 'vuex'

export default {
  name: 'Password',

  props: {
    isInGroup: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      dayjs,
      info: {},
      text: '当前门禁密码',
      passwordCode: '------'

    }
  },
  computed: {
    ...mapGetters([ 'userData' ]),
    is4Edit () {
      return this.$route.name === 'entrancePassword4Edit'
    }
  },
  created () {
    if (!this.userData.is_admin) {
      this.$router.replace({
        name: 'entrancePassword4Edit'
      })
    }
  },
  activated () {
    if (!this.userData.is_admin) {
      this.$router.replace({
        name: 'entrancePassword4Edit'
      })
    }
  },
  async mounted () {
    const res = await miniSecretInfo({
      'staff_id': this.userData.id,
      'code_type': 3
    })

    if (res.code === 200) {
      this.info = res.data
      this.passwordCode = ''
      if (res.data.secret_data) {
        this.passwordCode = res.data.secret_data.code
      } else {
        // 自动生成
        if (this.isInGroup) {
          const res2 = await miniSecretAdd({
            uid: Number(this.userData.id),
            user_name: this.userData.name,
            code_type: 3,
            user_type: 2,
            expire_time: 0
          // code: String(code)
          })
          if (res2.code === 200) {
            this.passwordCode = res2.data
          }
        }
      }
    }
  },
  methods: {
    selectUser () {
      this.$router.push({
        name: 'entrancePasswordStaff'
      })
    },
    goEdit () {
      this.$router.push({ name: 'entrancePassword4Edit' })
    },

    getRandom () {
      let code = '000000' + Math.floor(Math.random() * 999999)
      code = code.substr(code.length - 6)
      return code
    },
    createPassword () {
      this.$confirm({ title: '是否确认修改门禁密码',
        message: '系统将为您随机生成一个密码',
        closeOnPopstate: true })
        .then(async () => {
          // this.$toast.success('修改成功')

          this.text = '门禁密码生成中'
          this.passwordCode = '------'
          const res2 = await miniSecretAdd({
            uid: Number(this.userData.id),
            user_name: this.userData.name,
            code_type: 3,
            user_type: 2,
            expire_time: 0

          })
          if (res2.code === 200) {
            this.text = '当前门禁密码'
            this.passwordCode = res2.data
          }
          // await miniSecretChangePassword({ staff_ids: [this.userData.id] })
        }).catch(_ => {
          console.log(_)
        })
    },
    // 实际为返回操作
    save () {
      if (this.userData.is_admin) {
        this.$router.push({ name: 'entrancePassword' })
      } else {
        this.$router.push({ name: 'WorkBench' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('~@/views/entrance/style.scss');

.fw-container{
  // background-color: #E1AA6C;
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
}

::v-deep .info-card{
  position: relative;

  margin:0 16px 16px 10px;
  background: #FFFFFF;
  border-radius: 11px;
  padding:9px 22px;

  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 21px;
  div{
    margin:9px 0;
  }

  .title-1{
    text-align: center;
    font-size: 13px;
    color: #999999;
    line-height: 19px;
  }
  .number{
    text-align: center;
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 34px;
    letter-spacing: 10px;
  }
  .btn{
    position: absolute;
    right: 22px;
    top: 7px;
    display:block;
    font-size: 13px;
    color: #E1AA6C;
    line-height: 19px;
  }
}
.content{
  flex:1;
  padding:25px 0 0 0;
  background-image: url(~@/assets/pswpagebg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

</style>
