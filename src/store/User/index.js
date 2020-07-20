export default {
  namespaced: true,
  state: {
    profile: null
  },
  mutations: {
    setProfile (state, data) {
      state.profile = data
    },
    logout (state, data) {
      state.profile = null
    }
  },
  getters: {
    getProfile: state => state.profile
  }
}
