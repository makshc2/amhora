const Registration = () => import ('../components/Wallet/Auth/RegistrationComponent/Registration')
const Login = () => import ('../components/Wallet/Auth/LoginComponent/Login')
const Auth = () => import ('../components/Wallet/Auth/Auth')
const SettingsUser = () => import ('../components/Wallet/Profile/Settings/Settings')
const Profile = () => import ('../components/Wallet/Profile/Profile')
const WelcomePage = () => import ('../components/Wallet/Auth/WelcomePage')
const RecoverAccess = () => import ('../components/Wallet/Auth/RestoreAccess/RecoverAccess')
const ReadOnlyLogin = () => import ('../components/Wallet/Auth/LoginComponent/ReadOnlyLogin')
const UserWallet = () => import ('../components/Wallet/Profile/UserWallet')
const CryptoWallet = () => import ('../components/Wallet/Profile/WalletPage/CryptoWallet/CryptoWallet')
const RecoveryAccount = () => import ('../components/Wallet/Auth/RecoveryAccount/RecoveryAccount')

export default [
  {
    path: 'welcome-page',
    name: 'WelcomePage',
    component: WelcomePage,
    beforeEnter (to, from, next) {
      if (!localStorage.getItem('sessionToken')) {
        next()
        return
      }
      next({ name: 'Profile' })
    }
  },
  {
    path: 'auth',
    name: 'Auth',
    component: Auth,
    children: [
      {
        path: 'registration',
        name: 'Registration',
        component: Registration
      },
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'read-only-login',
        name: 'ReadOnlyLogin',
        component: ReadOnlyLogin
      },
      {
        path: 'recover-access',
        name: 'RecoverAccess',
        component: RecoverAccess
      },
      {
        path: 'recovery-account',
        name: 'RecoveryAccount',
        component: RecoveryAccount
      }
    ]
  },
  {
    path: 'profile',
    name: 'Profile',
    component: Profile,
    redirect: 'profile/user-wallet',
    beforeEnter (to, from, next) {
      if (localStorage.getItem('cryptoData') || localStorage.getItem('sessionToken')) {
        next()
        return
      }
      next({ name: 'WelcomePage' })
    },
    children: [
      {
        path: 'settings-user',
        name: 'SettingsUser',
        component: SettingsUser,
        meta: {
          breadcrumbs: [
            { name: 'wallet' },
            { name: 'settings' },
            { param: 'hash' }
          ]
        }
      },
      {
        path: 'user-wallet',
        name: 'UserWallet',
        component: UserWallet
      },
      {
        path: 'user-wallet/:currency',
        name: 'CryptoWallet',
        component: CryptoWallet,
        meta: {
          breadcrumbs: [
            { name: 'wallet' },
            { param: 'hash' }
          ]
        }
      }
    ]
  }
]
