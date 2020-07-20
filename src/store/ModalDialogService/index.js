const state = {
  isOpened: false,
  dialogName: '',
  payload: null,
  isConfirmOpened: false,
  confirmPayload: {}
}
const getters = {

}
const mutations = {
  openModalDialog (state, { payload, dialogName }) {
    state.isOpened = true
    state.dialogName = dialogName
    state.payload = payload
  },
  closeDialog () {
    state.isOpened = false
    // state.dialogName = ''
    state.payload = null
  },
  openModalConfirmDialog (state, { payload }) {
    state.isConfirmOpened = true
    state.confirmPayload = payload
  },
  closeModalConfirmDialog () {
    state.isConfirmOpened = false
    state.confirmPayload = {}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
