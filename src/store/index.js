import Vue from 'vue'
import Vuex from 'vuex'
import { state } from './state'
import * as getters from './getters'
import actions from './actions'
import * as mutations from './mutations'
import ModalDialogService from './ModalDialogService/index'
import UserWallet from './UserWallet/index'
import User from './User'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    ModalDialogService,
    UserWallet,
    User
  }
})
