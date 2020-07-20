import axios from 'axios'
import VueAxios from 'vue-axios'
import store from '../store'
import Vue from 'vue'
import { config } from '../GlobalConfig.js'

Vue.use(VueAxios, axios)

axios.defaults.baseURL = config.newApiServer
axios.interceptors.response.use(res => res, error => {
  if (error.response.data && error.response.data.code === 'ACL_FAILED') {
    store.commit('ModalDialogService/openModalDialog', {
      dialogName: 'MainInformerDialog',
      payload: {
        header: 'global.warning',
        info: 'validation_errors.full_access',
        btn: 'global.ok',
        icon: 'fas fa-exclamation-triangle'
      }
    })
    return Promise.reject(error.response.data)
  }
  if (error.response.data && (error.response.data.code === 'TOKEN_EXPIRED' || error.response.data.code === '2FA_NOT_PASSED')) {
    store.commit('ModalDialogService/openModalDialog', {
      dialogName: 'SessionPassword'
    })
  }
  return Promise.reject(error.response)
})
