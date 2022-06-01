import { minipStaffMessageStatistics, minipNoticeRead } from 'api/messageV2'

export default {
  namespaced: true,
  state: {
    all_num: 0,
    inner_notice_unread_num: 0,
    work_order_unread_num: 0,
    approval_unread_num: 0,
    all_unread_num: 0
  },
  mutations: {
    setCount (state, statistics) {
      statistics.all_unread_num = statistics.inner_notice_unread_num + statistics.work_order_unread_num + statistics.approval_unread_num

      for (const key in statistics) {
        const count = statistics[key]
        if (count > 99) {
          state[key] = '99+'
        } else if (count === 0) {
          state[key] = undefined
        } else { state[key] = count }
      }
    }
  },
  actions: {
    async updateMessageStatistics ({ commit }) {
      const res = await minipStaffMessageStatistics()
      if (res.code === 200) {
        commit('setCount', res.data)
      }
    },
    async minipNoticeRead ({ commit, dispatch }, ids) {
      const res = await minipNoticeRead({ ids: ids })
      if (res.code === 200) {
        dispatch('updateMessageStatistics')
      }
    }
  }
}
