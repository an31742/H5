export default {
  namespaced: true,
  state: {
    updateListData: {}
  },
  mutations: {
    SET_UPDATE_LIST_DATA (state, data) {
      state.updateListData = data
    }
  },
  actions: {
    setUpdateListData ({ commit }, payload) {
      commit('SET_UPDATE_LIST_DATA', payload)
    }
  },
  getters: {
    updateListData (state) {
      return state.updateListData
    }
  }
}
