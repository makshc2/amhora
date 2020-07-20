import { STORAGE_KEY } from './state'

function isLocalStorageNameSupported () {
  const testKey = 'test'
  const storage = window.sessionStorage
  try {
    storage.setItem(testKey, '1')
    storage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

const localStoragePlugin = store => {
  if (!isLocalStorageNameSupported()) return
  let inProces = false
  const debounceTime = 3000

  store.subscribe((mutation) => {
    if (!inProces) {
      inProces = true
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, store.state)
        inProces = false
      }, debounceTime)
    }
    if (mutation.type === 'CLEAR_ALL_DATA') {
      localStorage.removeItem(STORAGE_KEY)
    }
  })
}

export default [localStoragePlugin]
