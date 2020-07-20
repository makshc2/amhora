import axios from 'axios'
import { newConfig } from '../../GlobalConfig'

export default function setup () {
  axios.interceptors.request.use(
    function (config) {
      config.baseURL = newConfig.newApiServer
      const token = localStorage.getItem('sessionToken')
      if (token) {
        config.headers['X-Auth-Token'] = token
      }
      return config
    }
  )
}
