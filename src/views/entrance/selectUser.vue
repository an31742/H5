<template>
  <div class="fw-container">
    <selectUser ref="selectUser">
      <template #op="{user}">
        <span>
          {{ user.has_face_secret?"更新":"录入" }}
          <span class="list-item__btn" @click="faceEdit(user)"></span>
        </span>
      </template>
    </selectUser>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import selectUser from '@/views/entrance/components/selectUser'

export default {
  name: 'Face',
  components: { selectUser },
  data () {
    return {
      dayjs,
      searchKey: ''
    }
  },
  activated () {
    // this.$refs.selectUser.pageReset()
    // this.$forceUpdate()
    if (this.$refs.selectUser) {
      // 刷新数据
      this.$refs.selectUser.getList()
      this.$forceUpdate()
    }
  },
  mounted () {
    // console.log('mounted () ')
    // 初始化控件
    this.$refs.selectUser.init()
  },
  methods: {
    startSearch () {},
    resetSearch () {},
    next () {
      this.$router.push({
        name: 'entranceFaceEdit'
      })
    },
    faceEdit (user) {
      const item = {
        id: user.id,
        name: user.name,
        group_id: user.dep_id
      }
      this.$router.push({
        name: 'entranceFaceEdit',
        query: {
          id: item.id,
          name: encodeURIComponent(item.name),
          mode: 'edit',
          groupId: item.group_id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.fw-container{
  background-color: #ff6;
  height: calc(100vh - 40px);
  display: flex;
  // top: 0px;
  // left: 0px;
  flex-direction: column;

}
.linkbtn{
  display: inline-block;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #BC8D58;
  line-height: 23px;
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.f1{

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #EAC9A5;
}
.f2{
font-size: 16px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #BC8D58;
line-height: 23px;
}

.empty{
  img{
    width: 250px;
    margin-bottom: 50px;
  }

}

.flex-center{
  flex:1;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
}
.flex-row-center{
  flex:1;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
}
ul{
  li{
    padding: 12.5px 16px;
    border-bottom: #EFEFEF solid 1px;

    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 21px;

    span{
      display: inline-block;
      margin-right: 2px;
    }
    span.right{
      width: 60px;
      margin-right: 0;
      float:right;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
  li.title{
    padding: 10px 16px;
    color: #999999;
    line-height: 17px;
    background: #F6F8FA;
    border-bottom: #EFEFEF solid 0px;
  }
}
.grey{
  color: #999999;
}
ul.memu{
  li.selected{
    background: #FAF7F4;
  }
  li.selected:before{
    width: 2px;
    height: 20px;
    content:" ";
    display: inline-block;
    position: absolute;
    left: 0px;
    background-color: #E1AA6C;
  }

}
.list-item__btn {
  display: block;
  position: absolute;
  top: -10px;
  bottom: -10px;
  right: -20px;
  left: -20px;
  z-index: 1;
  background-color: #fff;
  opacity: 0;
}

</style>
