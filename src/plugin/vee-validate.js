import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate'
import { required, email, confirmed } from 'vee-validate/dist/rules'

import { translationsEn } from '../assets/resources/i18n/en'
import { translationsRu } from '../assets/resources/i18n/ru'

extend('required', required)

extend('only_numeric', {
  validate: value => /^\d+\.?\d*$/.test(value),
  message: 'validation_errors.only_numeric'
})
extend('email', email)
extend('confirmed', confirmed)
extend('password', {
  validate: value => /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g.test(value)
})
extend('user_name', {
  validate: value => /^[A-Za-z0-9]{0,14}$/.test(value)
})

localize({
  en: { messages: translationsEn.validation_errors },
  ru: { messages: translationsRu.validation_errors }
})

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
