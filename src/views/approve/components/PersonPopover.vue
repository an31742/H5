<template>
  <van-popover
    ref="userInfoCard"
    v-model="showPopover"
    trigger="click"
    :placement="placement"
  >
    <template #reference>
      <span v-if="person.name" class="appeal-name">{{ person.name || '' }}</span>
    </template>
    <template #default>
      <div class="appeal-user">
        <van-image width="46" height="46" round fit="cover" :src="person.avatar || require('@/assets/image/user.png')" />
        <div class="appeal-user-info">
          <p>{{ person.name }}</p>
          <p class="appeal-user-info-dep">{{ person.department }} | {{ person.role }}</p>
        </div>
        <span class="appeal-user-close" @click="showPopover = false">+</span>
      </div>
    </template>
  </van-popover>
</template>
<script>
export default {
  name: 'PersonPopover',
  props: {
    person: {
      type: Object,
      default () {
        return {}
      }
    },
    placement: {
      type: String,
      default: 'top'
    }
  },
  data: () => ({
    showPopover: false
  }),
  methods: {
    showUserInfo (ind) {
      this.trackData[ind].showPopover = true
      this.$set(this.trackData, ind, this.trackData[ind])
    },

    hideUserInfo (ind) {
      this.trackData[ind].showPopover = false
      this.$set(this.trackData, ind, this.trackData[ind])
    }
  }
}
</script>
<style lang="scss" scoped>
	.appeal-name {
		font-size: 14px;
		font-weight: 400;
		color: #BC8D58;
		line-height: 22px;
		padding-right: 8px;
		box-sizing: border-box;
	}

	.appeal-user {
		padding: 9px 20px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		min-width: 220px;
		position: relative;
	}

	.appeal-user-info {
		margin-left: 16px;
		font-size: 14px;
		color: #333333;
		line-height: 22px;
	}

	.appeal-user-info-dep {
		font-size: 12px;
		color: #999;
		margin-top: 2px;
	}

	.appeal-user-close {
		font-size: 24px;
		color: #999;
		transform: rotate(45deg);
		position: absolute;
		right: 6px;
		top: -8px;
		font-weight: 300;
	}
</style>
