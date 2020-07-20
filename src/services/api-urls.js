/* eslint-disable */
const auth_service = 'auth'
const profile = 'profile'
const wallet = 'wallet'
const account = 'account'
const otp = 'otp'

export default {
  registration: auth_service + '/register',
  login: auth_service + '/login',
  check_2fa: auth_service + '/token',

  profile,
  profile_2fa: profile + '/2fa',
  profile_email: profile + '/email',
  profile_lang: profile + '/lang',
  set_fiat: profile + '/fiat',
  set_session: profile + '/session',

  resend_email: otp + '/email',

  wallet,
  get_missing_wallet: wallet + '/missing',
  address: wallet + '/address',
  wallet_book: wallet + '/book',

  account,
}
