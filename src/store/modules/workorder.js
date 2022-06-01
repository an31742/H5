export default {
  namespaced: true,
  state: {
    node_data: {},
    formModel: {},
    materialList: [],
    selectList: []

  },
  mutations: {
    setNodeData (state, data) {
      state.node_data = data
    },
    SET_FORM_MODEL (state, data) {
      state.formModel = data
    },
    SET_MATERIAL_LIST (state, data) {
      state.materialList = data
    },
    SET_SELECT_LIST (state, data) {
      state.selectList = data
    }
  },
  actions: {

  },
  getters: {

  }
}
