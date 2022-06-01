<template>
  <div class="fw-container">
    <div class="content">
      <!-- :codeType="3"  门禁密码 -->
      <selectUser
        ref="selectUser"
        :showSelecteMode.sync="showSelecteMode"
        :selectedUser.sync="selectedUser"
        :isEmpty.sync="isEmpty"
        :isInputFocus.sync="isInputFocus"
        :codeType="3"
      >
        <template #role="{user}">
          {{ user.user_role }}
        </template>
        <template #op="{user}">
          <van-popover
            v-if="user.password_is_expired"
            v-model="user._showTip"
            placement="left-end"
            trigger="click"
          >
            <div style="color:#FF4D4F;padding: 5px;">
              密码已经使用180天，建议更换
            </div>
            <template #reference>
              <van-icon
                name="warning-o"
                color="#FF4D4F"
              />
            </template>
          </van-popover>
          <div v-else style="width:17px;height:17px">
          </div>
          <span @click="updatePassword(user)" >
            修改
          </span>
        </template>
      </selectUser>
    </div>

    <div
      v-show="!isEmpty&&!isInputFocus"
      class="btn-c"
    >
      <button
        type="button"
        style="width: 308px"
        class="button  button-yellow"
        :disabled="showSelecteMode&&selectedUser.length==0"
        @click="mutilUpdate()"
      >
        {{
          showSelecteMode ?
            `批量修改（ ${ selectedUser.length }个）`
            :`批量修改`
        }}
      </button>
    </div>
  </div>
</template>

<script>
import selectUser from '@/views/entrance/components/selectUser'
import { miniSecretChangePassword } from '@/api/entrance'

export default {
  name: 'PasswordSelectUser',
  components: {
    selectUser
  },
  data () {
    return {
      showSelecteMode: false,
      selectedUser: [],
      isEmpty: false,
      isInputFocus: false
    }
  },
  watch: {
    '$route.name': {
      handler (val) {
        // console.log(val)
        this.showSelecteMode = val === 'entrancePasswordStaffSelect'
        this.selectedUser = []

        if (this.$refs.selectUser) {
          // 初始化
          // this.$refs.selectUser.init()
        }
      },
      immediate: true
    }
  },
  mounted () {
    console.log('mounted')
  },
  activated () {
    console.log('activated')
  },

  methods: {

    selectUser () {
      this.$router.push({
        name: 'entranceFaceSelectUser'
      })
    },
    updatePassword (user) {
      this.$confirm({ title: '是否确认修改该员工门禁密码',
        message: '系统将为该员工随机生成一个密码，修改后会发送消息通知该员工',
        confirmButtonColor: '#BC8D58',
        closeOnPopstate: true })
        .then(async () => {
          await this.secretChangePassword([user.id])
        }).catch(_ => {})
    },
    async secretChangePassword (ids) {
      const res = await miniSecretChangePassword({ staff_ids: ids })

      if (res.code === 200) {
        this.$toast.success('修改成功')
        // this.showSelecteMode = false
        this.selectedUser = []
        this.$refs.selectUser.getList()
        // this.$router.replace({ name: 'entrancePasswordStaff' })
      } else {

      }
    },

    mutilUpdate () {
      if (this.showSelecteMode) {
        this.$confirm({ title: '是否确认修改选中员工门禁密码',
          message: '系统将为每个选中的员工随机生成一个密码，并同时发送消息通知对应员工',
          closeOnPopstate: true })
          .then(async () => {
            const ids = this.selectedUser.map(t => t.id)
            await this.secretChangePassword(ids)
          }).catch(_ => {
            console.log(_)
          })
      } else {
        // this.showSelecteMode = true
        this.selectedUser = []

        this.$router.push({ name: 'entrancePasswordStaffSelect' })
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
  height: 100vh;

}
.content{
  flex: 1;
  overflow: scroll;
  background-color: #fff;
}

::v-deep  .tip{
     color:#FF4D4F;
     padding: 5px;
}
.btn-c{
  z-index: 1;
}
</style>
